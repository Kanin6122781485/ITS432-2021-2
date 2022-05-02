import React, { useState } from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button, Image, FlatList, SafeAreaView, } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as ImagePicker from 'expo-image-picker';

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, push, set, get } from "firebase/database";
import { ref as databaseRef }  from "firebase/database";
import uuid from 'uuid';
import Moment from 'moment';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYnY7JjliRXgamZ7AEaWEBT7pHdy1vEBQ",
  authDomain: "its432-project.firebaseapp.com",
  databaseURL: "https://its432-project-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "its432-project",
  storageBucket: "its432-project.appspot.com",
  messagingSenderId: "475037689396",
  appId: "1:475037689396:web:6431cef475924475b88c61"
};

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut, } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

class SignupLogin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      displayname: '',
      password: '',
      confirmPassword: '',
      showLogin: true,
    };
  }

  toggleShowLogin() {
    this.setState({
      showLogin: true
    })
  }

  toggleShowSignup() {
    this.setState({
      showLogin: false
    })
  }

  doLogin() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.state.username, this.state.password).then( () => {
      console.log("login successful");
      this.props.loginCB();
    })
    .catch(function(error) {
      // Handle Errors here.
      console.log(error.code);
      console.log(error.message);
      alert(error.message);
      // ...
    })
  }

  doSignup() {
    // https://firebase.google.com/docs/auth/web/password-auth

    // check if the two password fields match
    const password = this.state.password;
    const confirmPassword = this.state.confirmPassword;
    if (password === confirmPassword){
      // do signup
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.state.username, this.state.password).then( () => {
        updateProfile(auth.currentUser, {
          displayName: this.state.displayname,
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/its432-project.appspot.com/o/defaultUser.png?alt=media&token=83c9a0be-7415-41da-b92c-f7322ec741be',
        })
        const database = getDatabase();
        const postListRef = databaseRef(database, 'users');
        const newPostRef = push(postListRef);
        set(newPostRef, {
          uid: auth.currentUser.uid, 
          displayname: this.state.displayname,
          text: 'I am a new user.',
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/its432-project.appspot.com/o/defaultUser.png?alt=media&token=83c9a0be-7415-41da-b92c-f7322ec741be',
        });

        console.log("created new user successful");
        this.toggleShowLogin(); // show login page
      })
      .catch(function(error) {
        // Handle Errors here.
        console.log(error.code);
        console.log(error.message);
        alert(error.message);
      });
    }
    else {
      alert("Password do not match !!!");
    }
  }

  showSignup() {
    return (
      <View>
        <View style={styles.group}>
          <Text style={styles.title}>Email</Text>
          <TextInput style={styles.input}
            value={this.state.username}
            onChangeText={(username) => this.setState({username})}/>
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>Display Name</Text>
          <TextInput style={styles.input}
            secureTextEntry={false}
            value={this.state.displayname}
            onChangeText={(displayname) => this.setState({displayname})}/>
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>Password</Text>
          <TextInput style={styles.input}
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={(password) => this.setState({password})}
            />
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>Confirm Password</Text>
          <TextInput style={styles.input}
            secureTextEntry={true}
            value={this.state.confirmPassword}
            onChangeText={(confirmPassword) => this.setState({confirmPassword})}
            />
        </View>
        <View style={styles.center}>
          <View style={styles.group}>
            <TouchableOpacity onPress={() => {this.toggleShowLogin();}}>
              <Text style={styles.signupText}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.group}>
            <TouchableOpacity style={styles.button}
              onPress={() => {this.doSignup()}}>
              <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  showLogin() {
    return (
      <View>
        <View style={styles.group}>
          <Text style={styles.title}>Email</Text>
          <TextInput style={styles.input}
            value={this.state.username}
            onChangeText={(username) => this.setState({username})}/>
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>Password</Text>
          <TextInput style={styles.input}
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={(password) => this.setState({password})}
            />
        </View>
        <View style={styles.center}>
          <View style={styles.group}>
            <TouchableOpacity onPress={() => {this.toggleShowSignup();}}>
              <Text style={styles.signupText}>Signup</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.group}>
            <TouchableOpacity style={styles.button}
              onPress={() => {this.doLogin()}}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.containerLogin}>
        {this.state.showLogin ? this.showLogin() : this.showSignup()}
      </View>
    );
  }
}

export default function App() {
  
  const [isLoggedIn, isLoggedInSet] = useState(false);
  const [currentUser, currentUserSet] = useState('');
  const [uuid, uuidSet] = useState(''); 
  const [postData, postDataSet] = useState(null);
  const [userData, userDataSet] = useState(null);

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if(user){
    currentUserSet(user.displayName)
    uuidSet(user.uid)
    }
  });

  function readDatabase() {
    const PostRef = databaseRef(getDatabase(), 'posts/');
    get(PostRef).then((snapshot) => {
      if (snapshot.exists()) {
        postDataSet(snapshot.val())
        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  function readUserData() {
    const PostRef = databaseRef(getDatabase(), 'users/');
    get(PostRef).then((snapshot) => {
      if (snapshot.exists()) {
        userDataSet(snapshot.val())
        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  
  function loginSuccess() {
    isLoggedInSet(true);
    readDatabase();
    readUserData();
  }

  function showHome() {

    const Drawer = createDrawerNavigator()

    return (
      
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Make New Post" component={NewPostScreen} />
        <Drawer.Screen name="Setting" component={SettingScreen} />
        
      </Drawer.Navigator>
    </NavigationContainer>

    )
  }

  function showLogin() {
    return (
      <SignupLogin loginCB={loginSuccess}/>
    )
  }
  
  function HomeScreen({ navigation }) {
    let Postdata = []
    let Userdata = []

    if(postData){
      Object.keys(postData).forEach(key => {
        Postdata.push(
          { data: postData[key],
            id: key,
          })
      })
     // console.log(Postdata)
    }

    if(userData){
      Object.keys(userData).forEach(key => {
        Userdata.push(
          { data: userData[key],
            uid: userData[key].uid,
          })
      })
      //console.log(Userdata)
      
    }

    function getProfilePictureByUID(value){
      let photoURL;
      Userdata.forEach(item => {
        if(item.uid === value){
          photoURL = item.data.photoURL
        }
      })
      return photoURL;
    }

    return (
    
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Welcome!, {currentUser}</Text>
        <FlatList
          data={Postdata.reverse()}
          renderItem={({ item }) => {

            return (
                <View style={{marginBottom: 50}}>
                    <View style={{flexDirection: 'row'}}>
                      <Image style={styles.profileImage} source={{ url: getProfilePictureByUID(item.data.uid) }}/>
                      <Text>{item.data.displayname} At {Moment(item.data.createdAt).format("DD MMM YYYY hh:mm:ss")}</Text>
                    </View>
                    {item.data.imageUrl && <Image style={styles.image} source={{ url: item.data.imageUrl}}/>}
                    <Text>{item.data.text}</Text>
                </View>
            );
          }}
          keyExtractor={item => item.id}
      />
      </View>
    
      
    );
  }
  
  function NewPostScreen({ navigation }) {
    const [image, setImage] = useState(null);
    const [inputValue, setInputValue] = useState('');

    ImagePicker.requestCameraPermissionsAsync()
    //const [statusCamera, requestPermissionCamera] = ImagePicker.useCameraPermissions();
    //const [statusLibrary, requestPermissionLibrary] = ImagePicker.useMediaLibraryPermissions();

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
  
      console.log(result);
  
      if (!result.cancelled) {
        setImage(result.uri);
        handleImagePicked(result)
      }
    };

    const cameraImage = async () => {
      
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [4, 3],
        base64: true,
      });

      if (!result.cancelled) {
        setImage(result.uri);
        handleImagePicked(result)
      }
    };

    const onChange = (value) => {
      setInputValue(value);
    };
    
    const handleImagePicked = async (pickerResult) => {
      try {
        //this.setState({ uploading: true });
  
        if (!pickerResult.cancelled) {
          const uploadUrl = await uploadImageAsync(pickerResult.uri);
          setImage(uploadUrl);
          console.log(uploadUrl);
        }
      } catch (e) {
        console.log(e);
        alert("Upload failed, sorry :(");
      }
    };

    function newPost(){
      const database = getDatabase();
      const postListRef = databaseRef(database, 'posts');
      const newPostRef = push(postListRef);
      set(newPostRef, {
        uid: uuid, 
        displayname: currentUser,
        text: inputValue,
        imageUrl : image,
        createdAt: Date.now(),
      });
      setImage(null);
      setInputValue('');
      readDatabase();
      navigation.navigate('Home');
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Take Photo" onPress={cameraImage} />
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        <TextInput
          value={inputValue}
          onChangeText={onChange}
          placeholder={"Input Text..."}
        />
        <View style={{ flex: 1, justifyContent: 'flex-end', }}>
        <Button title="Make New Post" onPress={newPost} />
        </View>
      </View>
    );
  }

  function SettingScreen() {
    const [inputValue, setInputValue] = useState('');
    const [inputValueDes, setInputValueDes] = useState('');

    const onChangeDisplayName = (value) => {
      setInputValue(value);
    };

    const setDisplayName = () => {
      currentUserSet(inputValue);
      updateProfile(auth.currentUser, {
        displayName: inputValue,
      })
    };

    const onChangeDescription = (value) => {
      setInputValueDes(value);
    };

    const setDescription = () => {
      
    };

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
  
      console.log(result);
  
      if (!result.cancelled) {
        handleImagePicked(result)
      }
    };

    const handleImagePicked = async (pickerResult) => {
      try {
        if (!pickerResult.cancelled) {
          const uploadUrl = await uploadImageAsync(pickerResult.uri);
          console.log(uploadUrl);

          Userdata.forEach(data => {

          })
        }
      } catch (e) {
        console.log(e);
        alert("Upload failed, sorry :(");
      }
    };

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Profile Setting</Text>
        <TextInput
          value={inputValue}
          onChangeText={onChangeDisplayName}
          placeholder={"Set New Display Name Here..."}
        />
        <Button onPress={setDisplayName} title="Change Display Name" />

        <Button onPress={pickImage} title="Change Profile Picture" />
        <TextInput
          value={inputValueDes}
          onChangeText={onChangeDescription}
          placeholder={"Set New Description Here..."}
        />
        <Button onPress={setDescription} title="Change Description" />
        <View style={{ flex: 1, justifyContent: 'flex-end', }}>
        <Button
          onPress={() => {
            signOut(auth);
            isLoggedInSet(false);
            currentUserSet('');
          }}
          title="Logout"
        />
        </View>
      </View>
    );
  }

  function ProfileScreen(props) { 
    const [inputValue, setInputValue] = useState('');

    const onChange = (value) => {
      setInputValue(value);
    };

    const setDisplayName = () => {
      currentUserSet(inputValue);
      updateProfile(auth.currentUser, {
        displayName: inputValue,
      })
    };

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TextInput
          value={inputValue}
          onChangeText={onChange}
          placeholder={"Set New Display Name Here..."}
        />
        <Button onPress={setDisplayName} title="Change Display Name" />
        <Button
          onPress={() => {
            signOut(auth);
            isLoggedInSet(false);
            currentUserSet('');
          }}
          title="Logout"
        />
      </View>
    );
  }

  return (
    <View style={{flex:1}}>
        {isLoggedIn ? showHome() : showLogin()
          //isLoggedIn ? showHome() : showHome()
        }
    </View>
  );
}

async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileRef = ref(getStorage(), uuid.v4());
  const result = await uploadBytes(fileRef, blob);

  // We're done with the blob, close and release it
  blob.close();

  return await getDownloadURL(fileRef);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20
  },
  title: {
    fontSize: 20,
    padding: 10
  },
  searchArea: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: '#E5E4E3',
    borderRadius: 10,
    alignItems: 'center'
  },
  restaurantContainer: {
    padding: 5,
    margin: 10,
    backgroundColor: '#E5E4E3',
    width: 350,
    flex:1
  },
  restaurant: {
    padding: 5,
    margin: 5,
    backgroundColor: '#FFFFFF',
  },
  food_img: {
    width: 100,
    height: 100,
    margin: 3
  },
  star_img : {
    width: 120,
    height:30,
    margin: 3
  },
  star_container : {
    padding: 5,
    margin: 5,
    flexDirection : "row",
    backgroundColor: '#FFFFFF',
    alignItems: "center"
  },
  containerLogin: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 20
  },
  group: {
    marginTop: 20
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 20,
    borderWidth: 1
  },
  buttonText: {
    fontSize: 30
  },
  input: {
    padding: 10,
    height: 40,
    borderWidth: 1
  },
  title: {
    fontSize: 20
  },
  center: {
    alignItems: 'center'
  },
  signupText : {
    fontSize: 20,
    color: 'blue'
  },
  image: { width: 300, height: 300 },
  profileImage: { width: 30, height: 30 },
});

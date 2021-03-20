import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    picture: '',
    error:''
  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn =()=> {
    firebase.auth().signInWithPopup(provider)
      .then((result)=> {
        const {displayName, email, photoURL} = result.user;
        const signedInUser = {
          isSignIn: true,
          name: displayName,
          email: email,
          picture: photoURL
        }
        setUser (signedInUser);

        console.log(displayName, email, photoURL)
  })
      .catch(error => {
        console.log(error);
        console.logo(error.message);
      })
  };

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(() => {
      const signOutUser = {
        isSignIn: false,
          name: '',
          email: '',
          picture:''
      }
      setUser(signOutUser)
    })
    .catch(error => {
      console.log(error)
    });
  }

  const handleFbSignIn = () =>{
    firebase.auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;
    console.log(user);

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });
  }

  const handleBlur = (e) => {
    let isFildValid = true;
    if (e.target.name === 'email') {
      isFildValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length>6;
      const isPasswordHasValid =/\d{1}/.test(e.target.value);
      isFildValid = isPasswordValid && isPasswordHasValid;
    }
    if (isFildValid) {
      const newUserInfo ={...user}
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (e) => {
    //console.log(user.email, user.password)
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name);
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });

  if(!newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res => {
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    console.log('sign in user info', res.user);
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });
  }
    e.preventDefault();
    }
    
  }
  const updateUserName = name => {
          const user = firebase.auth().currentUser;
          user.updateProfile({
            displayName: name
          }).then(function() {
            console.log("User name updated successfully")
          }).catch(function(error) {
            console.log(error);
          });
  }
  return (
    <div className="App">
      {
        user.isSignIn ? <button onClick ={handleSignOut}>Sign out</button> : <button onClick ={handleSignIn}>Sign in</button>
      }
      <br/>
      <button onClick ={handleFbSignIn}>Facebook login</button>
      {
        user.isSignIn && <div>
              <p>Welcome, {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Image: <img src={user.picture} alt=""/></p>
        </div>
      }

      <h1> Authentication</h1>
      {/* <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p> */}

      <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign Up</label>
      
        <form onSubmit={handleSubmit}>
            {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Type name" required/>}
            <br/>
            <input type="email" onBlur={handleBlur} name="email"  placeholder="Type your email address" required/>
            <br/>
            <input type="password" onBlur={handleBlur} name="password" placeholder="Type your password" required/>
            <br/>
            <input type="submit" value={ newUser ? 'Sign Up' : 'Sign In' }/>
        </form>
          <p style= {{color: 'red'}}>{user.error}</p>
          {
            user.success && <p style= {{color:'green'}}>User {newUser ? 'created' : 'Logged in'} successfully</p>
          }
    </div>
  );
}

export default App;

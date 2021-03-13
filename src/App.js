import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    picture: '',
  });
  const provider = new firebase.auth.GoogleAuthProvider();
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
    });
  }
  return (
    <div className="App">
      <h1>Love</h1>
      {
        user.isSignIn ? <button onClick ={handleSignOut}>Sign out</button> : <button onClick ={handleSignIn}>Sign in</button>
      }
      {
        user.isSignIn && <div>
              <p>Welcome, {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Image: <img src={user.picture} alt=""/></p>
        </div>
      }
    </div>
  );
}

export default App;

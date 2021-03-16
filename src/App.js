
import './App.css';
import firebase from 'firebase/app'
import 'firebase/auth';
import firebaseConfig from './firebase.config';
import "firebase/firestore";
import { useState } from 'react';


//default vabe eta kore but jodi eta kaj na kore tahole nicher ta use korbo
// firebase.initializeApp(firebaseConfig);

//etao use korte pari jodio uporer ta kaj na kore
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const [user,setUser]=useState({
    isSignedIn:false,
    name:'',
    photo:'',
    email:''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn =()=>{
    firebase.auth().signInWithPopup(provider)
    
    .then(res=>{
      const {displayName,photoURL,email}=res.user;
      const sigendIn={
        isSignedIn:true,
        name:displayName,
        photo:photoURL,
        email:email
      }
      setUser(sigendIn);
      console.log(res)
    })
    .catch(err=>{
      console.log(err);
    })
    //  console .log('signed in')
  }
  const handleSignOut=()=>{
    firebase.auth().signOut()
    .then(res=>{
      const signOut={
        isSignedIn:false,
        name:'',
        photo:'',
        email:''
      }
      setUser(signOut);
    })
    .catch(err=>{
      console.log(err);
    })
  }
  return (
    <div className="App">
      <header className="App-header">
        { user.isSignedIn?<button className="btn-design" onClick={handleSignOut}>Sign Out</button>:
          <button onClick={handleSignIn} className="btn-design"> sign in</button>}
        {
          user.isSignedIn && <div>
            <p>Welcome, {user.name} </p>
            <p>Your email : {user.email}</p>
            <img src={user.photo} alt=""/>
          </div>
        }
      </header>
    </div>
  );
}

export default App;


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
  const [newUser,setNewUser]=useState(false);
  const [user,setUser]=useState({
    isSignedIn:false,
    name:'',
    photo:'',
    password:'',
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
        email:'',
        success:'true',
        error:''
      }
      setUser(signOut);
    })
    .catch(err=>{
      console.log(err);
    })
  }
 
  const handleChange=(event)=>{
    let  isFormValid=true;
    if(event.target.name==='email'){
      
      //email validator part
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
      // console.log(isEmailValid);

    }
    if(event.target.name==='password'){
      // password validator part
        const isPasswordValid = event.target.value.length>6;
        const finalPassCheck =/\d{1}/.test(event.target.value);
        isFormValid = finalPassCheck && isPasswordValid;
    }
    if(isFormValid){
      console.log('form is valid');
      const newUserInfo ={...user};
      newUserInfo[event.target.name]=event.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit=(e)=>{
    if(newUser && user.email && user.password){
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then((userCredential) => {
    // Signed in 
    console.log('user created ')
    const newUserInfo ={...user};
    newUserInfo.success = true;
    newUserInfo.error='';
    setUser(newUserInfo);
    updateUserInfo(user.name);
    // const user = userCredential.user;
    console.log('maheee',user.name);
    // ...
  })
  .catch((error) => {
    const newUserInfo ={...user}
    // const errorCode = error.code;
     newUserInfo.error = error.message;
     newUserInfo.success=false;
     setUser(newUserInfo)
    // console.log(errorCode);
    // ..
  });
}
if(!newUser && user.email && user.password){
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    // Signed in
    const newUserInfo ={...user};
    newUserInfo.success = true;
    newUserInfo.error='';
    setUser(newUserInfo);
    console.log(res.user)
    // var user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const newUserInfo ={...user}
     newUserInfo.error = error.message;
     newUserInfo.success=false;
     setUser(newUserInfo)
    // var errorCode = error.code;
    // var errorMessage = error.message;
  });
}
  e.preventDefault();
  }
const updateUserInfo=name =>{
  const user = firebase.auth().currentUser;
console.log('name in update function',name);
  user.updateProfile({
  displayName: name
  }).then(function() {
  console.log('user name successfully updated!')
  // Update successful.
  }).catch(function(error) {
  // An error happened.
});
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


        <h1>My own made authentication system</h1>
        <form onSubmit={handleSubmit} style={{display: 'flex',flexDirection:'column'}}>
          <input type="checkbox" name="check" onChange={()=>{setNewUser(!newUser)}} />
          <label htmlFor="check">New User Sign Up</label>
         { newUser && <input type="text" name="name" onBlur={handleChange} placeholder="Enter Your Name" required/>}
          <input type="email" name="email" onBlur={handleChange} placeholder="Enter Your Email" required/>
          <input type="password" name="password" onBlur={handleChange} placeholder="Enter Your password"  required/>
          <input type="submit" value={newUser?'Sign Up' :'Sign In'}/>
        </form>
        
        {
          user.success ?<p style={{color: 'green'}}>User {newUser?'Created!':'logged In Succesfully!'} Successfully</p>
          :<p style={{color: 'red'}}>{user.error}</p>
        }
      </header>
    </div>
  );
}

export default App;

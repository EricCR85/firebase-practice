import React from "react";
import "./App.css";
import { auth, db } from "./firebase/init";
import { addDoc, collection, getDocs, getDoc, doc, query, where } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

function App() {
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  function createPost() {
    const post = {
      title: "Finish Firebase Sectiion",
      description: "Do Frontend Simplified",
      uid: user.uid,
    };
    addDoc(collection(db, "posts"), post);
  }

  async function getAllPosts() {
    const { docs } = await getDocs(collection(db, "posts"));
    const posts = docs.map((elem) => ({ ...elem.data(), id: elem.id }));
    console.log(posts);
  }

 async function getPostById() {
  const hardcodedId = "3U3wC4V5KKfykUtHevNG";
  const postRef = doc(db, "posts", hardcodedId);
  const postSnap = await getDoc(postRef);
  
  if (postSnap.exists()) {
    const post = postSnap.data();
    console.log(post);
  } else {
    console.log("No such document!");
  }
}

async function getPostByUid() {
  const postCollectionRef = await query (
    collection(db, "posts"),
    where("uid", "==", "1")
  )
   const { docs } = await getDocs(postCollectionRef);
   console.log(docs.map(doc => doc.data()));
}

  React.useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setLoading(false);
    if (user) {
      console.log("User logged in:", user);
      setUser(user);
    } else {
      console.log("No user logged in");
      setUser({});
    }
  });
  
  // Cleanup subscription on unmount
  return () => unsubscribe();
}, []);

  function register() {
    console.log("register");
    createUserWithEmailAndPassword(auth, "email@email.com", "test123")
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function login() {
  signInWithEmailAndPassword(auth, "email@email.com", "test123")
    .then(({ user }) => {
      console.log("Logged in:", user);
      setUser(user);
    })
    .catch((error) => {
      console.error("Login error:", error);
    });
}

  function logout() {
    signOut(auth);
    setUser({});
  }

  return (
    <div className="App">
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
      {loading ? "loading..." : user.email}
      <button onClick={createPost}>Create Post</button>
      <button onClick={getAllPosts}>Get All Post</button>
      <button onClick={getPostById}>Get post by Id</button>
      <button onClick={getPostByUid}>Get post by Uid</button>
    </div>
  );
}

export default App;

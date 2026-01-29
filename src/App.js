import React from "react";
import "./App.css";
import { auth, db } from "./firebase/init";
import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

function App() {
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(true);

async function updatePost() {
  const hardcodedId = "3U3wC4V5KKfykUtHevNG";

  if (!hardcodedId) {
    console.log("No post ID provided");
    return;
  }

  const postRef = doc(db, "posts", hardcodedId);
  const post = await getPostById(hardcodedId);

  if (!post) {
    console.log("Post does not exist — cannot update");
    return;
  }

  const updatedPost = {
    ...post,
    title: "Land a 400k job",
  };

  updateDoc(postRef, updatedPost)
    .then(() => {
      console.log("Post updated successfully");
    })
    .catch((error) => {
      console.error("Error updating post:", error);
    });
}

  function deletePost() {
       const hardcodedId = "3U3wC4V5KKfykUtHevNG";
    const postRef = doc(db, "posts", hardcodedId);
    deleteDoc(postRef);
  }

function createPost() {
  if (!user || !user.uid) {
    console.log("No user logged in — cannot create post");
    return;
  }

  const post = {
    title: "Finish Firebase Section",
    description: "Do Frontend Simplified",
    uid: user.uid,
  };

  addDoc(collection(db, "posts"), post)
    .then((docRef) => {
      console.log("Post created with ID:", docRef.id);
    })
    .catch((error) => {
      console.error("Error creating post:", error);
    });
}

  async function getAllPosts() {
    const { docs } = await getDocs(collection(db, "posts"));
    const posts = docs.map((elem) => ({ ...elem.data(), id: elem.id }));
    console.log(posts);
  }

  async function getPostById(id) {
  if (!id) {
    console.log("No post ID provided");
    return null;
  }

  const postRef = doc(db, "posts", id);
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    const post = postSnap.data();
    console.log("Post found:", post);
    return post;
  } else {
    console.log("No such document!");
    return null;
  }
}

async function getPostByUid() {
  if (!user || !user.uid) {
    console.log("No user logged in");
    return;
  }

  const postCollectionRef = query(
    collection(db, "posts"),
    where("uid", "==", user.uid)
  );

  const { docs } = await getDocs(postCollectionRef);
  const posts = docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  console.log("Posts for user:", posts);
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
      <button onClick={() => getPostById("PASTE_REAL_POST_ID_HERE")}>
         Get post by Id
      </button>
      {/* <button onClick={getPostById}>Get post by Id</button> */}
      <button onClick={getPostByUid}>Get post by Uid</button>
      <button onClick={updatePost}>Update Post</button>
      <button onClick={deletePost}>Delete Post</button>
    </div>
  );
}

export default App;

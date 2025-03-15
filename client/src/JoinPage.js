import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth, serverTimestamp } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

const JoinPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ff0000"); // default color
  const [loading, setLoading] = useState(true);

  //ensure the user is signed in anonymously when the component mounts.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        //sign in anonymously if no user exists.
        signInAnonymously(auth)
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.error("Anonymous sign-in failed:", error, ". Report this error to @Bagelsause.");
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //name validation (must be 1-30 characters)
    if (!name || name.length > 30) {
      alert("Please enter a name with 1-30 characters.");
      return;
    }

    //ensure that authentication is complete.
    if (!auth.currentUser) {
      alert("Authentication not ready. Please wait. If this issue persists, message @Bagelsause.");
      return;
    }

    //generate a unique ID for the player document (to prevent player spoofing)
    const playerId = uuidv4();

    try {
      await setDoc(doc(db, "players", playerId), {
        name,
        color,
        pressed: false,          //initial flag for button press, set to false cuz duh
        createdAt: serverTimestamp(),
        owner: auth.currentUser.uid,  //tie the document to the authenticated user
      });

      //redirect the player to their button page
      navigate(`/button/${playerId}`);
    } catch (error) {
      console.error("Error adding player: ", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Join the Game</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              placeholder="Enter your name"
              required
            />
          </label>
        </div>
        <div>
          <label>
            Choose a color:
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default JoinPage;

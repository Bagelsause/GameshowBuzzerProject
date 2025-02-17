import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const ButtonPage = () => {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch the player's document on component mount.
  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const playerDocRef = doc(db, "players", playerId);
        const playerDocSnap = await getDoc(playerDocRef);
        if (playerDocSnap.exists()) {
          setPlayer(playerDocSnap.data());
        } else {
          console.error("Player not found");
        }
      } catch (error) {
        console.error("Error fetching player:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId]);

  // Handle the button press by updating the document and resetting after 2 seconds.
  const handleButtonPress = async () => {
    if (buttonPressed) return; // Prevent multiple presses.

    setButtonPressed(true);
    try {
      const playerDocRef = doc(db, "players", playerId);
      // Update the document: mark the button as pressed and set pressedAt if not already set.
      await updateDoc(playerDocRef, {
        pressed: true,
        // Set pressedAt only if it isn’t already set.
        pressedAt: player?.pressedAt ? player.pressedAt : serverTimestamp(),
      });
      
      // After 2 seconds, reset the pressed flag (keeping pressedAt intact)
      setTimeout(async () => {
        try {
          await updateDoc(playerDocRef, {
            pressed: false,
          });
          setButtonPressed(false);
        } catch (resetError) {
          console.error("Error resetting button state:", resetError);
          setButtonPressed(false);
        }
      }, 2000);
    } catch (error) {
      console.error("Error updating player document:", error);
      setButtonPressed(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!player) {
    return <div>Player not found.</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {player.name}!</h1>
      <button
        onClick={handleButtonPress}
        disabled={buttonPressed}
        style={{
          backgroundColor: player.color,
          color: "#fff",
          padding: "1rem 2rem",
          fontSize: "1.5rem",
          border: "none",
          borderRadius: "8px",
          cursor: buttonPressed ? "not-allowed" : "pointer",
        }}
      >
        {buttonPressed ? "Button Pressed!" : "Press Button"}
      </button>
    </div>
  );
};

export default ButtonPage;
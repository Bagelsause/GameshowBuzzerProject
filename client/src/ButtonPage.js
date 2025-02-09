import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
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

  // Handle the button press by updating the document.
  const handleButtonPress = async () => {
    if (buttonPressed) return; // Prevent multiple presses.

    setButtonPressed(true);
    try {
      const playerDocRef = doc(db, "players", playerId);
      await updateDoc(playerDocRef, {
        pressed: true,
        pressedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating player document:", error);
      // In case of error, allow the user to try pressing again.
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

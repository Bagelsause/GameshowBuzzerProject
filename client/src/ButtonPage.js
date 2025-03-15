import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

//same util as browsersource, just so both sides are viewable
const getReadableColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#FFFFFF";
};

const ButtonPage = () => {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [audioBuffer, setAudioBuffer] = useState(null);

  //create some form of audio context on component mount
  const audioContext = useMemo(() => new (
    window.AudioContext|| window.webkitAudioContext
  )(), []);

  //fetch the player's document on component mount.
  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const playerDocRef = doc(db, "players", playerId);
        const playerDocSnap = await getDoc(playerDocRef);
        if (playerDocSnap.exists()) {
          //use old info
          setPlayer({ id: playerDocSnap.id, ...playerDocSnap.data()});

          //preload the audio buffer
          const audioData = await fetch("/buzzer.mp3")
            .then((res) => res.arrayBuffer())
            .then((data) => audioContext.decodeAudioData(data));
          setAudioBuffer(audioData);
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
  }, [playerId, audioContext]);

  const playBuzzer = async () => {
    if (audioBuffer) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      const gainNode = audioContext.createGain();
      gainNode.gain.value = Math.min(Math.max(volume, 0), 1); //apply user-set volume

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      source.start(0);
    }
  };

  //handle the button press by updating the document and resetting after 2 seconds.
  const handleButtonPress = async () => {
    if (buttonPressed) return; //prevent multiple presses (debouncing from user-side)

    setButtonPressed(true);
    playBuzzer();
    try {
      const playerDocRef = doc(db, "players", playerId);
      //update the document: mark the button as pressed and set pressedAt if not already set.
      await updateDoc(playerDocRef, {
        pressed: true,
        //set pressedAt only if it isn’t already set.
        pressedAt: player?.pressedAt ? player.pressedAt : serverTimestamp(),
      });
      
      //after 2 seconds, reset the pressed flag (keeping pressedAt intact)
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
          color: getReadableColor(player.color),
          padding: "1rem 2rem",
          fontSize: "1.5rem",
          border: "none",
          borderRadius: "8px",
          cursor: buttonPressed ? "not-allowed" : "pointer",
        }}
      >
        {buttonPressed ? "Button Pressed!" : "Press Button"}
      </button>
      <br/>
      <label>
        Volume:
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          defaultValue="0.5"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
      </label>
    </div>
  );
};

export default ButtonPage;
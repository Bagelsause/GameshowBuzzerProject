import React, { useState, useEffect, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

//utility to get an inverse color of the player's background (to set as readable text)
const getReadableColor = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#FFFFFF";
};

const BrowserSourcePage = () => {
  //record the time when this browser source session loads (for invalidating old game documents)
  const [loadTime] = useState(new Date());
  const [players, setPlayers] = useState([]);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const prevPlayersRef = useRef([]);

  //fully preload the audio file on component mount
  useEffect(() => {
    const preloadAudio = async () => {
      const audioData = await fetch("/GiggleGames/buzzer.mp3")
        .then((res) => res.arrayBuffer())
        .then((data) => new (window.AudioContext || window.webkitAudioContext)().decodeAudioData(data));
      setAudioBuffer(audioData);
    };

    preloadAudio();
  }, []);

  useEffect(() => {
    //subscribe to all player documents
    const unsubscribe = onSnapshot(collection(db, "players"), (snapshot) => {
      const playersData = [];
      snapshot.forEach((doc) => {
        playersData.push({ id: doc.id, ...doc.data() });
      });
      setPlayers(playersData);
    });
    return () => unsubscribe();
  }, []);

  //filter for players who joined after the browser source loaded
  const filteredPlayers = players.filter((player) => {
    if (!player.createdAt) return false; //ignore if no createdAt timestamp
    //convert the Firestore Timestamp to a JavaScript Date
    const createdAtDate = player.createdAt.toDate();
    return createdAtDate > loadTime;
  });
  //sorting players by createdAt date, just so no players randomly shuffle around
  const sortedPlayers = filteredPlayers.sort(
    (a, b) => a.createdAt.toDate() - b.createdAt.toDate()
  );

  //whenever a player presses their button, play the buzzer sound
  useEffect(() => {
    const playBuzzer = () => {
      if (audioBuffer) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1; //set volume to max (can be adjusted in OBS manually)

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start(0);
      }
    };

    sortedPlayers.forEach((player) => {
      const prevPlayer = prevPlayersRef.current.find(p => p.id === player.id);
      if (player.pressed && (!prevPlayer || !prevPlayer.pressed)) {
        playBuzzer();
      }
    });

    //update the previous players reference
    prevPlayersRef.current = sortedPlayers;
  }, [sortedPlayers, audioBuffer]);

  return (
    <div
      style={{
        background: "transparent",
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        pointerEvents: "none", //overlay is non-interactive in OBS (as expected)
      }}
    >
      {/* Main Area: Visualize all players' buttons */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          padding: "20px",
        }}
      >
        {sortedPlayers.map((player) => (
          <div
            key={player.id}
            style={{
              width: "calc(25% - 20px)",
              height: "150px",
              backgroundColor: player.color,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "8px",
              boxShadow: player.pressed
                ? "inset 0px 0px 10px rgba(0,0,0,0.5)"
                : "0px 4px 6px rgba(0,0,0,0.3)",
              transform: player.pressed ? "scale(0.95)" : "scale(1)",
              transition: "all 0.2s ease",
            }}
          >
            <span
              style={{
                color: getReadableColor(player.color),
                fontSize: "calc(1rem + 1vw)",
              }}
            >
              {player.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowserSourcePage;
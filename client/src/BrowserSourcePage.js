import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";


//defining how long until the "next round starts" (will automatically set the next user as "first" once it resets) [in milliseconds]
const PRESS_EVENT_EXPIRY = 60000; //60 seconds

//utility to convert an index to an ordinal string.
const getOrdinal = (n) => {
  if (n === 0) return "first";
  if (n === 1) return "second";
  if (n === 2) return "third";
  return `${n + 1}th`;
};

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

  const now = new Date();

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

  //for the precedence list, we still base things on the pressedAt timestamp
  const pressEvents = filteredPlayers
    .filter((player) => {
      if (!player.pressedAt) return false;
      const pressedTime = player.pressedAt.toDate();
      return now - pressedTime < PRESS_EVENT_EXPIRY;
    })
    .sort((a, b) => a.pressedAt.toDate() - b.pressedAt.toDate());

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
      {/* Precedence List: Display press order in a fixed box at top-left */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "10px",
          borderRadius: "8px",
          width: "250px",
        }}
      >
        {pressEvents.length > 0 ? (
          pressEvents.map((player, index) => (
            <div
              key={player.id}
              style={{
                border: "1px solid #fff",
                padding: "5px",
                marginBottom: "5px",
                textAlign: "center",
                fontSize: "1rem",
                color: "#fff",
                height: "40px", //uniform height for each entry.
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {player.name} pressed {getOrdinal(index)}
            </div>
          ))
        ) : (
          <div style={{ color: "#fff", textAlign: "center" }}>
            No recent presses.
          </div>
        )}
      </div>

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
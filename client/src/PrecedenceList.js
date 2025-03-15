import React, { useState, useEffect } from "react";
import { collection, onSnapshot, updateDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const PrecedenceList = () => {
    const [pressEvents, setPressEvents] = useState([]);

    useEffect(() => {
        //sub to changes
        const unsubscribe = onSnapshot(collection(db, "players"), (snapshot) => {
            const playersData = [];
            snapshot.forEach((doc) => {
                playersData.push({ id: doc.id, ...doc.data() });
            });
    
            //sort players by press time
            const sortedPresses = playersData
                .filter((player) => player.pressedAt) //ensuring they have a press timestamp
                .sort((a, b) => a.pressedAt.toDate() - b.pressedAt.toDate());
    
            setPressEvents(sortedPresses);
        });
    
        return () => unsubscribe();
    }, []);

    const startNewRound = async () => {
        const playersRef = collection(db, "players");
        const snapshot = await getDocs(playersRef);

        //reset pressed states for all players
        snapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, { pressedAt: null, pressed: false });
        });

        //after everything's updated, clear the list
        setPressEvents([]);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
            <h2>Press order</h2>
            {pressEvents.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {pressEvents.map((player, index) => (
                        <li
                        key={player.id}
                        style={{
                            padding: "10px",
                            marginBottom: "5px",
                            background: "#ddd",
                            borderRadius: "5px",
                            textAlign: "center",
                        }}
                        >
                            {index+1}) {player.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recent presses.</p>
            )}
    
            <button
                onClick={startNewRound}
                style={{
                    marginTop: "20px",
                    padding: "10px",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
            >
                Start New Round
            </button>
        </div>
    );
};

export default PrecedenceList;
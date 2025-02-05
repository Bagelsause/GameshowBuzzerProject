import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        socket.on("update", (data) => {
            setPlayers(data.players);
        });

        return () => socket.off("update");
    }, []);

    return (
        <div>
            <h1>OBS Game System</h1>
            <ul>
                {players.map((player, index) => (
                    <li key={index} style={{ color: player.color }}>
                        {player.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

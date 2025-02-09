import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, serverTimestamp } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const JoinPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#ff0000'); // default color

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the name input
    if (!name || name.length > 30) {
      alert("Please enter a name with 1-30 characters.");
      return;
    }

    // Generate a unique ID for the player
    const playerId = uuidv4();

    // Create a player document in a "players" collection
    try {
      // Alternatively, you can use collection(db, 'players') with setDoc
      await setDoc(doc(db, 'players', playerId), {
        name,
        color,
        pressed: false, // Flag for button press (you can modify as needed)
        createdAt: serverTimestamp(),
      });

      // Redirect to the player button page (assume route like /button/:playerId)
      navigate(`/button/${playerId}`);
    } catch (error) {
      console.error("Error adding player: ", error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
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

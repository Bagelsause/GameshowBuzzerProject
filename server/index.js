const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" }
});

let players = [];

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join", (data) => {
        players.push({ id: socket.id, name: data.name, color: data.color });
        io.emit("update", { players });
    });

    socket.on("buzz", () => {
        io.emit("update", { players });
    });

    socket.on("disconnect", () => {
        players = players.filter(p => p.id !== socket.id);
        io.emit("update", { players });
    });
});

server.listen(4000, () => console.log("Server running on port 4000"));

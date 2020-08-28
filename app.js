// INCLUDES
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

const mySocket = require("./socket");

// MODELS
const Message = require("./models/message");

// ROUTES INCLUDES
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messaging");
const friendRequestRoutes = require("./routes/friendRequests");
const friendsRoutes = require("./routes/friends");
const friendsSearchRoutes = require("./routes/friendSearch");

// INITIALIZING THE APP
const app = express();
const server = http.createServer(app);
const io = mySocket.init(server);

// USING PARSERS FOR DATA
app.use(bodyParser.json());

app.use(cors());

// USING ROUTES
app.use("/auth", authRoutes);
app.use("/message", messagesRoutes);
app.use("/friendRequest", friendRequestRoutes);
app.use("/friends", friendsRoutes);
app.use("/search", friendsSearchRoutes);

io.on("connection", (socket) => {
  socket.on("disconnect", () => {});
});

// CREATING THE SERVER
const PORT = process.env.PORT || 8080;
mongoose
  .connect(process.env.DATABASE_CONNECT_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT);
    console.log(`Listening on port ${PORT}`);
  })
  .catch((err) => {
    console.log(err);
  });

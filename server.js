var express = require("express");
var path = require("path");
var app = express();

app.use(express.static(path.join(__dirname, "./static")));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
	res.render("index");
});

var server = app.listen(8000, function() {
	console.log("The server is listening on port 8000");
});

var io = require("socket.io").listen(server);

io.sockets.on("connection", function(socket) {
	var name = {};
	var userID = [];
	console.log("Socket connected. ID is: " + socket.id);
	
	socket.emit("new_user_connected");
	
	socket.on("got_new_user", function(data) {
		name[data.nameInput] = socket.id;
		userID.push(name[data.nameInput]);
		console.log(name[data.nameInput]);
		socket.broadcast.emit("new_user", { userName: data.nameInput });
	});
	
	socket.on("new_message", function(data) {
		io.emit("update_messages", { message: data.message, name: data.name });
	});
});
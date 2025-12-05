import { Application, send } from "@oak/oak";
import { Server } from "socket.io";

const app = new Application();

const ROOT_DIR = "public";
app.use(async (ctx) => {
  await ctx.send({
    root: ROOT_DIR,
    index: "index.html",
  });
});

const io = new Server();

class Player{
  constructor(name, x, y, room, id){
    this.name = name;
    this.x = x;
    this.y = y;
    this.room = room;
    this.id = id;
  }
}

const rooms = new Map();
rooms.set("town", { players: [] });
//rooms.get("town")["players"].push(new Player("John", 100, 100, "town"));
const id_to_room = new Map();

function add_player(name,x,y,room,id){
  rooms.get(room).players.push(new Player(name, x, y, room, id));
  id_to_room.set(id, room);
  return rooms.get(room).players.at(-1);
}
function remove_player(id){
  if(id_to_room.has(id)){
    let room = rooms.get(id_to_room.get(id));
    room.players.splice(room.find(p => p.id == id),1);
    id_to_room.delete(id);
  }
}

io.on("connection", (socket) => {
  console.log("SOCKET CONNECTED");

  socket.on("move", (pos) => {
    console.log(pos);
  });

  /*
  socket.on("init", () => {
    socket.emit("init", {room: "town", id: socket});
  })
  */

  socket.on("join_room", (data) => {
    console.log("THEY WANT PLAYERS");
    //players.push(new Player("Player", data.x, data.y, data.room));
    //io.to(data.room).emit("players", {players});
    //socket.join(data.room);
    remove_player(socket.id);
    socket.emit("players", rooms.get(data.room));
    let player = add_player(data.name, data.x, data.y, data.room, socket.id);

    rooms.get(data.room).players.forEach(function(p){
      if(p.id != socket.id){
        io.to(p.id).emit("player_joined_room", player);
      }
    });

  });

  socket.on("disconnect", (reason) => {
    console.log("Player disconnected");
  });
});

const handler = io.handler(async (req) => {
  return (await app.handle(req)) || new Response(null, { status: 404 });
});

Deno.serve({
  handler: handler,
  port: 8000,
});

console.log("Running on http://localhost:8000");

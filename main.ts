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
  constructor(name, x, y, room){
    this.name = name;
    this.x = x;
    this.y = y;
    this.room = room;
  }
}

const players: Player[] = [
  new Player("tom", 100, 100, "town"),
  new Player("corgo", 200, 200, "town")
];

io.on("connection", (socket) => {
  console.log("SOCKET CONNECTED");

  socket.on("move", (pos) => {
    console.log(pos);
  });

  socket.on("join_room", (data) => {
    console.log("THEY WANT PLAYERS");
    players.push(new Player("Player", data.x, data.y, data.room));
    //io.to(data.room).emit("players", {players});
    socket.join(data.room);
    socket.emit("players",{players})
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

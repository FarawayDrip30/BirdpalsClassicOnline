import { Application, send } from "@oak/oak";
import { Server } from "socket.io";

const app = new Application();

const ROOT_DIR = "public"
app.use(async (ctx) => {
  await ctx.send({
      root: ROOT_DIR,
      index: "index.html"
    });
});


const io = new Server();

io.on("connection", (socket) =>{
  console.log("SOCKET CONNECTED");

  socket.emit("hello", "world");

  socket.on("disconnect", (reason) => {
    console.log("Player disconnected");
  })
})


const handler = io.handler(async (req) => {
  return await app.handle(req) || new Response(null, { status: 404});
});

Deno.serve({
  handler: handler,
  port: 8000
})

console.log("Running on http://localhost:8000");
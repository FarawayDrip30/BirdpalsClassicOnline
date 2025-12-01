class GameObject {
  constructor(
    img,
    x,
    y,
    width,
    height,
    rotation,
    originX,
    originY,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    type,
    name,
    message
  ) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.originX = originX;
    this.originY = originY;

    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.sourceW = sourceW;
    this.sourceH = sourceH;

    this.name = name;
    this.type = type;
    this.message = message;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.translate(-this.x, -this.y);
    ctx.drawImage(
      this.img,
      this.sourceX,
      this.sourceY,
      this.sourceW,
      this.sourceH,
      this.x - this.originX,
      this.y - this.originY,
      this.width,
      this.height
    );
    ctx.restore();

    if (this.type === 1 || this.type === 2) {
      ctx.font = "15px sans-serif";

      if (this.type === 2) {
        ctx.fillStyle = "red";
        ctx.fillText(
          "(NPC)",
          this.x - ctx.measureText(this.name).width / 2 - 5,
          this.y + this.height / 2.5
        );
        ctx.fillStyle = "black";
        ctx.fillText(
          this.name,
          this.x -
            ctx.measureText(this.name).width / 2 +
            ctx.measureText("(NPC)").width -
            3,
          this.y + this.height / 2.5
        );
      } else {
        ctx.fillStyle = "black";
        ctx.fillText(
          this.name,
          this.x - ctx.measureText(this.name).width / 2,
          this.y + this.height / 2.5
        );
      }

      if (this.message != " " && this.message.length > 0 || this.message != "" && this.message.length > 0) {
        var bubble_image = new HUD(
           bubble,
           this.x - 66,
           this.y - this.height - 35,
           131,
           47,
           0,
           0,
           0,
           0,
           0,
           262,
           94,
           0
        );
        bubble_image.draw();

        ctx.fillText(
          this.message,
          this.x - ctx.measureText(this.message).width / 2,
          this.y - this.height - 13,
        );
      }
    }
  }

  chatMessage(msg) {
    this.message = msg;
    ctx.fillStyle = "red";
  }
}

class HUD extends GameObject {
  constructor(
    img,
    x,
    y,
    width,
    height,
    rotation,
    originX,
    originY,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    type
  ) {
    super(
      img,
      x,
      y,
      width,
      height,
      rotation,
      originX,
      originY,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      type
    );
  }
}

var bubble = new Image();
bubble.src = "GameData/Sprites/hud/hud.png";

class Room extends GameObject {
  constructor(
    img,
    x,
    y,
    width,
    height,
    rotation,
    originX,
    originY,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    type
  ) {
    super(
      img,
      x,
      y,
      width,
      height,
      rotation,
      originX,
      originY,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      type
    );
  }
}

class RoomObject extends GameObject {
  constructor(
    img,
    x,
    y,
    width,
    height,
    rotation,
    originX,
    originY,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    type
  ) {
    super(
      img,
      x,
      y,
      width,
      height,
      rotation,
      originX,
      originY,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      type
    );
  }
}

class Character extends GameObject {
  constructor(
    img,
    x,
    y,
    width,
    height,
    rotation,
    originX,
    originY,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    type,
    name,
    message
  ) {
    super(
      img,
      x,
      y,
      width,
      height,
      rotation,
      originX,
      originY,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      type,
      name,
      message
    );

    this.velX = 0;
    this.velY = 0;

    this.destX = x;
    this.destY = y;

    this.sourceX = sourceX;
    this.sourceY = sourceY;

    this.clickPosX = this.x + this.width / 2;
    this.clickPosY = this.y + this.height - 5;

    this.isMoving = false;
    this.smishMoving = false;
    
    this.angle=0;
  }

  main() {
    if(this.isMoving){
      this.velX = Math.cos(this.angle) * this.speed * timeScale;
      this.velY = Math.sin(this.angle) * this.speed * timeScale;
    }
    else{
      this.velY = 0;
      this.velX = 0;
    }

    if (
      (this.x >= this.destX - this.velX - 1 &&
        this.x <= this.destX + this.velX + 10 &&
        this.y >= this.destY - this.velY - 1 &&
        this.y <= this.destY + this.velY + 10) == false
    ) {
      this.isMoving = true;
      this.x += this.velX;
      this.y += this.velY;
    } else{
        this.stoppedMoving();
        this.isMoving = false;
    }
  }

  move(destX, destY) {
    if (destX < this.x) {
      this.sourceX = 0;
      this.sourceY = 172;
    } else if (destX > this.x) {
      this.sourceX = 144;
      this.sourceY = 172;
    }

    if (destY < this.y) {
      this.sourceX = 0;
      this.sourceY = 0;
    } else if (destY > this.y) {
      this.sourceX = 144;
      this.sourceY = 0;
    }

    if (destX < this.x - 15 && destY > this.y) {
      this.sourceX = 0;
      this.sourceY = 172;
    } else if (destX > this.x + 15 && destY > this.y) {
      this.sourceX = 144;
      this.sourceY = 172;
    }

    this.destX = destX;
    this.destY = destY;

    let dx = destX - this.x;
    let dy = destY - this.y;

    this.angle = Math.atan2(dy, dx);

    this.speed = 1.25;
    this.velX = Math.cos(this.angle) * this.speed * timeScale;
    this.velY = Math.sin(this.angle) * this.speed * timeScale;
  }

  stoppedMoving(){
    if(this.smishMoving){
        triggers();
        this.smishMoving = false;
    }
  }
}

class NPC extends GameObject {
  constructor(
    img,
    x,
    y,
    width,
    height,
    rotation,
    originX,
    originY,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    type,
    name,
    message
  ) {
    super(
      img,
      x,
      y,
      width,
      height,
      rotation,
      originX,
      originY,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      type,
      name,
      message
    );
  }
}

class Camera {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  followX() {
    let prevX = this.x;
    this.x = char.x + this.x - canvas.width / 2;

    for (let i = 0; i < objectsInScene.length; i++) {
      objectsInScene[i].x = objectsInScene[i].x + (prevX - this.x);
    }
    char.destX = char.destX + (prevX - this.x);
  }
  followY() {
    let prevY = this.y;
    this.y = char.y + this.y - canvas.height / 2;

    for (let i = 0; i < objectsInScene.length; i++) {
      objectsInScene[i].y = objectsInScene[i].y + (prevY - this.y);
    }
    char.destY = char.destY + (prevY - this.y);
  }
}

class Trigger{
    constructor(x, y, width, height){

    }
}

'use strict';
/////////////////////////////
//////////Create Canvas Object
/////////////////////////////


const Canvas = {
  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.allShapes = [];
    this.drawnShapes = [];
    //OCCUPIED EDGE PIXELS
    this.leftPix =[]
    this.rightPix =[]
    this.topPix =[]
    this.bottomPix =[]
  },
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  redraw() {
    this.clear()
    this.drawnShapes.forEach(function(shape){
    shape.draw()
    })
  },





};

/////////////////////////////
//////////create Rectangle Object
/////////////////////////////

const Rectangle = {
  init(id,ctx, x, y, width, height,depth, div,rotate, color) {
    this.id = id;
    this.type = "rectangle";
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.color = color;
    this.active = false;
    this.div = div;
    this.ctx = ctx;
    this.rotate = rotate;

  },

  draw() {
    //IF ROTATE IS TRUE, ROTATE
      if (this.rotate) {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.depth, this.width);
      } else {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.depth);
      }



    },
    testRect() { // FOR USE WIDTH isPointInPath
      //IF ROTATE IS TRUE, ROTATE
        if (this.rotate) {
          this.ctx.rect(this.x, this.y, this.depth, this.width);
        } else {
          this.ctx.rect(this.x, this.y, this.width, this.depth);
        }



      }



};



/////////////////////////////
//////////create Circle Object
/////////////////////////////
/*
let Circle = {
  init(cv, x, y, radius, sAngle, eAngle, clock, color) {
    this.type = "circle"
    this.ctx = cv.context;
    this.x = x + radius;
    this.y = y + radius;
    this.radius = radius;
    this.sAngle = sAngle;
    this.eAngle = eAngle;
    this.clock = clock;
    this.color = color;
    this.active = false;

  },

  draw() {

    this.ctx.beginPath()
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.x, this.y, this.radius, this.sAngle, this.eAngle, this.clock)
    this.ctx.closePath()
    this.ctx.fill();


  }
};

*/

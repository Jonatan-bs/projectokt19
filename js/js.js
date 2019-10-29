'use strict';

let canArr = []; //REMOVE

/////////////////////////////
////////// Do stuff on load
/////////////////////////////

function init() {


  // CREATE CANVAS OBJECTS
  let kitchenCan = Object.create(Canvas)
  kitchenCan.init('kitchen')
  canArr.push(kitchenCan)

  // MAKE SHAPE OBJECT FOR EACH DIV WITH CLASS SHAPE
  let divShapes = document.querySelectorAll('.shape')
  for (let shapeDiv of divShapes) {
    let width = shapeDiv.dataset.width;
    let height = shapeDiv.dataset.height;
    let depth = shapeDiv.dataset.depth;
    let id = shapeDiv.id;

    let shapeObj = Object.create(Rectangle)
    shapeObj.init(id, kitchenCan.context, 0, 0, width, height, depth, shapeDiv, false, "orange")

    //ADD TO SHAPE ARRAY IN CANVAS
    kitchenCan.allShapes.push(shapeObj)

    // MAKE OBJECT AND DIV ACTIVE ON CLICK
    shapeDiv.addEventListener('click', function() {
      makeActive(shapeDiv, shapeObj, kitchenCan)
    })
  }

  kitchenCan.canvas.addEventListener('click', addShape)



}
window.addEventListener('load', init)





////////////////
///// make Object and div active on click
///////////////////


function makeActive(shapeDiv, shapeObj, canvasObj, hoverFunc) {

  // TRUE IF ALREADY ACTIVE
  let isActive = shapeDiv.classList.contains('active');

  // if divs and shapeObjects has active... remove active
  removeActive(canvasObj)



  canvasObj.canvas.removeEventListener('mousemove', hovershape) // NOT WORKING



  // IF NOT ALREADY ACTIVE
  if (!isActive) {
    //MAKE DIV ACTIVE
    shapeDiv.classList.add('active')

    // MAKE SHAPEOBJ ACTIVE
    shapeObj.active = 'true'

    // MAKE SHAPE ON MOUSE HOVER ON CANVAS
    canvasObj.canvas.addEventListener('mousemove', hovershape)
  }





}

///////////////////
///// Remove active
///////////////////


function removeActive(canvasObj) {
  // IF ANY shapeDIV HAS CLASS ACTIVE, REMOVE CLASS
  document.querySelectorAll('.shape.active').forEach(function(div) {
    div.classList.remove("active")
  })
  // IF ANY shapeOBJ IS ACTIVE, REMOVE ACTIVE
  canvasObj.allShapes.forEach(function(shape) {
    shape.active = false;
  });
}


////////////////
///// SHOW SHAPE ON HOVER
///////////////////

function hovershape(ev) {
  canArr[0].allShapes.forEach(function(shape) {
    if (shape.active) {
      //CLEAR CANVAS
      canArr[0].redraw()

      // canvas size and pos
      let bb = ev.target.getBoundingClientRect();
      // mouse to canvas coordinates
      let x = (ev.clientX - bb.left) * (ev.target.width / bb.width);
      let y = (ev.clientY - bb.top) * (ev.target.height / bb.height);


      // FIND NEAREST WALL
      snapToWall(x, y, bb, shape, ev)



    }
  })



}


function addShape() {

  //PUSH ACTIVE SHAPE TO DRAWN SHAPES ARRAY
  canArr[0].allShapes.forEach(function(shape) {
    if (shape.active) {


      let addNewShape = Object.create(Rectangle)
      addNewShape.init(shape.id, shape.ctx, shape.x, shape.y, shape.width, shape.height, shape.depth, shape.div, shape.rotate, "green")

      /// ADD OCCUPIED WALL PIXELS TO CANVAS OBJ
      let occupiedPixels = []
      if (shape.wall === 'top') {
        canArr[0].topPix.push([shape.x, shape.x + Number(shape.width)])
      } else if (shape.wall === 'bottom') {
        canArr[0].bottomPix.push([shape.x, shape.x + Number(shape.width)])
      } else if (shape.wall === 'left') {
        canArr[0].leftPix.push([shape.y, shape.y + Number(shape.width)])
      } else if (shape.wall === 'right') {
        canArr[0].rightPix.push([shape.y, shape.y + Number(shape.width)])
      }

      canArr[0].drawnShapes.push(addNewShape)
    }
  })



  canArr[0].redraw()
  canArr[0].canvas.removeEventListener('mousemove', hovershape)
  removeActive(canArr[0])




}


////////////////
///// Snap to wall
///////////////////
function snapToWall(x, y, bb, shape, ev) {
  let cssDiffHeight = (ev.target.height / bb.height);
  let cssDiffWidth = (ev.target.height / bb.height);

  // GET OFFSET FROM SIDES OF CANVAS
  let yTopOffset = y
  let yBottomOffset = bb.height * cssDiffHeight - yTopOffset
  let xLeftOffset = x
  let xRightOffset = bb.width * cssDiffWidth - xLeftOffset



  if (yTopOffset < yBottomOffset && yTopOffset < xLeftOffset && yTopOffset < xRightOffset) {
    shape.wall = 'top'; // OCCUPIED SIDE
    let newY = 0;
    let newX;


    if (x > bb.width * cssDiffWidth - shape.width / 2) { // if outside canvas, move inside
      newX = bb.width * cssDiffWidth - shape.width
    } else if (x < shape.width / 2) {
      newX = 0
    } else {
      newX = x - shape.width / 2;
    }

    // DRAW SHAPE
    let i = false;
    canArr[0].topPix.forEach(function(dPix){

      if (dPix[0]<=newX && newX<=dPix[1] || dPix[0]<=newX+Number(shape.width) && newX+Number(shape.width)<=dPix[1] || newX<=dPix[0] && newX+Number(shape.width)>=dPix[0]  ) {
        return i = true
      } else {
        return i = false;
      }
    })
    if(!i){
      shape.x = newX;
      shape.y = newY;
      shape.rotate = false;

    }
    shape.draw();

  } else if (yBottomOffset < yTopOffset && yBottomOffset < xLeftOffset && yBottomOffset < xRightOffset) {
    shape.wall = 'bottom'; // OCCUPIED SIDE
    shape.y = bb.height * cssDiffHeight - shape.depth;

    if (x > bb.width * cssDiffWidth - shape.width / 2) { // if outside canvas, move inside
      shape.x = bb.width * cssDiffWidth - shape.width
    } else if (x < shape.width / 2) {
      shape.x = 0
    } else {
      shape.x = x - shape.width / 2;
    }

    // DRAW SHAPE
    shape.rotate = false;
    shape.draw();
  } else if (xLeftOffset < xRightOffset && xLeftOffset <= yBottomOffset && xLeftOffset <= yBottomOffset) {
    shape.wall = 'left'; // OCCUPIED SIDE
    shape.x = 0;
    if (y > bb.height * cssDiffHeight - shape.width / 2) { // if outside canvas, move inside
      shape.y = bb.height * cssDiffHeight - shape.width
    } else if (y < shape.width / 2) {
      shape.y = 0
    } else {
      shape.y = y - shape.width / 2;
    }
    // DRAW SHAPE
    shape.rotate = true;
    shape.draw();
  } else if (xRightOffset < xLeftOffset && xRightOffset <= yBottomOffset && xRightOffset <= yBottomOffset) {
    shape.wall = 'right'; // OCCUPIED SIDE
    shape.x = bb.width * cssDiffWidth - shape.depth;
    if (y > bb.height * cssDiffHeight - shape.width / 2) { // if outside canvas, move inside
      shape.y = bb.height * cssDiffHeight - shape.width
    } else if (y < shape.width / 2) {
      shape.y = 0
    } else {
      shape.y = y - shape.width / 2;
    }
    // DRAW SHAPE
    shape.rotate = true;
    shape.draw();
  }

  return [shape.x, shape.y]
}


//CHECK IF SPACE IS OCCUPIED
function isOccupied(wall,width,pix){
if(wall==='top'){
  let i = false;
canArr[0].topPix.forEach(function(dPix){
  if (dPix[0]<=pix && pix<=dPix[1] || dPix[0]<=pix+Number(width) && pix+Number(width)<=dPix[1] ) {
    return true;
  }

})
}
}
////////////////
///// Check if shape is clicked
///////////////////
/*
let hittest = function(ev,canvasObj) {

  let activeIndex = -1;

  let shapesArr = canvasObj.shapes;

  for (let i = 0; i < shapesArr.length; i++) {
    let cx = shapesArr[i].ctx;
    if (shapesArr[i].type === "rectangle") {
      cx.beginPath();
      cx.rect(shapesArr[i].x, shapesArr[i].y, shapesArr[i].width, shapesArr[i].height);
      cx.closePath()
    } else if (shapesArr[i].type === "circle") {
      cx.beginPath();
      cx.arc(shapesArr[i].x, shapesArr[i].y, shapesArr[i].radius, shapesArr[i].sAngle, shapesArr[i].eAngle, shapesArr[i].clock);
      cx.closePath()
    }

    let bb = ev.target.getBoundingClientRect(); // canvas size and pos
    // mouse to canvas coordinates
    let x = (ev.clientX - bb.left) * (ev.target.width / bb.width);
    let y = (ev.clientY - bb.top) * (ev.target.height / bb.height);
    if (cx.isPointInPath(x, y)) {

      shapesArr.forEach(function(shape) {
        shape.active = false;
      })
      shapesArr[i].active = true;

    }

    canvasObj.clear()

    for (let shape of shapesArr) {
      if (shape.active == true) {
        shape.drawActive();
      } else {
        shape.draw();
      }
    }


  }
}*/

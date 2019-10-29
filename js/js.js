'use strict';

let canArr = []; //REMOVE
//let inside = false;

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
///// + add hover addEventListener
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
///// Check if mouse inside canvas
///////////////////
/*
function mousein(){
inside = true
}

function mouseout(){
inside = false
}
*/

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
      let xyArr = snapToWall(x, y, shape, ev)
      if(!isOccupied(xyArr[3],shape.width,xyArr[0],xyArr[1])){
        /*shape.x = xyArr[0]
        shape.y = xyArr[1]
        shape.rotate = xyArr[2]
        shape.wall = xyArr[3]
        shape.draw()*/
        shape.color = 'orange';
        shape.canAdd = true;
      } else {
        shape.color = 'red';
        shape.canAdd = false;
      }
      shape.x = xyArr[0]
      shape.y = xyArr[1]
      shape.rotate = xyArr[2]
      shape.wall = xyArr[3]

      shape.draw()

    }
  })



}


function addShape() {

  //PUSH ACTIVE SHAPE TO DRAWN SHAPES ARRAY

for (let i = 0; i < canArr[0].allShapes.length; i++) {

    let shape = canArr[0].allShapes[i]

    if (shape.active) {
  if(!shape.canAdd){ return}

      let addNewShape = Object.create(Rectangle)
      addNewShape.init(shape.id, shape.ctx, shape.x, shape.y, shape.width, shape.height, shape.depth, shape.div, shape.rotate, "green")

      /// ADD OCCUPIED WALL PIXELS TO CANVAS OBJ
      let x;
      let y;
      if (shape.wall === 'top') {
      /*  if (shape.x<60) { // if too close to wall occupy mor pixels
          canArr[0].topPix.push([0, shape.x + Number(shape.width)])
          canArr[0].leftPix.push([0, 60])
        } else {*/
          canArr[0].topPix.push([shape.x, shape.x + Number(shape.width)])
      //  }

      } else if (shape.wall === 'bottom') {
        canArr[0].bottomPix.push([shape.x, shape.x + Number(shape.width)])
      } else if (shape.wall === 'left') {
        canArr[0].leftPix.push([shape.y, shape.y + Number(shape.width)])
      } else if (shape.wall === 'right') {
        canArr[0].rightPix.push([shape.y, shape.y + Number(shape.width)])
      }

      canArr[0].drawnShapes.push(addNewShape)
    }
  }



  canArr[0].redraw()
  canArr[0].canvas.removeEventListener('mousemove', hovershape)
  removeActive(canArr[0])




}


////////////////
///// Snap to wall
///////////////////
function snapToWall(x, y, shape, ev) {
  let canWidth = ev.target.width;
  let canHeight = ev.target.height;

  // GET OFFSET FROM SIDES OF CANVAS
  let yTopOffset = y
  let yBottomOffset = canHeight - yTopOffset
  let xLeftOffset = x
  let xRightOffset = canWidth - xLeftOffset



  if (yTopOffset < yBottomOffset && yTopOffset < xLeftOffset && yTopOffset < xRightOffset) {
    let wall = 'top'; // OCCUPIED SIDE
    let newY = 0;
    let newX;


    if (x > canWidth - shape.width / 2) { // if outside canvas, move inside
      newX = canWidth - shape.width
    } else if (x < shape.width / 2) {
      newX = 0
    } else {
      newX = x - shape.width / 2;
    }
    return [newX,newY,false,wall]


  } else if (yBottomOffset < yTopOffset && yBottomOffset < xLeftOffset && yBottomOffset < xRightOffset) {
    let wall = 'bottom'; // OCCUPIED SIDE
    let newY = canHeight - shape.depth;
    let newX;

    if (x > canWidth - shape.width / 2) { // if outside canvas, move inside
      newX = canWidth - shape.width
    } else if (x < shape.width / 2) {
      newX = 0
    } else {
      newX = x - shape.width / 2;
    }

    return [newX,newY,false,wall]
    // DRAW SHAPE
    shape.rotate = false;
    shape.draw();
  } else if (xLeftOffset < xRightOffset && xLeftOffset <= yBottomOffset && xLeftOffset <= yBottomOffset) {
    let wall = 'left'; // OCCUPIED SIDE
    let newX = 0;
    let newY;

    if (y > canHeight - shape.width / 2) { // if outside canvas, move inside
      newY = canHeight - shape.width
    } else if (y < shape.width / 2) {
      newY = 0
    } else {
      newY = y - shape.width / 2;
    }
    // DRAW SHAPE
    return [newX,newY,true,wall]
    shape.rotate = true;
    shape.draw();
  } else if (xRightOffset < xLeftOffset && xRightOffset <= yBottomOffset && xRightOffset <= yBottomOffset) {
    let wall = 'right'; // OCCUPIED SIDE
    let newX = canWidth - shape.depth;
    let newY;

    if (y > canHeight - shape.width / 2) { // if outside canvas, move inside
      newY = canHeight - shape.width
    } else if (y < shape.width / 2) {
      newY= 0
    } else {
      newY = y - shape.width / 2;
    }
    // DRAW SHAPE
    return [newX,newY,true,wall]
    shape.rotate = true;
    shape.draw();
  }

  return [shape.x, shape.y, shape.rotate]
}


//CHECK IF SPACE IS OCCUPIED
function isOccupied(wall,width,xPix,yPix){

if(wall==='top'){
  for (let i = 0; i < canArr[0].topPix.length; i++) {
    let dPix = canArr[0].topPix[i];
    if (dPix[0]<xPix && xPix<dPix[1] || dPix[0]<xPix+Number(width) && xPix+Number(width)<dPix[1]  || xPix<=dPix[0] && xPix+Number(width)>dPix[0] ) {
      return true;
    }
  }
}
if(wall==='bottom'){
  for (let i = 0; i < canArr[0].bottomPix.length; i++) {
    let dPix = canArr[0].bottomPix[i];
    if (dPix[0]<xPix && xPix<dPix[1] || dPix[0]<xPix+Number(width) && xPix+Number(width)<dPix[1]  || xPix<=dPix[0] && xPix+Number(width)>dPix[0] ) {
      return true;
    }
  }
}
if(wall==='left'){
  for (let i = 0; i < canArr[0].leftPix.length; i++) {
    let dPix = canArr[0].leftPix[i];
    if (dPix[0]<yPix && yPix<dPix[1] || dPix[0]<yPix+Number(width) && yPix+Number(width)<dPix[1]  || yPix<=dPix[0] && yPix+Number(width)>dPix[0] ) {
      return true;
    }
  }
}
if(wall==='right'){
  for (let i = 0; i < canArr[0].rightPix.length; i++) {
    let dPix = canArr[0].rightPix[i];
    if (dPix[0]<yPix && yPix<dPix[1] || dPix[0]<yPix+Number(width) && yPix+Number(width)<dPix[1]  || yPix<=dPix[0] && yPix+Number(width)>dPix[0] ) {
      return true;
    }
  }
}
}

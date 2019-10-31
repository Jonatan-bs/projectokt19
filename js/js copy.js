'use strict';

let canArr = []; //REMOVE
//let inside = false;
//function test(){console.log('test');}
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
  for (let i = 0; i < divShapes.length; i++) {

    let shapeDiv = divShapes[i];

    let width = shapeDiv.dataset.width;
    let height = shapeDiv.dataset.height;
    let depth = shapeDiv.dataset.depth;
    let label = shapeDiv.dataset.label;
    let placement = shapeDiv.dataset.placement;
    let id = i; //shapeDiv.id;

    let shapeObj = Object.create(Rectangle)
    shapeObj.init(id, kitchenCan.context, 0, 0, width, height, depth, shapeDiv, false, "orange", label, placement)

    //ADD TO SHAPE ARRAY IN CANVAS
    kitchenCan.allShapes.push(shapeObj)



    // MAKE OBJECT AND DIV ACTIVE ON CLICK
    shapeDiv.addEventListener('click', function() {
      makeActive(shapeDiv, shapeObj, kitchenCan)
    })
  }
  // MAKE DOOR AND ADD TO CANVAS
  let shapeObj = Object.create(Circle)
  //init(cv, x, y, radius, sAngle, eAngle, clock, color)
  shapeObj.init(kitchenCan.context, 70, 0, 70, 0, Math.PI / 180 * 110, false, 'grey', 1)
  shapeObj.active = true;
  shapeObj.canAdd = true;
  kitchenCan.allShapes.push(shapeObj)
  addShape()



  kitchenCan.canvas.addEventListener('mousedown', hittest)
  //kitchenCan.canvas.addEventListener('click', addShape)
  //kitchenCan.canvas.addEventListener('mouseout', function(){kitchenCan.redraw();})
  kitchenCan.canvas.addEventListener('mousemove', infolabel)

  //RESIZE BUTTON
  document.getElementById('reset').addEventListener('click', function() {
    resetResize(shapeObj)
  })
  //RESIZE BUTTON
  document.getElementById('orderInfo').addEventListener('click', function() {
    orderInfo();
  })

  let eventTrack;
  canArr[0].canvas.addEventListener('mousemove', function(ev) {
    eventTrack = ev;
  })


  //ROTATE ON SPACE CLICK
  document.body.onkeyup = function(e) {
    if (e.keyCode == 32) {
      rotateSpace(eventTrack)
    }
  }

}
window.addEventListener('load', init)


///resetResize
function resetResize(circle) {
  let canLength = document.getElementById('canLength').value * 100
  let canWidth = document.getElementById('canWidth').value * 100

  canArr[0].allShapes.forEach(function(shape) {
    shape.active = false;
  })
  canArr[0].canvas.height = canLength;
  canArr[0].canvas.width = canWidth;
  canArr[0].drawnShapes = []
  canArr[0].topPix = [];
  canArr[0].bottomPix = [];
  canArr[0].leftPix = [];
  canArr[0].rightPix = [];
  circle.active = true;
  circle.x = circle.radius;
  circle.y = 0;
  addShape();
  canArr[0].redraw();


}

// GET ORDER INFO AND RESET
function orderInfo() {
  canArr[0].drawnShapes.forEach(function(elm) {
    if (elm.type !== 'circle') {

      console.log(elm);
    }

  })

}

// SHOW INFO ON HOVER
function infolabel(ev) {
  let drawnShapes = canArr[0].drawnShapes

  for (let i = 0; i < drawnShapes.length; i++) {
    let cx = drawnShapes[i].ctx;
    if (drawnShapes[i].type === "rectangle") {
      cx.beginPath();
      if (!drawnShapes[i].rotate) {
        cx.rect(drawnShapes[i].x, drawnShapes[i].y, drawnShapes[i].width, drawnShapes[i].depth);
      } else {
        cx.rect(drawnShapes[i].x, drawnShapes[i].y, drawnShapes[i].depth, drawnShapes[i].width);
      };
      cx.closePath()
    } else if (drawnShapes[i].type === "circle") {
      cx.beginPath();
      cx.moveTo(drawnShapes[i].x, drawnShapes[i].y);
      cx.arc(drawnShapes[i].x, drawnShapes[i].y, drawnShapes[i].radius, drawnShapes[i].sAngle, drawnShapes[i].eAngle, drawnShapes[i].clock);
      cx.closePath()
    }

    let bb = ev.target.getBoundingClientRect(); // canvas size and pos
    // mouse to canvas coordinates
    let x = (ev.clientX - bb.left) * (ev.target.width / bb.width);
    let y = (ev.clientY - bb.top) * (ev.target.height / bb.height);
    if (cx.isPointInPath(x, y)) {

      let shape = drawnShapes[i]
      if (shape.div) {
        shape.div.classList.add('active')
      }
      document.getElementById('label').querySelector('p').innerHTML = shape.label;
      document.getElementById('label').style.display = 'block';
      canArr[0].canvas.style.cursor = 'pointer';
      return

    } else {
      document.querySelectorAll('.shape.active').forEach(function(div) {
        div.classList.remove("active")
      })
      canArr[0].canvas.style.cursor = 'default';
      document.getElementById('label').querySelector('p').innerHTML = "";
      document.getElementById('label').style.display = 'none';

    }
  }
}


////////////////
///// make Object and div active on click
///// + add hover addEventListener
///////////////////


function makeActive(shapeDiv, shapeObj, canvasObj, hoverFunc) {

  // TRUE IF ALREADY ACTIVE
  let isActive = shapeDiv.classList.contains('active');

  // if divs and shapeObjects has active... remove active
  removeActive(canvasObj)
  canvasObj.canvas.removeEventListener('mousedown', hittest)
  canvasObj.redraw()

  canvasObj.canvas.removeEventListener('mousemove', hovershape) // NOT WORKING



  // IF NOT ALREADY ACTIVE
  if (!isActive) {
    canArr[0].canvas.addEventListener('click', addShape)
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


function removeActive() {
  //canArr[0].canvas.addEventListener('click', hittest)
  // IF ANY shapeDIV HAS CLASS ACTIVE, REMOVE CLASS
  document.querySelectorAll('.shape.active').forEach(function(div) {
    div.classList.remove("active")
  })
  // IF ANY shapeOBJ IS ACTIVE, REMOVE ACTIVE
  canArr[0].allShapes.forEach(function(shape) {
    shape.active = false;
  });
}


////////////////
///// SHOW SHAPE ON HOVER
///////////////////

function hovershape(ev) {
  canArr[0].canvas.style.cursor = 'grab';
  canArr[0].allShapes.forEach(function(shape) {
    if (shape.active) {
      //CLEAR CANVAS
      if (shape.div) {
        shape.div.classList.add('active')
      }

      canArr[0].redraw()

      // canvas size and pos
      let bb = ev.target.getBoundingClientRect();
      // mouse to canvas coordinates
      let x = (ev.clientX - bb.left) * (ev.target.width / bb.width);
      let y = (ev.clientY - bb.top) * (ev.target.height / bb.height);

      // FIND NEAREST WALL
      let xyArr;
      let circle = false;
      let radius;
      if (shape.type == 'circle') {
        xyArr = snapToWallCircle(x, y, shape, ev)
        circle = true;
        radius = shape.radius
      } else if (shape.placement === 'wall') {
        xyArr = snapToWall(x, y, shape, ev, true)

      } else {
        xyArr = snapToWall(x, y, shape, ev, false)
      }

      /// COLLISION TEST....


            if(!collision()){
              shape.color = 'orange';
              shape.canAdd = true;
            } else {
              shape.color = 'red';
              shape.canAdd = false;
            }


      shape.x = xyArr[0]
      shape.y = xyArr[1]
      shape.rotate = xyArr[2]
      //  shape.wall = xyArr[3];
      if (shape.type === "circle") {
        shape.setRotate();
      }

      shape.draw()

    }
  })



}


/// ROTATE SHAPE
function rotateSpace(ev) {

  canArr[0].allShapes.forEach(function(shape) {

    if (shape.active && shape.placement !== 'wall') {

      if (shape.rotate) {
        shape.rotate = false
      } else {
        shape.rotate = true
      }
      hovershape(ev)
    }

  })

}



function addShape(e) {
  canArr[0].canvas.removeEventListener('click', addShape)





  //PUSH ACTIVE SHAPES FROM ALLSHAPES TO DRAWN SHAPES ARRAY


  for (let i = 0; i < canArr[0].allShapes.length; i++) {

    let shape = canArr[0].allShapes[i]

    if (shape.active) {
      if (!shape.canAdd) { //IF SHAPE IS COLLIDING WIDTH OTHERS

        canArr[0].drawnShapes.forEach(function(dShape){

          dShape.active = true;
          //dShape.canAdd = true;
          canArr[0].redraw();
          removeActive()
          infolabel(e)
          canArr[0].canvas.style.cursor = 'default';
          canArr[0].canvas.removeEventListener('mousemove', hovershape)
        })

        return
      }
      let addNewShape;
      let x;
      let y;
      let width;

      if (shape.type == 'circle') {
        addNewShape = Object.create(Circle)
        addNewShape.init(shape.ctx, shape.x, shape.y, shape.radius, shape.sAngle, shape.eAngle, shape.clock, "green", shape.rotate)
        addNewShape.active = true;
        x = shape.x - shape.radius;
        if (x < 0) {
          x = 0;
        }
        y = shape.y - shape.radius;
        if (y < 0) {
          y = 0;
        }

        width = shape.radius * 2;

      } else {
        addNewShape = Object.create(Rectangle)
        addNewShape.init(shape.id, shape.ctx, shape.x, shape.y, shape.width, shape.height, shape.depth, shape.div, shape.rotate, "green", shape.label, shape.placement)
        addNewShape.active = true;
        x = shape.x;
        y = shape.y;
        width = shape.width;
      }

      canArr[0].drawnShapes.push(addNewShape)
    }
  }



  // REMOVE NOT ACTIVE SHAPES IN DRAWN SHAPES
  for (let i = 0; i < canArr[0].drawnShapes.length; i++) {
    if (canArr[0].drawnShapes[i].active === false) {
      canArr[0].drawnShapes.splice(i, 1)
    }

  }


  canArr[0].redraw()
  canArr[0].canvas.removeEventListener('mousemove', hovershape)
  canArr[0].canvas.addEventListener('mousedown', hittest)

  removeActive(canArr[0])




}


////////////////
///// Snap to wall
///////////////////
function snapToWall(x, y, shape, ev, wall) {
  let canWidth = ev.target.width;
  let canHeight = ev.target.height;
  //shape.rotate = true;

  // GET OFFSET FROM SIDES OF CANVAS
  let yTopOffset = y
  let yBottomOffset = canHeight - yTopOffset
  let xLeftOffset = x
  let xRightOffset = canWidth - xLeftOffset

  if (wall) {


    if (yTopOffset < yBottomOffset && yTopOffset < xLeftOffset && yTopOffset < xRightOffset) {
      let newY = 0;
      let newX;
      let shapeWidth = shape.width;


      if (x > canWidth - shapeWidth / 2) { // if outside canvas, move inside
        newX = canWidth - shapeWidth
      } else if (x < shapeWidth / 2) {
        newX = 0
      } else {
        newX = x - shapeWidth / 2;
      }
      return [newX, newY, false]


    } else if (yBottomOffset < yTopOffset && yBottomOffset < xLeftOffset && yBottomOffset < xRightOffset) {
      let newY = canHeight - shape.depth;
      let newX;

      if (x > canWidth - shape.width / 2) { // if outside canvas, move inside
        newX = canWidth - shape.width
      } else if (x < shape.width / 2) {
        newX = 0
      } else {
        newX = x - shape.width / 2;
      }

      return [newX, newY, false]

    } else if (xLeftOffset < xRightOffset && xLeftOffset <= yBottomOffset && xLeftOffset <= yBottomOffset) {
      let newX = 0;
      let newY;

      if (y > canHeight - shape.width / 2) { // if outside canvas, move inside
        newY = canHeight - shape.width
      } else if (y < shape.width / 2) {
        newY = 0
      } else {
        newY = y - shape.width / 2;
      }

      return [newX, newY, true]

    } else if (xRightOffset < xLeftOffset && xRightOffset <= yBottomOffset && xRightOffset <= yBottomOffset) {
      let newX = canWidth - shape.depth;
      let newY;

      if (y > canHeight - shape.width / 2) { // if outside canvas, move inside
        newY = canHeight - shape.width
      } else if (y < shape.width / 2) {
        newY = 0
      } else {
        newY = y - shape.width / 2;
      }
      // DRAW SHAPE
      return [newX, newY, true]

    }

    return [shape.x, shape.y, shape.rotate]

  } else { // if not snap to wall, prevent moving out of canvas


    let newY;
    let newX;
    let rotate = shape.rotate;
    let shapeWidth = shape.width;
    let shapeHeight = shape.depth;

    if (rotate) {
      shapeWidth = shape.depth;
      shapeHeight = shape.width;
    }

    if (y > canHeight - shapeHeight / 2) { // if outside canvas, move inside
      newY = canHeight - shapeHeight

    } else if (y < shapeHeight / 2) {
      newY = 0

    } else {
      newY = y - shapeHeight / 2;
    }

    if (x > canWidth - shapeWidth / 2) { // if outside canvas, move inside
      newX = canWidth - shapeWidth
    } else if (x < shapeWidth / 2) {
      newX = 0
    } else {
      newX = x - shapeWidth / 2;
    }


    return [newX, newY, rotate]
  }
}

////////////////
///// Snap to wall CIRCLE
///////////////////
function snapToWallCircle(x, y, shape, ev) {

  let canWidth = ev.target.width;
  let canHeight = ev.target.height;


  // GET OFFSET FROM SIDES OF CANVAS
  let yTopOffset = y
  let yBottomOffset = canHeight - yTopOffset
  let xLeftOffset = x
  let xRightOffset = canWidth - xLeftOffset



  if (yTopOffset < yBottomOffset && yTopOffset < xLeftOffset && yTopOffset < xRightOffset) {
    let newY = 0;
    let newX;


    if (x > canWidth - shape.radius) { // if outside canvas, move inside
      newX = canWidth - shape.radius
    } else if (x < shape.radius) {
      newX = shape.radius
    } else {
      newX = x;
    }
    return [newX, newY, 1]


  } else if (yBottomOffset < yTopOffset && yBottomOffset < xLeftOffset && yBottomOffset < xRightOffset) {
    let newY = canHeight;
    let newX;

    if (x > canWidth - shape.radius) { // if outside canvas, move inside
      newX = canWidth - shape.radius
    } else if (x < shape.radius) {
      newX = shape.radius
    } else {
      newX = x;
    }

    return [newX, newY, 3]
    // DRAW SHAPE
    //  shape.rotate = false;
    //  shape.draw();
  } else if (xLeftOffset < xRightOffset && xLeftOffset <= yBottomOffset && xLeftOffset <= yBottomOffset) {
    let newX = 0;
    let newY;

    if (y > canHeight - shape.radius) { // if outside canvas, move inside
      newY = canHeight - shape.radius
    } else if (y < shape.radius) {
      newY = shape.radius
    } else {
      newY = y
    }
    // DRAW SHAPE
    return [newX, newY, 4]
    //  shape.rotate = true;
    //  shape.draw();
  } else if (xRightOffset < xLeftOffset && xRightOffset <= yBottomOffset && xRightOffset <= yBottomOffset) {
    let newX = canWidth;
    let newY;

    if (y > canHeight - shape.radius) { // if outside canvas, move inside
      newY = canHeight - shape.radius
    } else if (y < shape.radius) {
      newY = shape.radius
    } else {
      newY = y;
    }
    // DRAW SHAPE
    return [newX, newY, 2]
    //shape.rotate = true;
    //shape.draw();
  }

  return [shape.x, shape.y, shape.rotate]
}

//CHECK IF SPACE IS OCCUPIED
/*
function isOccupied(wall,width,xPix,yPix,circle,radius){
if (circle) {
  xPix = xPix-radius;
  if (xPix<0) {
    xPix = 0;
  }
  yPix = yPix-radius;
  if (yPix<0) {
    yPix =0;
  }
  width = radius*2


}
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
}*/


////////////////
///// Check if shape is clicked
///////////////////

let hittest = function(ev) {

  canArr[0].canvas.removeEventListener('mouseout', reset)
  canArr[0].canvas.removeEventListener('mousedown', hittest)




  let drawnShapes = canArr[0].drawnShapes

  for (let i = 0; i < drawnShapes.length; i++) {
    let cx = drawnShapes[i].ctx;
    if (drawnShapes[i].type === "rectangle") {
      cx.beginPath();
      if (!drawnShapes[i].rotate) {
        cx.rect(drawnShapes[i].x, drawnShapes[i].y, drawnShapes[i].width, drawnShapes[i].depth);

      } else {
        cx.rect(drawnShapes[i].x, drawnShapes[i].y, drawnShapes[i].depth, drawnShapes[i].width);
      };
      cx.closePath()
    } else if (drawnShapes[i].type === "circle") {
      cx.beginPath();
      cx.moveTo(drawnShapes[i].x, drawnShapes[i].y);
      cx.arc(drawnShapes[i].x, drawnShapes[i].y, drawnShapes[i].radius, drawnShapes[i].sAngle, drawnShapes[i].eAngle, drawnShapes[i].clock);
      cx.closePath()
    }

    let bb = this.getBoundingClientRect(); // canvas size and pos
    // mouse to canvas coordinates
    let x = (ev.clientX - bb.left) * (this.width / bb.width);
    let y = (ev.clientY - bb.top) * (this.height / bb.height);
    if (cx.isPointInPath(x, y)) {
      canArr[0].canvas.addEventListener('mouseup', addShape)

      let shape = drawnShapes[i]


      //make div and samme obj active
      for (let i = 0; i < canArr[0].allShapes.length; i++) {
        if (canArr[0].allShapes[i].id === shape.id) {
          canArr[0].allShapes[i].active = true;
        }
      }

      //remove occupied pixels
      /*
      let wall = shape.wall + "Pix";
      canArr[0][wall].forEach(function(occuPix,index){
        if(shape.occuPix === occuPix){;
        canArr[0][wall].splice(index, 1);
        // remove shape
        drawnShapes.splice(i,1)

      }

    })*/
      shape.active = false;
      //shape.hold = true;



      canArr[0].canvas.addEventListener('mousemove', hovershape)

      let reset = function(e) {
        shape.active = true;
        canArr[0].redraw();
        removeActive()
        infolabel(e)
        canArr[0].canvas.style.cursor = 'default';
        canArr[0].canvas.removeEventListener('mousemove', hovershape)

      }
      canArr[0].canvas.addEventListener('mouseout', reset)


    }

    canArr[0].canvas.addEventListener('mousedown', hittest)


  }
}


/////////////////
/// COLLISION TEST
////////////////

function collision() {

  let corners = [];
  let grabbedCorners = []

  /// GET CORNERS OF ACTIVE DRAWN SHAPES
  for (let shape of canArr[0].drawnShapes) {

    //if (shape.type!=='circle') {

    let cx = shape.ctx;
    if (shape.active == true) {


      if (shape.type === "rectangle") {
        cx.beginPath();
        if (!shape.rotate) {
          let x = shape.x;
          let y = shape.y;
          let width = Number(shape.width);
          let height = Number(shape.depth);


          cx.rect(x, y, width, height);
          corners.push([x, y], [x + width, y], [x + width, y + height], [x, y + height])
        } else {

          let x = shape.x;
          let y = shape.y;
          let width = Number(shape.depth);
          let height = Number(shape.width);
          cx.rect(x, y, width, height);
          corners.push([x, y], [x + width, y], [x + width, y + height], [x, y + height])

        };
        cx.closePath()

      } else if (shape.type === "circle") {

        let extra = shape.radius * Math.cos(Math.PI / 180 * 70)

        if (shape.rotate === 1) {
          let x = shape.x - extra;
          let y = shape.y;
          let width = shape.radius + extra;
          let height = shape.radius;


          cx.beginPath();
          cx.rect(x, y, width, height);
          cx.closePath()
          corners.push([x, y], [x + width, y], [x + width, y + height], [x, y + height])

        } else if (shape.rotate === 2) {

          let x = shape.x;
          let y = shape.y - extra;
          let width = -shape.radius;
          let height = shape.radius + extra;

          cx.beginPath();
          cx.rect(x, y, width, height);
          cx.closePath()
          corners.push([x, y], [x + width, y], [x + width, y + height], [x, y + height])

        }
        if (shape.rotate === 3) {

          let x = shape.x + extra;
          let y = shape.y;
          let width = -shape.radius - extra;
          let height = -shape.radius;

          cx.beginPath();
          cx.rect(x, y, width, height);
          cx.closePath()
          corners.push([x, y], [x + width, y], [x + width, y + height], [x, y + height])

        }
        if (shape.rotate === 4) {

          let x = shape.x;
          let y = shape.y + extra;
          let width = shape.radius;
          let height = -shape.radius - extra;

          cx.beginPath();
          cx.rect(x, y, width, height);
          cx.closePath()
          corners.push([x, y], [x + width, y], [x + width, y + height], [x, y + height])

        }

      }
    }
    //  }

  }
  /// CHECK IF CORNERS IS IN PATH OF ACTIVE SHAPE
  for (let shape of canArr[0].allShapes) {


    //if (shape.type!=='circle') {

    let cx = shape.ctx;
    let x;
    let y;
    let width;
    let height;

    if (shape.active !== false) {


      if (shape.type === "rectangle") {
        cx.beginPath();
        if (!shape.rotate) {
          x = shape.x;
          y = shape.y;
          width = Number(shape.width);
          height = Number(shape.depth);


          cx.rect(x, y, width, height);
        } else {

          x = shape.x;
          y = shape.y;
          width = Number(shape.depth);
          height = Number(shape.width);
          cx.rect(x, y, width, height);

        };
        cx.closePath()

      } else if (shape.type === "circle") {

        let extra = shape.radius * Math.cos(Math.PI / 180 * 70)

        if (shape.rotate === 1) {
          x = shape.x - extra;
          y = shape.y;
          width = shape.radius + extra;
          height = shape.radius;


          cx.beginPath();
          cx.rect(x, y, width, height);
          cx.closePath()

        } else if (shape.rotate === 2) {

          x = shape.x;
          y = shape.y - extra;
          width = -shape.radius;
          height = shape.radius + extra;

          cx.beginPath();
          cx.rect(x, y, width, height);
          cx.closePath()

        }
        if (shape.rotate === 3) {

          x = shape.x + extra;
          y = shape.y;
          width = -shape.radius - extra;
          height = -shape.radius;

          cx.beginPath();
          cx.rect(x, y, width, height);
          cx.closePath()

        }
        if (shape.rotate === 4) {

          x = shape.x;
          y = shape.y + extra;
          width = shape.radius;
          height = -shape.radius - extra;

          cx.beginPath();
          cx.rect(x, y, width, height);
          cx.closePath()

        }

      }

      //// CHECK FOR EACH CORNER OF OTHERS IF IN PATH
      grabbedCorners = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]]

      for (let corner of corners) {
        if (cx.isPointInPath(corner[0], corner[1])) {
          return true
        };

      }

    }


  }

  /// CHECK IF OWN CORNERS ARE INSIDE OF OTHERS
  for (let shape of canArr[0].drawnShapes) {

    //if (shape.type!=='circle') {

    let cx = shape.ctx;
    if (shape.active == true) {


      if (shape.type === "rectangle") {
        cx.beginPath();
        if (!shape.rotate) {
          let x = shape.x;
          let y = shape.y;
          let width = Number(shape.width);
          let height = Number(shape.depth);


          cx.rect(x, y, width, height);
        } else {

          let x = shape.x;
          let y = shape.y;
          let width = Number(shape.depth);
          let height = Number(shape.width);
          cx.rect(x, y, width, height);

        };
        cx.closePath()

      } else if (shape.type === "circle") {

        let extra = shape.radius * Math.cos(Math.PI / 180 * 70)

        if (shape.rotate === 1) {
          let x = shape.x - extra;
          let y = shape.y;
          let width = shape.radius + extra;
          let height = shape.radius;


          cx.beginPath();
          cx.rect(x, y, width, height);
          cx.closePath()

        } else if (shape.rotate === 2) {

          let x = shape.x;
          let y = shape.y - extra;
          let width = -shape.radius;
          let height = shape.radius + extra;

          cx.beginPath();
          cx.rect(x, y, width, height);
          cx.closePath()

        }
        if (shape.rotate === 3) {

          let x = shape.x + extra;
          let y = shape.y;
          let width = -shape.radius - extra;
          let height = -shape.radius;

          cx.beginPath();
          cx.rect(x, y, width, height);
          cx.closePath()

        }
        if (shape.rotate === 4) {

          let x = shape.x;
          let y = shape.y + extra;
          let width = shape.radius;
          let height = -shape.radius - extra;

          cx.beginPath();
          cx.rect(x, y, width, height);
          cx.closePath()

        }

      }

      for (let grabbedcorner of grabbedCorners) {
        if (cx.isPointInPath(grabbedcorner[0], grabbedcorner[1])) {
          return true
        };

      }
    }
    //  }

  }

return false


}

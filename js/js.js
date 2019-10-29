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
    let label = shapeDiv.dataset.label;
    let id = shapeDiv.id;

    let shapeObj = Object.create(Rectangle)
    shapeObj.init(id, kitchenCan.context, 0, 0, width, height, depth, shapeDiv, false, "orange",label)

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
  shapeObj.init(kitchenCan.context, 70, 0, 70, 0, Math.PI/180*360, false, 'grey')
  shapeObj.wall = 'top'
  shapeObj.active = true;
  shapeObj.canAdd = true;
  kitchenCan.allShapes.push(shapeObj)
  addShape()



  //kitchenCan.canvas.addEventListener('click', hittest)
  kitchenCan.canvas.addEventListener('click', addShape)
  kitchenCan.canvas.addEventListener('mouseout', function(){kitchenCan.redraw();})
kitchenCan.canvas.addEventListener('mousemove', infolabel)

  //RESIZE BUTTON
  document.getElementById('reset').addEventListener('click', function(){resetResize(shapeObj)})
  //RESIZE BUTTON
  document.getElementById('orderInfo').addEventListener('click', function(){orderInfo();})
}
window.addEventListener('load', init)


///resetResize
function resetResize(circle){
  let canLength = document.getElementById('canLength').value *100
  let canWidth = document.getElementById('canWidth').value * 100

  canArr[0].allShapes.forEach(function(shape){
    shape.active = false;
  })
  canArr[0].canvas.height = canLength;
  canArr[0].canvas.width = canWidth;
  canArr[0].drawnShapes = []
  canArr[0].topPix =[];
  canArr[0].bottomPix =[];
  canArr[0].leftPix =[];
  canArr[0].rightPix =[];
  circle.active = true;
  circle.x = circle.radius;
  circle.y = 0;
  addShape();
  canArr[0].redraw();


}

// GET ORDER INFO AND RESET
function orderInfo(){
  canArr[0].drawnShapes.forEach(function(elm){
    if (elm.type!=='circle') {

    console.log(elm);
    }

  })

}

// SHOW INFO ON HOVER
function infolabel(ev){
  let drawnShapes = canArr[0].drawnShapes

  for (let i = 0; i < drawnShapes.length; i++) {
    let cx = drawnShapes[i].ctx;
    if (drawnShapes[i].type === "rectangle") {
      cx.beginPath();
      if (!drawnShapes[i].rotate) {
        cx.rect(drawnShapes[i].x, drawnShapes[i].y, drawnShapes[i].width, drawnShapes[i].height);
      } else {
        cx.rect(drawnShapes[i].x, drawnShapes[i].y, drawnShapes[i].height, drawnShapes[i].width);
      };
      cx.closePath()
    } else if (drawnShapes[i].type === "circle") {
      cx.beginPath();
      cx.arc(drawnShapes[i].x, drawnShapes[i].y, drawnShapes[i].radius, drawnShapes[i].sAngle, drawnShapes[i].eAngle, drawnShapes[i].clock);
      cx.closePath()
    }

    let bb = this.getBoundingClientRect(); // canvas size and pos
    // mouse to canvas coordinates
    let x = (ev.clientX - bb.left) * (this.width / bb.width);
    let y = (ev.clientY - bb.top) * (this.height / bb.height);
    if (cx.isPointInPath(x, y)) {

      let shape = drawnShapes[i]
      if (shape.div) {
        shape.div.classList.add('active')
      }
      document.getElementById('label').querySelector('p').innerHTML=shape.label;
      document.getElementById('label').style.display = 'block';
      canArr[0].canvas.style.cursor = 'pointer';
      return
} else {
  document.querySelectorAll('.shape.active').forEach(function(div) {
    div.classList.remove("active")
  })
  canArr[0].canvas.style.cursor = 'default';
  document.getElementById('label').querySelector('p').innerHTML="";
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
  canvasObj.canvas.removeEventListener('click', hittest)
  canvasObj.redraw()

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


function removeActive() {
  canArr[0].canvas.addEventListener('click', hittest)
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
canArr[0].canvas.style.cursor = 'move';
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
      if (shape.type=='circle') {
        xyArr = snapToWallCircle(x, y, shape, ev)
        circle = true;
        radius = shape.radius
      } else {
        xyArr = snapToWall(x, y, shape, ev)

      }


      if(!isOccupied(xyArr[3],shape.width,xyArr[0],xyArr[1],circle,radius)){
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
    if(!shape.canAdd){
        return
      }
       // if Cant add, do nothing
      /*if (shape.type==='circle') {
        console.log('cc');
        return
      }*/
      let addNewShape;
      let x;
      let y;
      let width;

      if (shape.type=='circle') {
        addNewShape = Object.create(Circle)
        addNewShape.init(shape.ctx, shape.x, shape.y, shape.radius, shape.sAngle, shape.eAngle,shape.clock, "green")
        addNewShape.wall = shape.wall;
        x = shape.x-shape.radius;
        if (x<0) {
        x=0;
        }
        y = shape.y-shape.radius;
        if (y<0) {
          y=0;
        }

        width = shape.radius*2;

    } else {
      addNewShape = Object.create(Rectangle)
      addNewShape.init(shape.id, shape.ctx, shape.x, shape.y, shape.width, shape.height, shape.depth, shape.div, shape.rotate, "green",shape.label)
      addNewShape.wall = shape.wall;
      x = shape.x;
      y = shape.y;
      width = shape.width;
    }
      /// ADD OCCUPIED WALL PIXELS TO CANVAS OBJ


      //let occuPix;
      if (shape.wall === 'top') {
      /*  if (shape.x<60) { // if too close to wall occupy mor pixels
          canArr[0].topPix.push([0, shape.x + Number(shape.width)])
          canArr[0].leftPix.push([0, Number(shape.width)+Number(shape.depth)])
        } else {*/
        addNewShape.occuPix = [x, x + Number(width)]
          canArr[0].topPix.push(addNewShape.occuPix )

       //}

      } else if (shape.wall === 'bottom') {
        addNewShape.occuPix = [x, x + Number(width)]
        canArr[0].bottomPix.push(addNewShape.occuPix )
      } else if (shape.wall === 'left') {
        addNewShape.occuPix = [y, y + Number(width)]
        canArr[0].leftPix.push(addNewShape.occuPix )
      } else if (shape.wall === 'right') {
        addNewShape.occuPix = [y, y + Number(width)]
        canArr[0].rightPix.push(addNewShape.occuPix )
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
    let shapeWidth = shape.width;


    if (x > canWidth - shapeWidth / 2) { // if outside canvas, move inside
      newX = canWidth - shapeWidth
    } else if (x < shapeWidth / 2) {
      newX = 0
    } else {
      newX = x - shapeWidth / 2;
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
    let wall = 'top'; // OCCUPIED SIDE
    let newY = 0;
    let newX;


    if (x > canWidth - shape.radius) { // if outside canvas, move inside
      newX = canWidth - shape.radius
    } else if (x < shape.radius) {
      newX = shape.radius
    } else {
      newX = x;
    }
    return [newX,newY,1,wall]


  } else if (yBottomOffset < yTopOffset && yBottomOffset < xLeftOffset && yBottomOffset < xRightOffset) {
    let wall = 'bottom'; // OCCUPIED SIDE
    let newY = canHeight;
    let newX;

    if (x > canWidth - shape.radius) { // if outside canvas, move inside
      newX = canWidth - shape.radius
    } else if (x < shape.radius) {
      newX = shape.radius
    } else {
      newX = x;
    }

    return [newX,newY,3,wall]
    // DRAW SHAPE
    shape.rotate = false;
    shape.draw();
  } else if (xLeftOffset < xRightOffset && xLeftOffset <= yBottomOffset && xLeftOffset <= yBottomOffset) {
    let wall = 'left'; // OCCUPIED SIDE
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
    return [newX,newY,4,wall]
    shape.rotate = true;
    shape.draw();
  } else if (xRightOffset < xLeftOffset && xRightOffset <= yBottomOffset && xRightOffset <= yBottomOffset) {
    let wall = 'right'; // OCCUPIED SIDE
    let newX = canWidth;
    let newY;

    if (y > canHeight - shape.radius) { // if outside canvas, move inside
      newY = canHeight - shape.radius
    } else if (y < shape.radius) {
      newY= shape.radius
    } else {
      newY = y ;
    }
    // DRAW SHAPE
    return [newX,newY,2,wall]
    shape.rotate = true;
    shape.draw();
  }

  return [shape.x, shape.y, shape.rotate]
}

//CHECK IF SPACE IS OCCUPIED
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
}


////////////////
///// Check if shape is clicked
///////////////////

let hittest = function(ev) {

  let drawnShapes = canArr[0].drawnShapes

  for (let i = 0; i < drawnShapes.length; i++) {
    let cx = drawnShapes[i].ctx;
    if (drawnShapes[i].type === "rectangle") {
      cx.beginPath();
      if (!drawnShapes[i].rotate) {
        cx.rect(drawnShapes[i].x, drawnShapes[i].y, drawnShapes[i].width, drawnShapes[i].height);
      } else {
        cx.rect(drawnShapes[i].x, drawnShapes[i].y, drawnShapes[i].height, drawnShapes[i].width);
      };
      cx.closePath()
    } else if (drawnShapes[i].type === "circle") {
      cx.beginPath();
      cx.arc(drawnShapes[i].x, drawnShapes[i].y, drawnShapes[i].radius, drawnShapes[i].sAngle, drawnShapes[i].eAngle, drawnShapes[i].clock);
      cx.closePath()
    }

    let bb = this.getBoundingClientRect(); // canvas size and pos
    // mouse to canvas coordinates
    let x = (ev.clientX - bb.left) * (this.width / bb.width);
    let y = (ev.clientY - bb.top) * (this.height / bb.height);
    if (cx.isPointInPath(x, y)) {

      let shape = drawnShapes[i]


      //make div and samme obj active
      for (let i = 0; i < canArr[0].allShapes.length; i++) {
        if (canArr[0].allShapes[i].id === shape.id) {
          canArr[0].allShapes[i].active = true;
        }
      }

      //remove occupied pixels
      let wall = shape.wall + "Pix";
      canArr[0][wall].forEach(function(occuPix,index){
        if(shape.occuPix === occuPix){;
        canArr[0][wall].splice(index, 1);
        // remove shape
        drawnShapes.splice(i,1)

      }

      })

      canArr[0].canvas.addEventListener('mousemove', hovershape)
      canArr[0].canvas.removeEventListener('click', hittest)
    }




  }}

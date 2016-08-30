var isShown = false;
var dragging = false;
var drawingWidth = 0.01;
var widthIncreaseDirection = 0.01;
var turn = 0;


var camera, scene, renderer, mesh, material;
var width = 34.4, height = 30, depth = 21, zOffset = 12;
var screenWidth = 94, screenHeight = 53;
var mouse = new THREE.Vector2();

var zStart, zEnd,
    xStart, xEnd,
    yStart, yEnd;

function init() {
  $("body").css("overflow", "hidden");
  var z = 60;
  camera = new THREE.PerspectiveCamera( 2*Math.atan2(screenHeight/2, z)*(180/Math.PI), window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = z;
	camera.position.y = 0;
	camera.position.x = 0;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene = new THREE.Scene();

  drawBordersOfCube();
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener('click', onDocumentMouseMove, false);
  // renderer.render(scene, camera);
}

function drawBordersOfCube()
{
  zStart = -zOffset, zEnd = zStart-depth*(turn == 0 ? drawingWidth : 0),
  xStart = width/2, xEnd = xStart-width*(turn == 1 ? drawingWidth : 0),
  yStart = (height - screenHeight/2), yEnd = yStart-height*(turn == 2 ? drawingWidth : 0);
  mesh = [];
  var x1 = x2 = xStart, y1 = y2 = yStart, z1 = zStart, z2 = zEnd; // depth
  createLine(x1, x2, y1, y2, z1, z2, new THREE.Color("rgb(135, 77, 224)"));
  x1 = xStart, x2 = xEnd, y1 = y2 = yStart, z1 = z2 = zStart; // width
  createLine(x1, x2, y1, y2, z1, z2, new THREE.Color("rgb(224, 188, 77)"));
  x1 = x2 = xStart, y1 = yStart, y2 = yEnd, z1 = z2 = zStart; // height
  createLine(x1, x2, y1, y2, z1, z2, new THREE.Color("rgb(45, 178, 196)"));

  // x1 = x2 = xEnd, y1 = y2 = yStart, z1 = zStart, z2 = zEnd; // depth2
  // createLine(x1, x2, y1, y2, z1, z2, new THREE.Color("rgb(77, 207, 224)"));
  // x1 = xStart, x2 = xEnd, y1 = y2 = yEnd, z1 = z2 = zStart; // wdith2
  // createLine(x1, x2, y1, y2, z1, z2, new THREE.Color("rgb(135, 77, 224)"));
  // x1 = x2 = xEnd, y1 = yStart, y2 = yEnd, z1 = z2 = zStart; // height2
  // createLine(x1, x2, y1, y2, z1, z2, new THREE.Color("rgb(224, 77, 135)"));

  // x1 = xStart, x2 = xEnd, y1 = y2 = yStart, z1 = z2 = zEnd; // wdith3
  // createLine(x1, x2, y1, y2, z1, z2, new THREE.Color("rgb(77, 224, 123)"));
}

function createLine(x1, x2, y1, y2, z1, z2, inputColor)
{
  var geometry = new THREE.Geometry();
  geometry.vertices.push(
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3(x2, y2, z2)
    );
  var line = new THREE.MeshLine();
  line.setGeometry( geometry );
  material = new THREE.MeshLineMaterial(
    {
      color: inputColor,
      sizeAttenuation: true,
      lineWidth: 1
    }
  );
  var t = zOffset+depth/2;
  var tempMesh = new THREE.Mesh(line.geometry, material);
  tempMesh.translateZ(-t);
  tempMesh.rotateY((-35 * Math.PI)/180);
  tempMesh.translateZ(t);
  mesh.push(tempMesh);
  scene.add( mesh[mesh.length-1] );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  console.log("x" + mouse.x);
  console.log("y" + mouse.y);
  // var vertices = geometry.vertices;
	// vertices.push(
	// 	new THREE.Vector3(mouse.x * 62 * window.innerWidth/window.innerHeight, mouse.y * 62, 0));
  //
	// geometry = new THREE.Geometry();
	// geometry.vertices = vertices;
  //
	// scene.remove( mesh );
  // line = new THREE.MeshLine();
  // line.setGeometry( geometry );
  // mesh = new THREE.Mesh( line.geometry, material ); // this syntax could definitely be improved!
  // scene.add( mesh );
}

var waitTime = 0, shouldWaiting = false;
var label, length;

function draw() {
  if(!shouldWaiting)
  {
    var tempMeshLength = mesh.length;
    for(i = 0; i < mesh.length; i++)
      scene.remove(mesh[i]);
    mesh = [];
    drawingWidth += widthIncreaseDirection;
    if(drawingWidth >= 1)
    {
      widthIncreaseDirection = -0.01;
      shouldWaiting = true;
    }
    else if(drawingWidth <= 0)
    {
      widthIncreaseDirection = 0.01;
      turn = ((turn + 1) % tempMeshLength);
      updateWidthInfo();
    }
    drawBordersOfCube();
    var lengthString = parseFloat(Math.round((length*drawingWidth) * 100) / 100).toFixed(2);
    label.html(lengthString + " cm");
    mesh[turn].updateMatrixWorld();
    var vector = mesh[turn].geometry.vertices[1].clone();
    vector.applyMatrix4( mesh[turn].matrixWorld );
    // console.log("left", position.x + "px");
    // console.log("top", position.y + "px");
    renderer.render(scene, camera);
  }
  else
  {
    waitTime++;
    if(waitTime >= 100)
    {
      waitTime = 0;
      shouldWaiting = false;
    }
  }
}

function updateWidthInfo()
{
  if(label != null) label.hide();
  else
  {
    $(".info").each(
      function() {$(this).hide();}
    );
  }
  if(turn == 0)
  {
    label = $("#depthInfo");
    length = depth;
  }
  else if(turn == 1)
  {
    label = $("#widthInfo");
    length = width;
  }
  else if(turn == 2)
  {
    label = $("#heightInfo");
    length = height;
  }
  label.show();
}

function loopAnimate()
{
    setTimeout(
      function()
      {
        requestAnimationFrame(loopAnimate);
        draw();
      }, 1000 / 60
    );
}












$(function()
{
  // $("#bc").draggable(
  //   {
  //     drag: function(event)
  //     {
  //       $("#homeCanves").css("top", event.pageY);
  //     }
  //   }
  // );

  init();
  loopAnimate();
  updateWidthInfo();

  $(".pos").mousedown(function (event) {dragging = true;});
  $("#bc").mousemove(function (event) {if(dragging) dragFunc(event)});
  $("#bc").mouseup(function (event) {dragging = false;});

  $("#shape").click(
    function(event)
    {
      if(!isShown)
      {
        isShown = true;
        var width = $(".pos").width(), height = $(".pos").height();
        var wYPos =  $(".pos").position().top - 25, wXPos = $(".pos").position().left + width/2;
        var hYPos =  $(".pos").position().top + height/2, hXPos = $(".pos").position().left + width;
        var elem1 = "<button id=\"widthIndicator\" class=\"btn\">aaa</button>";
        var elem2 = "<button id=\"heightIndicator\" class=\"btn\">aaa</button>";
        $("body").append(elem1, elem2);
        $("#widthIndicator").css(
          {
            top: wYPos,
            left: wXPos,
          }
        );

        $("#heightIndicator").css(
          {
            top: hYPos,
            left: hXPos,
          }
        );
      }
      else
      {
        isShown = false;
        $("#heightIndicator").remove();
        $("#widthIndicator").remove();
      }

    }
  );
  ShineDot();
}
);

function ShineDot()
{
  $(".pos")
        // .delay(1000)
        .fadeIn(700)
        // .delay(1000)
        .fadeOut(700, function() {ShineDot()});
}

function dragFunc(event)
{
  console.log("drag");
  $(".pos").stop();
  $(".pos").css("opacity", 1);
  var startPoint = $(".pos").position();
  var endPoint = (event.pageX > startPoint.left ? event.pageX - startPoint.left : 100);
  console.log("start: " + startPoint.left);
  console.log("endPoint: " + endPoint);
  $(".pos").css("width", endPoint + 'px');
  $(".pos").css("left", "50%");
}

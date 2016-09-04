var isShown = false;
var dragging = false;
var drawingWidth = 0.01;
var widthIncreaseDirection = 0.01;
var turn = 0;


var camera, scene, renderer, mesh, geos, lines, materials;
var width = 34.4, height = 30, depth = 21, zOffset = 12;
var screenWidth = 94, screenHeight = 53;
var mouse = new THREE.Vector2();

var zStart, zEnd,
    xStart, xEnd,
    yStart, yEnd;

function init() {
  mesh = [], geos = [], lines = [], materials = [];
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
}

function drawBordersOfCube()
{
  zStart = -zOffset, zEnd = zStart-depth*(turn == 0 ? drawingWidth : 0),
  xStart = width/2, xEnd = xStart-width*(turn == 1 ? drawingWidth : 0),
  yStart = (height - screenHeight/2), yEnd = yStart-height*(turn == 2 ? drawingWidth : 0);
  var isNewLine = (mesh.length == 0 ? true : false);
  var x1 = x2 = xStart, y1 = y2 = yStart, z1 = zStart, z2 = zEnd; // depth
  createLine(x1, x2, y1, y2, z1, z2, new THREE.Color("rgb(135, 77, 224)"), isNewLine ? -1 : 0);
  x1 = xStart, x2 = xEnd, y1 = y2 = yStart, z1 = z2 = zStart; // width
  createLine(x1, x2, y1, y2, z1, z2, new THREE.Color("rgb(224, 188, 77)"), isNewLine ? -1 : 1);
  x1 = x2 = xStart, y1 = yStart, y2 = yEnd, z1 = z2 = zStart; // height
  createLine(x1, x2, y1, y2, z1, z2, new THREE.Color("rgb(45, 178, 196)"), isNewLine ? -1 : 2);
}

function createLine(x1, x2, y1, y2, z1, z2, inputColor, offset)
{
  var line, geometry, material, tempMesh;
  if(offset == -1)
  {
    geometry = new THREE.Geometry();
    geometry.vertices.push(
        new THREE.Vector3(x1, y1, z1),
        new THREE.Vector3(x2, y2, z2)
      );
    geos.push(geometry);
    line = new THREE.MeshLine();
    line.setGeometry( geometry );
    lines.push(line);
    material = new THREE.MeshLineMaterial(
      {
        color: inputColor,
        sizeAttenuation: true,
        lineWidth: 1
      }
    );
    materials.push(material);
    tempMesh = new THREE.Mesh(line.geometry, material);
    var t = zOffset+depth/2;
    tempMesh.translateZ(-t);
    tempMesh.rotateY((-35 * Math.PI)/180);
    tempMesh.translateZ(t);

    mesh.push(tempMesh);
  }
  else
  {
    geometry = geos[offset];
    geometry.vertices[0].x = x1;
    geometry.vertices[0].y = y1;
    geometry.vertices[0].z = z1;

    geometry.vertices[1].x = x2;
    geometry.vertices[1].y = y2;
    geometry.vertices[1].z = z2;
    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    geometry.uvsNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
    geometry.lineDistancesNeedUpdate = true;
    geometry.lineDistances = true;

    line = lines[offset];
    line.setGeometry( geometry );

    material = materials[offset];
    tempMesh = mesh[offset];
    tempMesh.geometry = line.geometry;
  }

  scene.add( tempMesh );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

var shouldWaiting = false;
var label, length;

function draw() {
  if(!shouldWaiting)
  {
    var tempMeshLength = mesh.length;
    for(i = 0; i < tempMeshLength; i++)
    {
      scene.remove(mesh[i]);
    }

    drawingWidth += widthIncreaseDirection;
    if(drawingWidth <= 0)
    {
      widthIncreaseDirection = 0.01;
      drawingWidth = 0.01;
      // turn = ((turn + 1) % tempMeshLength);
      hideAllInfoes();
    }
    else
    {
      if(drawingWidth >= 1)
      {
        widthIncreaseDirection = -0.01;
        shouldWaiting = true;
      }
      updateWidthInfo()
      drawBordersOfCube();
      var lengthString = parseFloat(Math.round((length*drawingWidth) * 100) / 100).toFixed(2);
      label.html(lengthString + " cm");
      requestAnimationFrame(loopAnimate);
    }
    renderer.render(scene, camera);
  }
  else
  {
    setTimeout(
      function()
      {
        shouldWaiting = false;
        requestAnimationFrame(loopAnimate);
      }, 10000
    );
  }
}

function updateWidthInfo()
{
  if(label != null) label.hide();
  else
  {
    hideAllInfoes();
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
        draw();
      }, 1000 / 60
    );
}

function hideAllInfoes()
{
  $(".info").each(
    function() {$(this).hide();}
  );
}


$(function()
{
  init();
  // loopAnimate();
  // updateWidthInfo();
  hideAllInfoes();

  $("#widthSelector").click(
    function ()
    {
      turn = 1;
      loopAnimate();
    }
  );
  $("#heightSelector").click(
    function ()
    {
      turn = 2;
      loopAnimate();
    }
  );
  $("#depthSelector").click(
    function ()
    {
      turn = 0;
      loopAnimate();
    }
  );
}
);

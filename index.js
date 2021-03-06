import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

function main() {
  const canvas = document.querySelector('#bg');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('lightblue');

   //Light


   function addLight(...pos) {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...pos);
    scene.add(light);
    }
    addLight(-1, 2, 4);
    addLight( 1, -1, -2);
  //Helpers

  // const gridHelper = new THREE.GridHelper(100, 10);
  // scene.add(gridHelper);
  // gridHelper.position.set(0, -5, 0);


  // const loader = new THREE.GLTFLoader();

  // loader.load( 'img/Robot.glb', function ( Robot ) {
    
  //   let mesh = Robot.scene;
  //   mesh.scale.set( 0.3, 0.3, 0.3 );
  //   scene.add( mesh );
  //   //scene.add( Robot.scene );
  
  // }, undefined, function ( error ) {
  
  //   console.error( error );
  
  // } );


  const cube = new THREE.Mesh(
     new THREE.BoxBufferGeometry(0.3, 1, 0.3),
     new THREE.MeshPhongMaterial({color: 'red'}),
  );


  scene.add(cube);


//Array of points
var points = [
  [68.5,185.5],
  [1,262.5],
  [270.9,281.9],
  [300,212.8],
  [178,155.7],
  [240.3,72.3],
  [153.4,0.6],
  [52.6,53.3],
  [68.5,185.5]
];

//Convert the array of points into vertices
for (var i = 0; i < points.length; i++) {
  var y = points[i][0];
  //We set a random value for the Y axis
  //var x = (Math.random()-0.5)*25;
  var x = points[i][0];
  var z = points[i][1];
  points[i] = new THREE.Vector3(x, y, z);
}
//Create a path from the points
let path = new THREE.Curves.GrannyKnot(points);

//Create the tube geometry from the path
let geometry = new THREE.TubeGeometry( path, 100, 3, 32, true );
//Basic material

let tubeTexture = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load('img/galaxyTexture.jpg'),
  side : THREE.BackSide
});


tubeTexture.map.wrapS = THREE.MirroredRepeatWrapping;
tubeTexture.map.wrapT = THREE.MirroredRepeatWrapping;
tubeTexture.map.repeat.set( 30, 4 );



//Create a mesh
let tube = new THREE.Mesh( geometry,  tubeTexture);
//Add tube into the scene
scene.add( tube );



  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  let percentage = 0;

  let then = 0;
  function render(now) {
    now *= 0.001; // convert to seconds
    const deltaTime = now - then;
    then = now;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    
    // cube.rotation.x = now;
    // cube.rotation.y = now * 1.1;

    percentage += 0.0003;
    var p1 = path.getPointAt(percentage%1);
    var p2 = path.getPointAt((percentage + 0.01)%1);
    camera.position.set(p1.x,p1.y,p1.z);
    camera.lookAt(p2);
    
    // move cube in front of camera
    {
      const distanceFromCamera = 2;  // 3 units
      const target = new THREE.Vector3(0, 0, -distanceFromCamera);
      target.applyMatrix4(camera.matrixWorld);    
    
      const moveSpeed = 1000;  // units per second
      const distance = cube.position.distanceTo(target);
      if (distance > 0) {
        const amount = Math.min(moveSpeed * deltaTime, distance) / distance;
        cube.position.lerp(target, amount);
       // cube.material.color.set('green');
      } else {
       // cube.material.color.set('red');
      }
    }



    



    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
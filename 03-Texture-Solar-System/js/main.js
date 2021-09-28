// get intern width and height
const W = window.innerWidth;
const H = window.innerHeight;

// function to calc stars
const getRandomParticlePos = (particleCount) => {
  const arr = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    arr[i] = (Math.random() - 0.5) * 1200;
  }
  return arr;
};

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 3000);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(W, H);
document.body.appendChild(renderer.domElement);

// Make Canvas Responsive
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight); // Update size
  camera.aspect = window.innerWidth / window.innerHeight; // Update aspect ratio
  camera.updateProjectionMatrix(); // Apply changes
});

// Stats Panel (ms, fps, mb)
const stat = new Stats();
stat.setMode(0);
stat.domElement.style.position = "absolute";
stat.domElement.style.left = "0px";
stat.domElement.style.top = "0px";
document.body.appendChild(stat.domElement);

// temporizer
const debug = document.createElement("div");
debug.style.position = "absolute";
debug.style.left = "5px";
debug.style.bottom = "0px";
debug.style.width = "500px";
debug.style.height = "30px";
debug.style.fontSize = "calc(5px + 2vmin)";
debug.style.color = "aquamarine";
document.body.appendChild(debug);
debug.innerHTML = "...";

// variables 
let light, ambientLight, starLight, controls;
let sun, earth, starGeo;
let now = Date.now();

function init() {
  // set the camera position
  camera.position.set(0, 0, 700);
  // create a point light to the sun
  light = new THREE.PointLight( 0xffffff, 4, 3000 );
  // set the light position
  light.position.set(0, 0, 0);

  // set the ambient light 
  ambientLight = new THREE.AmbientLight( 0x404040, 0.7 );

  // add lights to scene
  scene.add(light);
  scene.add(ambientLight);
  // the ambient light position does not matter.

  // create sun sphere
  let geo = new THREE.SphereGeometry(100, 30, 30);
  // apply texture to sun
  let mat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: new THREE.TextureLoader().load("textures/sun.png"),
  });
  sun = new THREE.Mesh(geo, mat);
  // add sun to scene
  scene.add(sun);
  // when not specified, the initial position is 0, 0, 0;

  // create earth sphere
  geo = new THREE.SphereGeometry(40, 30, 30);
  // create texture to earth
  mat = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load("textures/earth.jpeg"),
  });
  // apply the mesh surface in the material sphere
  earth = new THREE.Mesh(geo, mat);
  // add earth to scene
  scene.add(earth);
  // set the initial position of earth
  earth.position.x = 300;

  // creating and setting stars

    // light source
    const starLightColor = 0xffffff;
    const starLightIntensity = 0.05;
    starLight = new THREE.DirectionalLight(starLightColor, starLightIntensity);
    starLight.position.set(-1, 2, 4);
    scene.add(starLight);

    // stars geometry
    starGeo = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];

    starGeo[0].setAttribute(
      "position",
      new THREE.BufferAttribute(getRandomParticlePos(150), 3)
    );
    starGeo[1].setAttribute(
      "position",
      new THREE.BufferAttribute(getRandomParticlePos(1500), 3)
    );
  
    const loader = new THREE.TextureLoader();
  
    // stars material
    const materials = [
      new THREE.PointsMaterial({
        size: 1,
        map: loader.load("textures/star01.png"),
        transparent: true
        // color: "#ff0000"
      }),
      new THREE.PointsMaterial({
        size: 1.5,
        map: loader.load("textures/star02.png"),
        transparent: true
        // color: "#0000ff"
      })
    ];
  
    const starsT1 = new THREE.Points(starGeo[0], materials[0]);
    const starsT2 = new THREE.Points(starGeo[1], materials[1]);
    scene.add(starsT1);
    scene.add(starsT2);

  // set the camera control
  controls = new THREE.TrackballControls(camera, renderer.domElement);
}

function render() {
  requestAnimationFrame(render);
  stat.begin();
  now = Date.now();
  debug.innerHTML = "t:" + now;
  earth.position.x = 300 * Math.cos(0.0005 * now);
  earth.position.z = 300 * Math.sin(0.0005 * now);

  sun.rotation.y += 0.01;
  earth.rotation.y += 0.03;
  controls.update();

  stat.end();
  renderer.render(scene, camera);
}

init();
render();
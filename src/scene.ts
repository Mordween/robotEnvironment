import { Project, Scene3D, PhysicsLoader, THREE, /*ExtendedObject3D */} from "enable3d";
import { loadRobot, RobotDictionary } from "./robots.ts";

import URDFLoader from 'urdf-loader';
import { LoadingManager } from 'three';

const robotManager = new LoadingManager();
const robotLoader = new URDFLoader( robotManager );


// Define the robot data
const robotData: RobotDictionary = {
  "base": {
    "joint" : NaN.toString(),
    "mesh": "src/assets/base.glb",
    "t": [0, 0, 0],
    "q": [0, 0, 0, 1]
  },
  "link1": {
    "joint" : "joint1",
    "mesh": "src/assets/link1.glb",
    "t": [0.0, 0.0, 0.2435],
    "q": [0.0, 0.0, 0.0, 1.0]
  },
  "link2": {
    "joint" : "joint2",
    "mesh": "src/assets/link2.glb",
    "t": [0.0, 0.0, 0.2435],
    "q": [-0.4999981410979567, -0.5000018143028963, -0.4999963044921138, 0.5000036954879761]
  },
  "link3": {
    "joint" : "joint3",
    "mesh": "src/assets/link3.glb",
    "t": [7.353756616701401e-07, 5.402371266756581e-12, 0.4436999999986494],
    "q": [0.7071041706433439, 6.493365701876792e-06, 1.2986979459196817e-06, 0.7071093916893005]
  },
  "link4": {
    "joint" : "joint4",
    "mesh": "src/assets/link4.glb",
    "t": [0.08699906327003075, -7.134198477910336e-07, 0.21608936087324546],
    "q": [1.0, 5.5098144010580686e-06, -3.673194983895874e-06, 1.8366160440284816e-06]
  },
  "link5": {
    "joint" : "joint5",
    "mesh": "src/assets/link5.glb",
    "t": [0.08699906327003075, -7.134198477910336e-07, 0.21608936087324546],
    "q": [-0.7071067932571579, -1.2986741408059922e-06, 6.493370704012438e-06, 0.7071067690849304]
  },
  "link6": {
    "joint" : "joint6",
    "mesh": "src/assets/link6.glb",
    "t": [0.08699860411939285, -7.134240641771995e-07, 0.15358936087493202],
    "q": [1.0, 5.509814401058069e-06, -3.6731949838958737e-06, 1.8366160440284816e-06]
  },
};

function loadURDF(scene: Scene3D)
{
    robotLoader.packages = {
        packageName : './package/dir/'              // The equivalent of a (list of) ROS package(s):// directory
    };
    robotLoader.load(
      'ufactory_description/lite6/urdf/lite6.urdf', // The path to the URDF within the package OR absolute                       
      robot => {

        console.log(robot);

        // loadRobot(robotData, robot, scene);
    
        // The robot is loaded!
        
        scene.add.existing(robot)

        // scene.physics.add.existing(robot, { shape: 'mesh' })
    
      }
    );
}

class MainScene extends Scene3D {
  box: any;
  constructor() {
    //@ts-ignore
    super("MainScene");
  }

  init() {
    console.log("Init");
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  preload() {
    console.log("Preload");
  }

  create() {
    // const opacity = 0.8
    // const transparent = true

    console.log("create");

    const axesHelper = new THREE.AxesHelper( 5 );
    axesHelper.setColors(new THREE.Color(255, 0, 0), new THREE.Color(0, 255, 0), new THREE.Color(0, 0, 255))    // in order to know which axis is the right axis
    this.scene.add( axesHelper );

    // Resize window.
    const resize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      this.renderer.setSize(newWidth, newHeight);
      //@ts-ignore
      this.camera.aspect = newWidth / newHeight;
      this.camera.updateProjectionMatrix();
    };

    window.onresize = resize;
    resize();

    // set up scene (light, ground, grid, sky, orbitControls)
    this.warpSpeed("light", "camera", "lookAtCenter", "grid", "ground",  "orbitControls", "fog", "sky");  

    // enable physics debug
    this.physics.debug?.enable();

    // position camera
    this.camera.position.set(10, 10, 20);

    // blue box
    this.box = this.add.box({ y: 2, z: 10 }, { lambert: { color: "deepskyblue" } });

    // pink box
    this.physics.add.box({ y: 5, z:5 }, { lambert: { color: "hotpink" } });

    // green sphere
    const geometry = new THREE.SphereGeometry(0.8, 16, 16);
    const spherematerial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, spherematerial);
    cube.position.set(0.2, 3, 0);
    this.scene.add(cube);
    // add physics to an existing object
    //@ts-ignore
    this.physics.add.existing(cube);

    // Load the robot
    loadURDF(this);
    
  }
  

  update() {
    this.box.rotation.x += 0.01;
    this.box.rotation.y += 0.01;
  }
}

PhysicsLoader(
  "lib/ammo/kripken",
  () => new Project({ scenes: [MainScene], antialias: true })
);

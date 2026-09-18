import * as THREE from
  "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/* =========================================================
   CANVAS
========================================================= */

const canvas =
  document.getElementById("orbitCanvas");


/* =========================================================
   SCENE
========================================================= */

const scene =
  new THREE.Scene();


/* =========================================================
   CAMERA
========================================================= */

const camera =
  new THREE.PerspectiveCamera(
    45,
    window.innerWidth /
      window.innerHeight,
    0.1,
    500
  );


const cameraAngle =
  THREE.MathUtils.degToRad(45);


const cameraDistance = 24;

let cameraRotation = 0;


camera.position.set(
  0,
  Math.sin(cameraAngle) *
    cameraDistance,
  Math.cos(cameraAngle) *
    cameraDistance
);


camera.lookAt(
  0,
  0,
  0
);


/* =========================================================
   RENDERER
========================================================= */

const renderer =
  new THREE.WebGLRenderer({

    canvas,

    antialias: true,

    alpha: true

  });


renderer.setSize(
  window.innerWidth,
  window.innerHeight
);


renderer.setPixelRatio(
  Math.min(
    window.devicePixelRatio,
    2
  )
);


/* =========================================================
   LIGHTING
========================================================= */

const ambientLight =
  new THREE.AmbientLight(
    0xffffff,
    0.12
  );


scene.add(
  ambientLight
);


const sunLight =
  new THREE.PointLight(
    0xffffff,
    180,
    150,
    2
  );


sunLight.position.set(
  0,
  0,
  0
);


scene.add(
  sunLight
);


/* =========================================================
   TEXTURES
========================================================= */

const textureLoader =
  new THREE.TextureLoader();


const texturePath =
  "Textures/";


function loadTexture(
  filename
) {

  return textureLoader.load(
    texturePath + filename
  );

}


/* =========================================================
   SPACE BACKGROUND
========================================================= */

scene.background =
  loadTexture(
    "space.webp"
  );


/* =========================================================
   SUN
========================================================= */

const sunTexture =
  loadTexture(
    "sun.webp"
  );


const sunGeometry =
  new THREE.SphereGeometry(
    0.65,
    48,
    48
  );


const sunMaterial =
  new THREE.MeshBasicMaterial({

    map: sunTexture

  });


const sun =
  new THREE.Mesh(
    sunGeometry,
    sunMaterial
  );


scene.add(
  sun
);


/* =========================================================
   SUN GLOW
========================================================= */

const glowCanvas =
  document.createElement(
    "canvas"
  );


glowCanvas.width = 128;
glowCanvas.height = 128;


const glowContext =
  glowCanvas.getContext(
    "2d"
  );


const gradient =
  glowContext.createRadialGradient(
    64,
    64,
    0,
    64,
    64,
    64
  );


gradient.addColorStop(
  0,
  "rgba(255,235,170,0.8)"
);


gradient.addColorStop(
  0.3,
  "rgba(255,195,80,0.35)"
);


gradient.addColorStop(
  1,
  "rgba(255,140,0,0)"
);


glowContext.fillStyle =
  gradient;


glowContext.fillRect(
  0,
  0,
  128,
  128
);


const glowTexture =
  new THREE.CanvasTexture(
    glowCanvas
  );


const glowMaterial =
  new THREE.SpriteMaterial({

    map: glowTexture,

    transparent: true,

    depthWrite: false

  });


const sunGlow =
  new THREE.Sprite(
    glowMaterial
  );


sunGlow.scale.set(
  3,
  3,
  1
);


scene.add(
  sunGlow
);


/* =========================================================
   PLANET DATA
========================================================= */

const planetData = {

  Mercury: {

    a: 0.387,
    e: 0.206,
    period: 0.241,
    inclination: 7,
    radius: 0.075,
    texture: "mercury.webp",

    description:
      "Mercury is the smallest planet and the closest planet to the Sun.",

    position:
      "1st planet",

    orbit:
      "88 days"

  },


  Venus: {

    a: 0.723,
    e: 0.007,
    period: 0.615,
    inclination: 3.4,
    radius: 0.11,
    texture: "venus.webp",

    description:
      "Venus is a hot, cloud-covered world with a dense atmosphere.",

    position:
      "2nd planet",

    orbit:
      "225 days"

  },


  Earth: {

    a: 1,
    e: 0.017,
    period: 1,
    inclination: 0,
    radius: 0.13,
    texture: "earth.webp",

    description:
      "Earth is the third planet from the Sun and the world we call home.",

    position:
      "3rd planet",

    orbit:
      "365 days"

  },


  Mars: {

    a: 1.524,
    e: 0.093,
    period: 1.881,
    inclination: 1.85,
    radius: 0.10,
    texture: "mars.webp",

    description:
      "Mars is a cold terrestrial planet known for its iron-rich surface.",

    position:
      "4th planet",

    orbit:
      "687 days"

  },


  Jupiter: {

    a: 5.203,
    e: 0.049,
    period: 11.86,
    inclination: 1.3,
    radius: 0.28,
    texture: "jupiter.webp",

    description:
      "Jupiter is the largest planet in the Solar System.",

    position:
      "5th planet",

    orbit:
      "11.86 years"

  },


  Saturn: {

    a: 9.537,
    e: 0.056,
    period: 29.45,
    inclination: 2.49,
    radius: 0.24,
    texture: "saturn.webp",

    description:
      "Saturn is a gas giant surrounded by its famous ring system.",

    position:
      "6th planet",

    orbit:
      "29.45 years"

  },


  Uranus: {

    a: 19.19,
    e: 0.047,
    period: 84,
    inclination: 0.77,
    radius: 0.19,
    texture: "uranus.webp",

    description:
      "Uranus is an ice giant with an extreme axial tilt.",

    position:
      "7th planet",

    orbit:
      "84 years"

  },


  Neptune: {

    a: 30.07,
    e: 0.009,
    period: 164.8,
    inclination: 1.77,
    radius: 0.18,
    texture: "neptune.webp",

    description:
      "Neptune is the outermost major planet and an ice giant.",

    position:
      "8th planet",

    orbit:
      "164.8 years"

  }

};


/* =========================================================
   VISUAL ORBIT SCALE
========================================================= */

function visualDistance(
  distance
) {

  /*
     Smooth visual compression.

     This avoids:
     - Mercury overlapping the Sun
     - huge Neptune distances
     - discontinuous orbit jumps
  */

  const base =
    0.8;

  const scale =
    2.7;

  const exponent =
    0.6;


  return (
    base +
    scale *
      Math.pow(
        distance,
        exponent
      )
  );

}


/* =========================================================
   ORBIT POSITION
========================================================= */

function getOrbitPosition(
  data,
  angle
) {

  const r =
    data.a *
    (
      1 -
      data.e *
      data.e
    ) /
    (
      1 +
      data.e *
      Math.cos(angle)
    );


  const visualR =
    visualDistance(
      r
    );


  return new THREE.Vector3(

    visualR *
      Math.cos(angle),

    0,

    visualR *
      Math.sin(angle)

  );

}


/* =========================================================
   CREATE PLANETS
========================================================= */

const planets = {};


Object.entries(
  planetData
).forEach(
  ([name, data]) => {


    /* -----------------------------------------------------
       PLANET
    ----------------------------------------------------- */

    const geometry =
      new THREE.SphereGeometry(
        data.radius,
        32,
        32
      );


    const texture =
      loadTexture(
        data.texture
      );


    const material =
      new THREE.MeshStandardMaterial({

        map: texture,

        roughness: 0.9,

        metalness: 0

      });


    const planet =
      new THREE.Mesh(
        geometry,
        material
      );


    planet.userData.name =
      name;


    planet.userData.data =
      data;


    /* -----------------------------------------------------
       ORBIT GROUP
    ----------------------------------------------------- */

    const orbitGroup =
      new THREE.Group();


    orbitGroup.rotation.z =
      THREE.MathUtils.degToRad(
        data.inclination
      );


    orbitGroup.add(
      planet
    );


    scene.add(
      orbitGroup
    );


    /* -----------------------------------------------------
       ORBIT LINE
    ----------------------------------------------------- */

    const points = [];

    const segments = 256;


    for (
      let i = 0;
      i <= segments;
      i++
    ) {

      const angle =
        (
          i /
          segments
        ) *
        Math.PI *
        2;


      points.push(
        getOrbitPosition(
          data,
          angle
        )
      );

    }


    const orbitGeometry =
      new THREE.BufferGeometry()
        .setFromPoints(
          points
        );


    const orbitMaterial =
      new THREE.LineBasicMaterial({

        color: 0x31545b,

        transparent: true,

        opacity: 0.24

      });


    const orbit =
      new THREE.Line(
        orbitGeometry,
        orbitMaterial
      );


    orbitGroup.add(
      orbit
    );


    /* -----------------------------------------------------
       STORE
    ----------------------------------------------------- */

    planets[name] = {

      mesh: planet,

      group: orbitGroup,

      orbit: orbit,

      data: data

    };


    /* -----------------------------------------------------
       EARTH CLOUDS
    ----------------------------------------------------- */

    if (
      name === "Earth"
    ) {

      const cloudTexture =
        loadTexture(
          "earth_clouds.webp"
        );


      const cloudMaterial =
        new THREE.MeshStandardMaterial({

          map: cloudTexture,

          transparent: true,

          opacity: 0.7,

          roughness: 0.9,

          metalness: 0

        });


      const clouds =
        new THREE.Mesh(

          new THREE.SphereGeometry(
            data.radius * 1.025,
            32,
            32
          ),

          cloudMaterial

        );


      planet.add(
        clouds
      );


      planets[name].clouds =
        clouds;

    }


    /* -----------------------------------------------------
       SATURN RINGS
    ----------------------------------------------------- */

    if (
      name === "Saturn"
    ) {

      const ringTexture =
        loadTexture(
          "saturn_rings.webp"
        );


      const ringMaterial =
        new THREE.MeshStandardMaterial({

          map: ringTexture,

          transparent: true,

          side: THREE.DoubleSide,

          depthWrite: false,

          roughness: 0.9,

          metalness: 0

        });


      const ringGeometry =
        new THREE.RingGeometry(

          data.radius * 1.45,

          data.radius * 2.5,

          64

        );


      const rings =
        new THREE.Mesh(
          ringGeometry,
          ringMaterial
        );


      rings.rotation.x =
        Math.PI / 2;


      planet.add(
        rings
      );

    }

  }
);


/* =========================================================
   TIME CONTROL
========================================================= */

let simulationTime =
  0;


let timeSpeed =
  0.18;


const timeButtons =
  document.querySelectorAll(
    ".time-button"
  );


timeButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        const speed =
          Number(
            button.dataset.speed
          );


        if (
          Number.isFinite(
            speed
          )
        ) {

          timeSpeed =
            speed;

        }


        timeButtons.forEach(
          otherButton => {

            otherButton.classList
              .remove(
                "active"
              );

          }
        );


        button.classList
          .add(
            "active"
          );

      }
    );

  }
);


/* =========================================================
   KEPLER SOLVER
========================================================= */

function solveKepler(
  meanAnomaly,
  eccentricity
) {

  let eccentricAnomaly =
    meanAnomaly;


  for (
    let i = 0;
    i < 8;
    i++
  ) {

    const f =
      eccentricAnomaly -
      eccentricity *
        Math.sin(
          eccentricAnomaly
        ) -
      meanAnomaly;


    const df =
      1 -
      eccentricity *
        Math.cos(
          eccentricAnomaly
        );


    eccentricAnomaly -=
      f / df;

  }


  return eccentricAnomaly;

}


/* =========================================================
   UPDATE PLANETS
========================================================= */

function updatePlanets(
  delta
) {

  simulationTime +=
    delta *
    timeSpeed;


  Object.entries(
    planets
  ).forEach(
    ([name, planetObject]) => {

      const data =
        planetObject.data;


      const meanMotion =
        (
          Math.PI * 2
        ) /
        data.period;


      const meanAnomaly =
        meanMotion *
        simulationTime;


      const eccentricAnomaly =
        solveKepler(
          meanAnomaly,
          data.e
        );


      const position =
        getOrbitPosition(
          data,
          eccentricAnomaly
        );


      planetObject.mesh
        .position
        .copy(
          position
        );


      planetObject.mesh
        .rotation.y +=
          delta *
          timeSpeed *
          0.5;


      if (
        planetObject.clouds
      ) {

        planetObject.clouds
          .rotation.y +=
            delta *
            timeSpeed *
            0.65;

      }

    }
  );

}


/* =========================================================
   PLANET INFO
========================================================= */

let selectedPlanet =
  null;


const planetInfo =
  document.getElementById(
    "planetInfo"
  );


const planetInfoName =
  document.getElementById(
    "planetInfoName"
  );


const planetInfoDescription =
  document.getElementById(
    "planetInfoDescription"
  );


const planetInfoPosition =
  document.getElementById(
    "planetInfoPosition"
  );


const planetInfoOrbit =
  document.getElementById(
    "planetInfoOrbit"
  );


const planetInfoClose =
  document.getElementById(
    "planetInfoClose"
  );


/* =========================================================
   PLANET BUTTONS
========================================================= */

const planetButtons =
  document.querySelectorAll(
    ".planet-button"
  );


planetButtons.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        const name =
          button.dataset.planet;


        if (
          name === "Sun"
        ) {

          selectedPlanet =
            null;


          planetInfoName.textContent =
            "Sun";


          planetInfoDescription.textContent =
            "The Sun is the star at the center of the Solar System.";


          planetInfoPosition.textContent =
            "Center";


          planetInfoOrbit.textContent =
            "Solar System";


          planetInfo.classList
            .add(
              "visible"
            );


          return;

        }


        const selected =
          planets[name];


        if (!selected) {
          return;
        }


        selectedPlanet =
          selected;


        planetInfoName.textContent =
          name;


        planetInfoDescription.textContent =
          selected.data.description;


        planetInfoPosition.textContent =
          selected.data.position;


        planetInfoOrbit.textContent =
          selected.data.orbit;


        planetInfo.classList
          .add(
            "visible"
          );

      }
    );

  }
);


/* =========================================================
   CLOSE PLANET INFO
========================================================= */

planetInfoClose.addEventListener(
  "click",
  () => {

    selectedPlanet =
      null;


    planetInfo.classList
      .remove(
        "visible"
      );

  }
);


/* =========================================================
   ABOUT SCROLL REVEAL
========================================================= */

const aboutSection =
  document.getElementById(
    "about"
  );


let aboutRevealed =
  false;


/*
   Watch the About section.

   The animation starts once roughly 25%
   of the section enters the viewport.
*/

const aboutObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(
        entry => {

          if (
            entry.isIntersecting &&
            !aboutRevealed
          ) {

            aboutRevealed =
              true;


            aboutSection.classList
              .add(
                "about-visible"
              );

          }

        }
      );

    },
    {
      threshold: 0.25
    }
  );


aboutObserver.observe(
  aboutSection
);


/* =========================================================
   ABOUT NAVIGATION
========================================================= */

const aboutLink =
  document.querySelector(
    'a[href="#about"]'
  );


if (aboutLink) {

  aboutLink.addEventListener(
    "click",
    () => {

      /*
         Smooth scrolling takes a little time,
         so allow it to begin before triggering
         the reveal.
      */

      setTimeout(
        () => {

          if (
            !aboutRevealed
          ) {

            aboutRevealed =
              true;


            aboutSection.classList
              .add(
                "about-visible"
              );

          }

        },
        300
      );

    }
  );

}


/* =========================================================
   CAMERA
========================================================= */

function updateCamera(
  delta
) {

  /* -------------------------------------------------------
     SELECTED PLANET
  ------------------------------------------------------- */

  if (
    selectedPlanet
  ) {

    const target =
      new THREE.Vector3();


    selectedPlanet.mesh
      .getWorldPosition(
        target
      );


    const desiredPosition =
      target.clone().add(
        new THREE.Vector3(
          1.8,
          1.3,
          2.5
        )
      );


    camera.position.lerp(
      desiredPosition,
      Math.min(
        delta * 2.5,
        1
      )
    );


    camera.lookAt(
      target
    );


    return;

  }


  /* -------------------------------------------------------
     NORMAL VIEW
  ------------------------------------------------------- */

  cameraRotation +=
    delta *
    0.035;


  camera.position.x =
    Math.sin(
      cameraRotation
    ) *
    Math.cos(
      cameraAngle
    ) *
    cameraDistance;


  camera.position.z =
    Math.cos(
      cameraRotation
    ) *
    Math.cos(
      cameraAngle
    ) *
    cameraDistance;


  camera.position.y =
    Math.sin(
      cameraAngle
    ) *
    cameraDistance;


  camera.lookAt(
    0,
    0,
    0
  );

}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;


    camera.updateProjectionMatrix();


    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );


    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );

  }
);


/* =========================================================
   ANIMATION LOOP
========================================================= */

const clock =
  new THREE.Clock();


function animate() {

  requestAnimationFrame(
    animate
  );


  const delta =
    Math.min(
      clock.getDelta(),
      0.05
    );


  updatePlanets(
    delta
  );


  updateCamera(
    delta
  );


  sun.rotation.y +=
    delta *
    timeSpeed *
    0.08;


  renderer.render(
    scene,
    camera
  );

}


animate();
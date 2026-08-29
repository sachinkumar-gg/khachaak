/* =========================================================
   GridDistortion Module (Powered by Three.js & WebGL)
   Ported from React Bits GridDistortion
   ========================================================= */

(function (global) {

  const vertexShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

  const fragmentShader = `
  uniform sampler2D uDataTexture;
  uniform sampler2D uTexture;
  uniform vec4 resolution;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Cover aspect ratio adjustment
    if (resolution.z > 0.0 && resolution.w > 0.0) {
      float containerAspect = resolution.x / resolution.y;
      float imageAspect = resolution.z / resolution.w;
      if (containerAspect > imageAspect) {
        uv.y = (uv.y - 0.5) * (imageAspect / containerAspect) + 0.5;
      } else {
        uv.x = (uv.x - 0.5) * (containerAspect / imageAspect) + 0.5;
      }
    }

    vec4 offset = texture2D(uDataTexture, vUv);
    vec4 color = texture2D(uTexture, uv - 0.02 * offset.rg);
    // Darken image slightly (0.65) so hero copy and elements are high-contrast and easy to read
    gl_FragColor = vec4(color.rgb * 0.65, color.a);
  }`;

  function createPlaceholderTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#151515';
    ctx.fillRect(0, 0, 2, 2);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  function initGridDistortion(container, options = {}) {
    if (!container || typeof THREE === 'undefined') return null;

    const {
      grid = 10,
      mouse = 0.1,
      strength = 0.15,
      relaxation = 0.9,
      imageSrc = 'assets/street/1.webp'
    } = options;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050505, 1);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.objectFit = 'cover';

    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
    camera.position.z = 2;

    const dummyTexture = createPlaceholderTexture();

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4(1, 1, 1920, 1080) },
      uTexture: { value: dummyTexture },
      uDataTexture: { value: null }
    };

    let imgWidth = 1920;
    let imgHeight = 1080;

    const size = grid;
    const data = new Float32Array(4 * size * size);
    data.fill(0);

    const dataTexture = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    dataTexture.needsUpdate = true;
    uniforms.uDataTexture.value = dataTexture;

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageSrc, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.MirroredRepeatWrapping;
      texture.wrapT = THREE.MirroredRepeatWrapping;
      uniforms.uTexture.value = texture;
      material.needsUpdate = true;
      if (texture.image) {
        imgWidth = texture.image.width || 1920;
        imgHeight = texture.image.height || 1080;
      }
      handleResize();
    });

    function handleResize() {
      if (!container || !renderer || !camera) return;

      const rect = container.getBoundingClientRect();
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;

      if (width === 0 || height === 0) return;

      const containerAspect = width / height;

      renderer.setSize(width, height);

      if (plane) {
        plane.scale.set(containerAspect, 1, 1);
      }

      const frustumHeight = 1;
      const frustumWidth = frustumHeight * containerAspect;
      camera.left = -frustumWidth / 2;
      camera.right = frustumWidth / 2;
      camera.top = frustumHeight / 2;
      camera.bottom = -frustumHeight / 2;
      camera.updateProjectionMatrix();

      uniforms.resolution.value.set(width, height, imgWidth, imgHeight);
    }

    const mouseState = {
      x: 0.5,
      y: 0.5,
      prevX: 0.5,
      prevY: 0.5,
      vX: 0,
      vY: 0
    };

    function handleMouseMove(e) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      mouseState.vX = x - mouseState.prevX;
      mouseState.vY = y - mouseState.prevY;
      Object.assign(mouseState, { x, y, prevX: x, prevY: y });
    }

    function handleMouseLeave() {
      if (dataTexture) {
        dataTexture.needsUpdate = true;
      }
      Object.assign(mouseState, {
        vX: 0,
        vY: 0
      });
    }

    const eventTarget = container.closest('section') || container;
    eventTarget.addEventListener('mousemove', handleMouseMove);
    eventTarget.addEventListener('mouseleave', handleMouseLeave);

    window.addEventListener('resize', handleResize);
    handleResize();

    let animId = null;

    function animate() {
      animId = requestAnimationFrame(animate);

      uniforms.time.value += 0.05;

      const dData = dataTexture.image.data;
      for (let i = 0; i < size * size; i++) {
        dData[i * 4] *= relaxation;
        dData[i * 4 + 1] *= relaxation;
      }

      const gridMouseX = size * mouseState.x;
      const gridMouseY = size * mouseState.y;
      const maxDist = size * mouse;

      if (Math.abs(mouseState.vX) > 0.0001 || Math.abs(mouseState.vY) > 0.0001) {
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            const distSq =
              Math.pow(gridMouseX - i, 2) + Math.pow(gridMouseY - j, 2);
            if (distSq < maxDist * maxDist) {
              const index = 4 * (i + size * j);
              const power = Math.min(maxDist / (Math.sqrt(distSq) + 0.001), 10);
              dData[index] += strength * 100 * mouseState.vX * power;
              dData[index + 1] -= strength * 100 * mouseState.vY * power;
            }
          }
        }
      }

      mouseState.vX *= 0.85;
      mouseState.vY *= 0.85;

      dataTexture.needsUpdate = true;
      renderer.render(scene, camera);
    }

    animate();

    return {
      destroy: () => {
        if (animId) cancelAnimationFrame(animId);
        eventTarget.removeEventListener('mousemove', handleMouseMove);
        eventTarget.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('resize', handleResize);
        if (renderer) {
          renderer.dispose();
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        }
      },
      updateImage: (newSrc) => {
        textureLoader.load(newSrc, (texture) => {
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.wrapS = THREE.MirroredRepeatWrapping;
          texture.wrapT = THREE.MirroredRepeatWrapping;
          uniforms.uTexture.value = texture;
          material.needsUpdate = true;
          if (texture.image) {
            imgWidth = texture.image.width || 1920;
            imgHeight = texture.image.height || 1080;
          }
          handleResize();
        });
      }
    };
  }

  global.GridDistortion = { init: initGridDistortion };
})(window);

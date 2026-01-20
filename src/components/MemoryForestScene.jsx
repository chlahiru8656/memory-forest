import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
// Import OrbitControls from the local three.js package
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const MemoryForestScene = ({ memories = [], onLeafClick }) => {
  const mountRef = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Prevent double rendering
    if (isInitialized.current || !mountRef.current) return;

    // --- 1. SETUP ---
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a');
    scene.fog = new THREE.FogExp2(0x0f172a, 0.02);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(8, 5, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;

    // --- 2. LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 10, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const spotLight = new THREE.SpotLight(0x4ade80, 1);
    spotLight.position.set(-10, 10, 5);
    scene.add(spotLight);

    // --- 3. GROUND ---
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: 0x0f172a, 
      transparent: true, 
      opacity: 0.8,
      roughness: 1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(100, 100, 0x1e293b, 0x0f172a);
    grid.position.y = -2.99;
    scene.add(grid);

    // --- 4. TREE GENERATION ---
    const treeGroup = new THREE.Group();
    treeGroup.position.y = -3;
    scene.add(treeGroup);

    // Materials
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
    const branchMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    const happyMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, emissive: 0x4ade80, emissiveIntensity: 0.2 });
    const sadMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x60a5fa, emissiveIntensity: 0.2 });
    const specialMat = new THREE.MeshStandardMaterial({ color: 0xa3e635, emissive: 0xa3e635, emissiveIntensity: 0.2 });

    // Base of Trunk
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 2, 16), trunkMat);
    treeGroup.add(base);

    // Logic to Grow Tree based on Years
    const memoriesByYear = {};
    memories.forEach(mem => {
      const year = mem.date ? mem.date.split('-')[0] : 'Unknown';
      if (!memoriesByYear[year]) memoriesByYear[year] = [];
      memoriesByYear[year].push(mem);
    });

    const years = Object.keys(memoriesByYear).sort();
    const clickables = [];

    years.forEach((year, i) => {
      // Trunk Segment
      const yPos = 2 + (i * 2);
      const segment = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5 - (i * 0.05), 0.6 - (i * 0.05), 2.1, 16), 
        trunkMat
      );
      segment.position.y = yPos;
      treeGroup.add(segment);

      // Branch Container
      const branchGroup = new THREE.Group();
      branchGroup.position.y = yPos - 0.5; 
      branchGroup.rotation.y = (i * Math.PI) / 1.5;
      branchGroup.rotation.z = 0.3;
      treeGroup.add(branchGroup);

      // Branch Mesh
      const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 3, 8), branchMat);
      branch.position.y = 1.5;
      branchGroup.add(branch);

      // Year Label (Canvas Sprite)
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.roundRect(0, 0, 256, 128, 20);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.font = 'bold 60px sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(year, 128, 64);
        
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas) }));
        sprite.position.y = 3.5;
        sprite.scale.set(1.5, 0.75, 1);
        branchGroup.add(sprite);
      }

      // Leaves
      memoriesByYear[year].forEach((mem, idx) => {
         let leafMat = specialMat;
         if (mem.type === 'happy') leafMat = happyMat;
         if (mem.type === 'sad') leafMat = sadMat;

         const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), leafMat.clone());
         
         const xOffset = (Math.random() - 0.5) * 0.5;
         const yOffset = 0.5 + (idx * 0.4);
         const zOffset = (Math.random() - 0.5) * 0.5;
         
         leaf.position.set(xOffset, yOffset, zOffset);
         leaf.userData = { memory: mem, isLeaf: true };
         branchGroup.add(leaf);
         clickables.push(leaf);
         
         const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 0.4), new THREE.MeshStandardMaterial({color: 0x3f2e05}));
         stem.position.y = -0.2;
         leaf.add(stem);
      });
    });

    // --- 5. INTERACTION ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickables);

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            if (hit.userData.isLeaf) {
                onLeafClick(hit.userData.memory);
            }
        }
    };

    const onMouseMove = (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickables);
        
        // Reset scale
        clickables.forEach(leaf => leaf.scale.set(1, 1, 1));
        document.body.style.cursor = 'default';

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            if (hit.userData.isLeaf) {
                document.body.style.cursor = 'pointer';
                hit.scale.set(1.5, 1.5, 1.5);
            }
        }
    };

    renderer.domElement.addEventListener('click', onMouseClick);
    renderer.domElement.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animationId;
    const animate = () => {
        animationId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };
    animate();

    isInitialized.current = true;

    // CLEANUP
    return () => {
        cancelAnimationFrame(animationId);
        if (renderer.domElement) {
             renderer.domElement.removeEventListener('click', onMouseClick);
             renderer.domElement.removeEventListener('mousemove', onMouseMove);
             if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
        isInitialized.current = false;
    };
  }, [memories]); 

  // Important: This div needs a minimum height to be visible
  return <div ref={mountRef} className="w-full h-full min-h-[500px]" />;
};

export default MemoryForestScene;
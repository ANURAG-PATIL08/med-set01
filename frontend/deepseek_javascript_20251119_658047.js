import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HealthAnimation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create DNA-like helix
    const helixGeometry = new THREE.BufferGeometry();
    const points = [];
    const radius = 2;
    const heightTotal = 10;
    const segments = 100;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 4;

      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = heightTotal * (t - 0.5);

      points.push(new THREE.Vector3(x, y, z));
    }

    helixGeometry.setFromPoints(points);

    const material = new THREE.LineBasicMaterial({ color: 0x4a6fa5 });
    const helix = new THREE.Line(helixGeometry, material);
    scene.add(helix);

    // Add spheres for DNA-like effect
    const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b6b });

    for (let i = 0; i <= segments; i += 2) {
      const t = i / segments;
      const angle = t * Math.PI * 4;

      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = heightTotal * (t - 0.5);

      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(x, y, z);
      scene.add(sphere);
    }

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      helix.rotation.y += 0.01;
      helix.rotation.x += 0.005;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="health-animation" />;
};

export default HealthAnimation;
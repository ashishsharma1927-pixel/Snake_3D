import React, { Suspense, useRef, useEffect, useState } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Snake } from './Snake';
import { Planet } from './Planet';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

function SpaceBackground() {
  const bgTexture = useTexture(`${import.meta.env.BASE_URL}space_bg.jpg`);
  bgTexture.mapping = THREE.EquirectangularReflectionMapping;
  bgTexture.colorSpace = THREE.SRGBColorSpace;
  return <primitive attach="background" object={bgTexture} />;
}

function CityBackground() {
  const bgTexture = useTexture(`${import.meta.env.BASE_URL}city_skybox.jpg`);
  bgTexture.mapping = THREE.EquirectangularReflectionMapping;
  bgTexture.colorSpace = THREE.SRGBColorSpace;
  return <primitive attach="background" object={bgTexture} />;
}

function WaterBackground() {
  const bgTexture = useTexture(`${import.meta.env.BASE_URL}water_skybox.jpg`);
  bgTexture.mapping = THREE.EquirectangularReflectionMapping;
  bgTexture.colorSpace = THREE.SRGBColorSpace;
  return <primitive attach="background" object={bgTexture} />;
}

interface GameSceneProps {
  setScore: React.Dispatch<React.SetStateAction<number>>;
  score: number;
  mapType: 'galaxy' | 'city' | 'water';
}

interface PlanetData {
  id: string;
  position: THREE.Vector3;
  scale: number;
  color: number;
  type: number;
  points: number;
}

export function GameScene({ setScore, score, mapType = 'galaxy' }: GameSceneProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const currentLookAt = useRef(new THREE.Vector3());

  // Refs passed to the procedural Snake
  const snakePos = useRef(new THREE.Vector3(0, 0, 0));
  const snakeEuler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  
  // Full 3D Flight Angles
  const snakeYaw = useRef(0);
  const snakePitch = useRef(0);
  
  const snakeScale = useRef(1.0);
  const [planets, setPlanets] = useState<PlanetData[]>([]);
  const planetsRef = useRef<PlanetData[]>([]); 

  const keys = useRef({ left: false, right: false, pitchUp: false, pitchDown: false, forward: false, backward: false });
  
  const spawnPlanet = (center: THREE.Vector3) => {
    const angleYaw = snakeYaw.current + (Math.random() - 0.5) * Math.PI;
    const anglePitch = snakePitch.current + (Math.random() - 0.5) * Math.PI / 2;
    const distance = 30 + Math.random() * 60; 
    
    const pos = new THREE.Vector3(
      Math.sin(angleYaw) * Math.cos(anglePitch),
      -Math.sin(anglePitch),
      Math.cos(angleYaw) * Math.cos(anglePitch)
    ).multiplyScalar(distance).add(center);
    
    const colors = [0xffffff, 0xffbbbb, 0xbbffbb, 0xbbbbff, 0xffffbb, 0xffbbff, 0xbbffff, 0xffddaa];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const sizeCategory = Math.random();
    let scale = 1.0;
    let points = 10;
    
    if (sizeCategory < 0.33) {
       scale = 0.4 + Math.random() * 0.3; // Small
       points = 50;
    } else if (sizeCategory < 0.66) {
       scale = 1.2 + Math.random() * 0.5; // Medium
       points = 20;
    } else {
       scale = 2.5 + Math.random() * 1.0; // Large
       points = 10;
    }
    
    // 0-3 = Planets/Asteroids
    // 4-6 = Crystals
    // 7-10 = Fishes
    let type = 0;
    if (mapType === 'city') {
       type = 4 + Math.floor(Math.random() * 3);
    } else if (mapType === 'water') {
       type = 7 + Math.floor(Math.random() * 4);
    } else {
       type = Math.floor(Math.random() * 4);
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      position: pos,
      scale,
      color,
      type,
      points
    };
  };

  useEffect(() => {
    const initial = [];
    for (let i=0; i<15; i++) initial.push(spawnPlanet(new THREE.Vector3()));
    setPlanets(initial);
    planetsRef.current = initial;
  }, [mapType]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') keys.current.right = true;
      if (e.key === 'ArrowUp') keys.current.pitchUp = true;
      if (e.key === 'ArrowDown') keys.current.pitchDown = true;
      if (e.key.toLowerCase() === 'w') keys.current.forward = true;
      if (e.key.toLowerCase() === 's') keys.current.backward = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key.toLowerCase() === 'd' || e.key === 'ArrowRight') keys.current.right = false;
      if (e.key === 'ArrowUp') keys.current.pitchUp = false;
      if (e.key === 'ArrowDown') keys.current.pitchDown = false;
      if (e.key.toLowerCase() === 'w') keys.current.forward = false;
      if (e.key.toLowerCase() === 's') keys.current.backward = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { 
      window.removeEventListener('keydown', down); 
      window.removeEventListener('keyup', up); 
    };
  }, []);

  useFrame((state, delta) => {
    // 3D Flight Controls
    if (keys.current.left) snakeYaw.current += 3.0 * delta;
    if (keys.current.right) snakeYaw.current -= 3.0 * delta;
    if (keys.current.pitchUp) snakePitch.current -= 2.5 * delta;
    if (keys.current.pitchDown) snakePitch.current += 2.5 * delta;

    snakePitch.current = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, snakePitch.current));

    const euler = new THREE.Euler(snakePitch.current, snakeYaw.current, 0, 'YXZ');
    const quat = new THREE.Quaternion().setFromEuler(euler);

    // Only move if holding W or S
    let currentSpeed = 0;
    if (keys.current.forward) currentSpeed = 25;
    if (keys.current.backward) currentSpeed = -15;

    const forwardVec = new THREE.Vector3(0, 0, 1).applyQuaternion(quat);
    snakePos.current.add(forwardVec.clone().multiplyScalar(currentSpeed * delta));

    // Slithering Wobble (only wobble if moving)
    const time = state.clock.elapsedTime;
    const wobbleAngle = currentSpeed !== 0 ? Math.sin(time * 15) * 0.15 : 0;
    
    // Update the Euler ref for the Snake component
    snakeEuler.current.set(snakePitch.current, snakeYaw.current + wobbleAngle, 0, 'YXZ');

    // Camera follow logic
    if (cameraRef.current) {
       // Position camera very high and far back to show the entire massive snake model
       const backOffset = new THREE.Vector3(0, 50, -40).applyQuaternion(quat);
       const idealPos = snakePos.current.clone().add(backOffset);
       
       const target = snakePos.current.clone().add(forwardVec.clone().multiplyScalar(5));
       
       if (currentLookAt.current.lengthSq() === 0) {
          currentLookAt.current.copy(target);
          cameraRef.current.position.copy(idealPos);
       }
       
       // Slower lerp creates a beautiful trailing effect where the snake turns first
       cameraRef.current.position.lerp(idealPos, 0.05);
       currentLookAt.current.lerp(target, 0.08);
       cameraRef.current.lookAt(currentLookAt.current);
    }

    let planetsChanged = false;
    const currentPlanets = [...planetsRef.current];
    
    for (let i = currentPlanets.length - 1; i >= 0; i--) {
       const p = currentPlanets[i];
       const dist = snakePos.current.distanceTo(p.position);
       
       if (dist < (3.0 * p.scale + snakeScale.current)) {
          setScore(s => s + p.points);
          snakeScale.current += 0.03; 
          currentPlanets.splice(i, 1);
          planetsChanged = true;
       } 
       else if (dist > 200) {
          currentPlanets.splice(i, 1);
          planetsChanged = true;
       }
    }
    
    while (currentPlanets.length < 15) {
       currentPlanets.push(spawnPlanet(snakePos.current));
       planetsChanged = true;
    }
    
    if (planetsChanged) {
       planetsRef.current = currentPlanets;
       setPlanets(currentPlanets);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 10, -15]} fov={75} />
      
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={2.5} color={0xffffff} />

      <Suspense fallback={null}>
        {mapType === 'galaxy' && <SpaceBackground />}
        {mapType === 'city' && <CityBackground />}
        {mapType === 'water' && <WaterBackground />}
        
        <Snake headPosRef={snakePos} headEulerRef={snakeEuler} length={score} />
        
        {planets.map(p => (
           <Planet key={p.id} position={p.position} scale={p.scale} color={p.color} type={p.type} />
        ))}
      </Suspense>
    </>
  );
}

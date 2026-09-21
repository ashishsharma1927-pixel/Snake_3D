import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface PlanetProps {
  position: THREE.Vector3;
  scale?: number;
  color?: string | number;
  type?: number;
}

export const Planet: React.FC<PlanetProps> = ({ position, scale = 1, color = 0xffffff, type = 0 }) => {
  const earthTexture = useTexture(`${import.meta.env.BASE_URL}planet_texture.jpg`);
  const marsTexture = useTexture(`${import.meta.env.BASE_URL}mars_texture.jpg`);
  const gasTexture = useTexture(`${import.meta.env.BASE_URL}gas_giant_texture.jpg`);
  const asteroidTexture = useTexture(`${import.meta.env.BASE_URL}asteroid_texture.jpg`);
  
  const crystalPurple = useTexture(`${import.meta.env.BASE_URL}crystal_texture.jpg`);
  const crystalGreen = useTexture(`${import.meta.env.BASE_URL}crystal_green.jpg`);
  const crystalBlue = useTexture(`${import.meta.env.BASE_URL}crystal_blue.jpg`);
  
  const fishTexture = useTexture(`${import.meta.env.BASE_URL}fish_scales.jpg`);

  const planetTextures = [earthTexture, marsTexture, gasTexture, asteroidTexture];
  const crystalTextures = [crystalPurple, crystalGreen, crystalBlue];

  const isAsteroid = type === 3;
  const isCrystal = type >= 4 && type <= 6;
  const isFish = type >= 7;

  let activeTexture = earthTexture;
  if (isFish) activeTexture = fishTexture;
  else if (isCrystal) activeTexture = crystalTextures[type - 4];
  else activeTexture = planetTextures[type];
  
  const innerRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    if (isAsteroid) return new THREE.DodecahedronGeometry(1, 1);
    
    // Crystals
    if (type === 4) return new THREE.OctahedronGeometry(1.2, 0); 
    if (type === 5) return new THREE.BoxGeometry(1.5, 1.5, 1.5); 
    if (type === 6) return new THREE.IcosahedronGeometry(1.2, 0); 
    
    // Planets
    return new THREE.SphereGeometry(1, 32, 32); 
  }, [type, isAsteroid]);

  useFrame((state) => {
    if (innerRef.current) {
      if (isFish) {
        // Swimming animation
        innerRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 4 + position.x) * 0.3;
        innerRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + position.z) * 0.5;
        // Make fish point forward/flat
        innerRef.current.rotation.z = 0; 
      } else {
        innerRef.current.rotation.y += (isAsteroid || isCrystal ? 0.01 : 0.005);
        if (isAsteroid || isCrystal) innerRef.current.rotation.x += 0.01;
        if (isCrystal) innerRef.current.rotation.z += 0.005;
        innerRef.current.position.y = Math.sin(state.clock.elapsedTime * 2 + position.x) * 0.2;
      }
    }
  });

  if (isFish) {
    return (
      <group position={position} scale={[scale, scale, scale]}>
        <group ref={innerRef}>
          {/* Fish Body (Stretched Sphere) */}
          <mesh scale={[1.6, 0.9, 0.4]}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshStandardMaterial map={fishTexture} color={color} roughness={0.2} />
          </mesh>
          {/* Fish Tail (Flat Cone) */}
          <mesh position={[-1.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[0.8, 1, 0.1]}>
            <coneGeometry args={[1, 1.5, 3]} />
            <meshStandardMaterial map={fishTexture} color={color} roughness={0.2} />
          </mesh>
          {/* Top Fin */}
          <mesh position={[-0.2, 0.8, 0]} rotation={[0, 0, -Math.PI / 4]} scale={[0.5, 1, 0.1]}>
            <coneGeometry args={[1, 1, 3]} />
            <meshStandardMaterial map={fishTexture} color={color} roughness={0.2} />
          </mesh>
          {/* Bottom Fin */}
          <mesh position={[-0.2, -0.8, 0]} rotation={[0, 0, Math.PI / 4]} scale={[0.4, 0.8, 0.1]}>
            <coneGeometry args={[1, 1, 3]} />
            <meshStandardMaterial map={fishTexture} color={color} roughness={0.2} />
          </mesh>
          {/* Side Fins */}
          <mesh position={[0.5, -0.2, 0.4]} rotation={[Math.PI / 2, 0, -Math.PI / 4]} scale={[0.3, 0.8, 0.1]}>
            <coneGeometry args={[1, 1, 3]} />
            <meshStandardMaterial map={fishTexture} color={color} roughness={0.2} />
          </mesh>
          <mesh position={[0.5, -0.2, -0.4]} rotation={[-Math.PI / 2, 0, -Math.PI / 4]} scale={[0.3, 0.8, 0.1]}>
            <coneGeometry args={[1, 1, 3]} />
            <meshStandardMaterial map={fishTexture} color={color} roughness={0.2} />
          </mesh>
          {/* Right Eye */}
          <mesh position={[1.0, 0.2, 0.35]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={0x000000} roughness={0.1} metalness={0.8} />
          </mesh>
          {/* Left Eye */}
          <mesh position={[1.0, 0.2, -0.35]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={0x000000} roughness={0.1} metalness={0.8} />
          </mesh>
        </group>
        <pointLight color={color} intensity={3} distance={15 * scale} />
      </group>
    );
  }

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh ref={innerRef} geometry={geometry}>
        <meshStandardMaterial 
          map={activeTexture} 
          bumpMap={isAsteroid ? activeTexture : undefined} 
          bumpScale={isAsteroid ? 0.2 : 0.05} 
          roughness={isAsteroid ? 0.9 : (isCrystal ? 0.1 : 0.7)} 
          metalness={isCrystal ? 0.8 : 0}
          color={isAsteroid ? 0xbbbbbb : 0xffffff} 
          emissive={isCrystal ? color : 0x000000}
          emissiveIntensity={isCrystal ? 0.8 : 0}
        />
      </mesh>
      <pointLight color={color} intensity={isAsteroid ? 0.2 : (isCrystal ? 5 : 3)} distance={15 * scale} />
    </group>
  );
};

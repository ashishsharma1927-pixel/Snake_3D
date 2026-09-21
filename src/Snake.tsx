import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface SnakeProps {
  headPosRef: React.MutableRefObject<THREE.Vector3>;
  headEulerRef: React.MutableRefObject<THREE.Euler>;
  length: number; // Based on score
}

export const Snake = ({ headPosRef, headEulerRef, length = 0 }: SnakeProps) => {
  // Use the realistic snake texture uploaded by the user
  const texture = useTexture(`${import.meta.env.BASE_URL}snake_scales.jpg`);
  
  // Breadcrumb trail config
  const maxHistory = 400;
  const history = useRef<THREE.Vector3[]>([]);
  
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  // We start with 15 segments and add more as the score increases
  const numSegments = Math.min(100, Math.floor(length / 2) + 15);
  
  useFrame(() => {
    const currentPos = headPosRef.current.clone();
    
    // Only record history if the snake actually moved a bit (prevents body bunching up when stationary)
    const lastPos = history.current[0];
    if (!lastPos || lastPos.distanceTo(currentPos) > 0.2) {
       history.current.unshift(currentPos);
       if (history.current.length > maxHistory) {
         history.current.pop();
       }
    }

    // Update the Head's position and rotation
    if (headRef.current) {
       headRef.current.position.copy(headPosRef.current);
       headRef.current.setRotationFromEuler(headEulerRef.current);
    }
    
    // Update all body segments along the breadcrumb trail
    if (bodyRef.current) {
       const segments = bodyRef.current.children;
       const spacing = 3; // Number of history ticks between each segment
       
       for (let i = 0; i < segments.length; i++) {
          const historyIndex = (i + 1) * spacing;
          const pos = history.current[historyIndex];
          
          if (pos) {
             segments[i].position.copy(pos);
             segments[i].visible = true;
          } else {
             segments[i].visible = false; // Hide segments if history isn't long enough yet
          }
       }
    }
  });

  return (
    <group>
       {/* SNAKE HEAD */}
       <group ref={headRef}>
          {/* Elongated Capsule for the Head */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
             <capsuleGeometry args={[1.2, 1.5, 16, 16]} />
             <meshStandardMaterial map={texture} roughness={0.4} />
          </mesh>
          
          {/* Left Eye */}
          <mesh position={[0.6, 0.8, 1.5]}>
             <sphereGeometry args={[0.3, 16, 16]} />
             <meshStandardMaterial color="black" roughness={0.1} />
          </mesh>
          
          {/* Right Eye */}
          <mesh position={[-0.6, 0.8, 1.5]}>
             <sphereGeometry args={[0.3, 16, 16]} />
             <meshStandardMaterial color="black" roughness={0.1} />
          </mesh>
       </group>
       
       {/* SNAKE BODY */}
       <group ref={bodyRef}>
          {Array.from({ length: numSegments }).map((_, i) => {
             // Math taper: scales from 1.0 at the neck down to 0.2 at the very tip of the tail
             const progress = i / numSegments;
             const scale = 1.0 - (progress * 0.8);
             
             return (
               <mesh key={i} scale={[scale, scale, scale]}>
                 <sphereGeometry args={[1.1, 16, 16]} />
                 <meshStandardMaterial map={texture} roughness={0.5} />
               </mesh>
             );
          })}
       </group>
    </group>
  );
}

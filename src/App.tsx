import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { GameScene } from './GameScene';
import './index.css';

const simulateKey = (key: string, type: 'keydown' | 'keyup') => {
  window.dispatchEvent(new KeyboardEvent(type, { key }));
};

const MobileControls = () => (
  <div className="mobile-controls">
    <div className="dpad">
      <button className="up" onPointerDown={() => simulateKey('ArrowUp', 'keydown')} onPointerUp={() => simulateKey('ArrowUp', 'keyup')} onPointerOut={() => simulateKey('ArrowUp', 'keyup')}>▲</button>
      <button className="left" onPointerDown={() => simulateKey('ArrowLeft', 'keydown')} onPointerUp={() => simulateKey('ArrowLeft', 'keyup')} onPointerOut={() => simulateKey('ArrowLeft', 'keyup')}>◀</button>
      <button className="right" onPointerDown={() => simulateKey('ArrowRight', 'keydown')} onPointerUp={() => simulateKey('ArrowRight', 'keyup')} onPointerOut={() => simulateKey('ArrowRight', 'keyup')}>▶</button>
      <button className="down" onPointerDown={() => simulateKey('ArrowDown', 'keydown')} onPointerUp={() => simulateKey('ArrowDown', 'keyup')} onPointerOut={() => simulateKey('ArrowDown', 'keyup')}>▼</button>
    </div>
    <div className="action-buttons">
      <button className="go" onPointerDown={() => simulateKey('w', 'keydown')} onPointerUp={() => simulateKey('w', 'keyup')} onPointerOut={() => simulateKey('w', 'keyup')}>GO</button>
      <button className="stop" onPointerDown={() => simulateKey('s', 'keydown')} onPointerUp={() => simulateKey('s', 'keyup')} onPointerOut={() => simulateKey('s', 'keyup')}>STOP</button>
    </div>
  </div>
);

export default function App() {
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'splash' | 'menu' | 'playing' | 'quit'>('splash');
  const [splashFading, setSplashFading] = useState(false);
  const [mapType, setMapType] = useState<'galaxy' | 'city' | 'water'>('galaxy');

  useEffect(() => {
    if (gameState === 'splash') {
      const fadeTimer = setTimeout(() => {
        setSplashFading(true);
      }, 2500);

      const transitionTimer = setTimeout(() => {
        setGameState('menu');
      }, 3500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(transitionTimer);
      };
    }
  }, [gameState]);

  return (
    <>
      {(gameState === 'menu' || gameState === 'playing') && (
        <Canvas shadows>
          <GameScene setScore={setScore} score={score} mapType={mapType} />
        </Canvas>
      )}

      {gameState === 'playing' && <MobileControls />}

      {gameState === 'splash' && (
        <div className={`splash-screen ${splashFading ? 'fade-out' : ''}`}>
          <img src="/game_logo.jpg" alt="Astro Snake Logo" className="splash-logo" />
        </div>
      )}

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="menu-card">
            <img src="/game_logo.jpg" alt="Astro Snake Logo" className="menu-logo" />
            
            <div className="map-selection">
              <div 
                className={`map-card ${mapType === 'galaxy' ? 'selected' : ''}`}
                onClick={() => setMapType('galaxy')}
              >
                <img src="/space_bg.jpg" alt="Galaxy" />
                <div>Deep Space</div>
              </div>
              <div 
                className={`map-card ${mapType === 'city' ? 'selected' : ''}`}
                onClick={() => setMapType('city')}
              >
                <img src="/city_skybox.jpg" alt="Neon City" />
                <div>Neon City</div>
              </div>
              <div 
                className={`map-card ${mapType === 'water' ? 'selected' : ''}`}
                onClick={() => setMapType('water')}
              >
                <img src="/water_skybox.jpg" alt="Ocean" />
                <div>Ocean Depth</div>
              </div>
            </div>

            <button className="menu-btn" onClick={() => setGameState('playing')}>
              PLAY NOW
            </button>
            <button className="menu-btn quit" onClick={() => setGameState('quit')}>
              QUIT
            </button>
          </div>
        </div>
      )}

      {/* PLAYING UI */}
      {gameState === 'playing' && (
        <div className="ui-container">
          <div className="score-display">SCORE: {score}</div>
          
          <div style={{position: 'absolute', bottom: '20px', left: '20px', color: 'white', opacity: 0.5}}>
            <div>W/S: Move Forward/Backward</div>
            <div>A/D: Turn Left/Right</div>
            <div>Up/Down Arrows: Pitch Up/Down</div>
          </div>
        </div>
      )}

      {/* QUIT SCREEN */}
      {gameState === 'quit' && (
        <div className="quit-screen">
          <h1>THANKS FOR PLAYING</h1>
          <p>You may now safely close this browser tab.</p>
        </div>
      )}
    </>
  );
}

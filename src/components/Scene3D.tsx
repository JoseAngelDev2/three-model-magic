import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Crear textura lunar procedural (igual que tu código original)
function createMoonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.5, '#d0d0d0');
  gradient.addColorStop(1, '#a0a0a0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const radius = Math.random() * 30 + 5;
    
    const craterGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    craterGradient.addColorStop(0, '#808080');
    craterGradient.addColorStop(0.5, '#909090');
    craterGradient.addColorStop(1, '#b0b0b0');
    
    ctx.fillStyle = craterGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  const imageData = ctx.getImageData(0, 0, 512, 512);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = Math.random() * 20 - 10;
    imageData.data[i] += noise;
    imageData.data[i + 1] += noise;
    imageData.data[i + 2] += noise;
  }
  ctx.putImageData(imageData, 0, 0);
  
  return new THREE.CanvasTexture(canvas);
}

interface ModelProps {
  targetScale: number;
  onScaleChange: (scale: number) => void;
}

// Componente que carga el modelo 3D
function Model3D({ targetScale, onScaleChange }: ModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [currentScale, setCurrentScale] = useState(0.01);
  
  // 🔥 IMPORTANTE: Coloca tu modelo .glb o .gltf en la carpeta public/models/
  // Por ejemplo: public/models/mi_modelo.glb
  // Luego descomenta las siguientes líneas y comenta la sección de la luna:
  
  /*
  // Para cargar tu modelo 3D (.glb o .gltf):
  const gltf = useLoader(GLTFLoader, '/models/mi_modelo.glb');
  
  useEffect(() => {
    if (gltf && meshRef.current) {
      // Ajusta el tamaño inicial del modelo si es necesario
      meshRef.current.scale.set(0.01, 0.01, 0.01);
      
      // Centra el modelo
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center);
      
      // Asegura que el modelo tenga materiales con iluminación
      gltf.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            // Si tu modelo no tiene materiales adecuados, puedes reemplazarlos:
            // mesh.material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
          }
        }
      });
    }
  }, [gltf]);
  */

  // 🌙 LUNA PROCEDURAL (puedes eliminar esto cuando cargues tu modelo)
  const moonTexture = createMoonTexture();
  
  useFrame(() => {
    if (meshRef.current) {
      // Suavizar el crecimiento
      setCurrentScale((prev) => {
        const newScale = prev + (targetScale - prev) * 0.05;
        onScaleChange(newScale);
        meshRef.current!.scale.set(newScale, newScale, newScale);
        return newScale;
      });
      
      // Rotación automática suave
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={meshRef}>
      {/* 🌙 LUNA - Comenta esto cuando uses tu modelo 3D */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          map={moonTexture} 
          roughness={1} 
          metalness={0}
        />
      </mesh>
      
      {/* 🔥 TU MODELO 3D - Descomenta cuando lo cargues */}
      {/* <primitive object={gltf.scene} /> */}
    </group>
  );
}

export const Scene3D = () => {
  const [targetScale, setTargetScale] = useState(0.01);
  const [currentScale, setCurrentScale] = useState(0.01);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Click en el fondo para agrandar
      const target = e.target as HTMLElement;
      if (target.tagName === 'CANVAS' || target.classList.contains('star') || target.id === 'canvas-container') {
        setTargetScale(2.5);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full" id="canvas-container">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        
        {/* Iluminación */}
        <ambientLight intensity={0.5} color="#404040" />
        <directionalLight position={[5, 3, 5]} intensity={1} color="#ffffff" />
        
        {/* Modelo 3D (o luna) */}
        <Model3D targetScale={targetScale} onScaleChange={setCurrentScale} />
        
        {/* 
          Controles de órbita: 
          - Mouse: arrastra para rotar, rueda para zoom
          - Touch: un dedo para rotar, dos dedos (pinch) para zoom
        */}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.5}
          rotateSpeed={0.5}
          minDistance={1}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
};

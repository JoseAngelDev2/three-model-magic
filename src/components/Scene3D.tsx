import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  targetScale: number;
  onScaleChange: (scale: number) => void;
}

// 🔥 Componente que carga tu modelo 3D personalizado
function Model3D({ targetScale, onScaleChange }: ModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [currentScale, setCurrentScale] = useState(0.01);
  
  // 🔥 CARGA TU MODELO 3D AQUÍ:
  // Coloca tu archivo .glb o .gltf en: public/models/mi_modelo.glb
  // Luego cambia la ruta abajo:
  const gltf = useGLTF('/models/mi_modelo.glb');
  
  useEffect(() => {
    if (gltf && meshRef.current) {
      // Centra el modelo automáticamente
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center);
      
      // Asegura que el modelo tenga materiales con iluminación
      gltf.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            // Los materiales ya deberían tener iluminación
            // Si tu modelo se ve muy oscuro, puedes aumentar la emisión:
            // (mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x222222);
          }
        }
      });
    }
  }, [gltf]);
  
  useFrame(() => {
    if (meshRef.current) {
      // Suavizar el crecimiento/zoom
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
      {/* 🔥 TU MODELO 3D se carga aquí */}
      <primitive object={gltf.scene} />
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

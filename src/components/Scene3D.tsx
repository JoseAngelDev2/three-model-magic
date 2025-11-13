import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { toast } from "sonner";

interface ModelProps {
  targetScale: number;
  onScaleChange: (scale: number) => void;
}

// 🌙 Placeholder temporal - Esfera simple mientras cargas tu modelo
function PlaceholderSphere({ targetScale, onScaleChange }: ModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentScale, setCurrentScale] = useState(0.01);
  
  useFrame(() => {
    if (meshRef.current) {
      setCurrentScale((prev) => {
        const newScale = prev + (targetScale - prev) * 0.05;
        onScaleChange(newScale);
        meshRef.current!.scale.set(newScale, newScale, newScale);
        return newScale;
      });
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial 
        color="#888888"
        roughness={0.7} 
        metalness={0.3}
      />
    </mesh>
  );
}

// 🎯 Componente que intenta cargar tu modelo 3D
function CustomModel({ targetScale, onScaleChange, modelPath }: ModelProps & { modelPath: string }) {
  const meshRef = useRef<THREE.Group>(null);
  const [currentScale, setCurrentScale] = useState(0.01);
  const [model, setModel] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Intentar cargar el modelo usando GLTFLoader directamente
    const loader = new GLTFLoader();
    
    loader.load(
      modelPath,
      (gltf) => {
        // ✅ Modelo cargado exitosamente
        setModel(gltf);
        setError(false);
        
        // Centra el modelo
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.sub(center);
        
        // Asegura iluminación
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              (mesh.material as any).needsUpdate = true;
            }
          }
        });
        
        toast.success("¡Modelo 3D cargado correctamente!");
      },
      undefined,
      (error) => {
        // ❌ Error al cargar
        console.error("Error cargando modelo:", error);
        setError(true);
        toast.error("No se pudo cargar el modelo. Usando placeholder.");
      }
    );
  }, [modelPath]);

  useFrame(() => {
    if (meshRef.current) {
      setCurrentScale((prev) => {
        const newScale = prev + (targetScale - prev) * 0.05;
        onScaleChange(newScale);
        meshRef.current!.scale.set(newScale, newScale, newScale);
        return newScale;
      });
      meshRef.current.rotation.y += 0.001;
    }
  });

  // Si hay error o no hay modelo, retornar null para usar el placeholder
  if (error || !model) {
    return null;
  }

  return (
    <group ref={meshRef}>
      <primitive object={model.scene} />
    </group>
  );
}

export const Scene3D = () => {
  const [targetScale, setTargetScale] = useState(0.01);
  const [currentScale, setCurrentScale] = useState(0.01);
  const [useCustomModel, setUseCustomModel] = useState(true);
  const controlsRef = useRef<any>(null);

  // 🔥 CAMBIA AQUÍ la ruta a tu modelo:
  const MODEL_PATH = '/models/mi_modelo.glb';

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'CANVAS' || target.classList.contains('star') || target.id === 'canvas-container') {
        setTargetScale(2.5);
      }
    };

    window.addEventListener('click', handleClick);
    
    // Mostrar instrucciones al cargar
    toast.info("📦 Coloca tu modelo .glb en public/models/mi_modelo.glb", {
      duration: 5000,
    });

    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full" id="canvas-container">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        
        {/* Iluminación */}
        <ambientLight intensity={0.5} color="#404040" />
        <directionalLight position={[5, 3, 5]} intensity={1} color="#ffffff" />
        
        {/* Intenta cargar el modelo personalizado, si falla usa el placeholder */}
        <Suspense fallback={<PlaceholderSphere targetScale={targetScale} onScaleChange={setCurrentScale} />}>
          <CustomModel 
            modelPath={MODEL_PATH} 
            targetScale={targetScale} 
            onScaleChange={setCurrentScale} 
          />
          {/* Placeholder como fallback */}
          <PlaceholderSphere targetScale={targetScale} onScaleChange={setCurrentScale} />
        </Suspense>
        
        {/* Controles de órbita */}
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

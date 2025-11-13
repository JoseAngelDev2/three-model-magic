import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface ModelProps {
  targetScale: number;
  onScaleChange: (scale: number) => void;
}

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
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="#888888" roughness={0.7} metalness={0.3} />
    </mesh>
  );
}

function CustomModel({ targetScale, onScaleChange, modelPath }: ModelProps & { modelPath: string }) {
  const meshRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [currentScale, setCurrentScale] = useState(0.01);
  const [model, setModel] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loader = new GLTFLoader();

    loader.load(
      modelPath,
      (gltf) => {
        setModel(gltf);
        setError(false);

        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        gltf.scene.position.sub(center);

        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.Material;
            if ("opacity" in mat && (mat as any).opacity === 0) (mat as any).opacity = 1;
            if ("transparent" in mat) (mat as any).transparent = false;
            mat.needsUpdate = true;
          }
        });

        const size = box.getSize(new THREE.Vector3()).length();
        camera.position.copy(center.clone().add(new THREE.Vector3(0, 0, size * 1.5)));
        camera.lookAt(center);
      },
      undefined,
      () => setError(true)
    );
  }, [modelPath, camera]);

  useFrame(() => {
    if (meshRef.current) {
      setCurrentScale((prev) => {
        const newScale = prev + (targetScale - prev) * 0.05;
        onScaleChange(newScale);
        meshRef.current!.scale.set(newScale, newScale, newScale);
        return newScale;
      });
      meshRef.current.rotation.y += 0.002;
    }
  });

  if (error || !model) return null;

  return (
    <group ref={meshRef}>
      <primitive object={model.scene} />
    </group>
  );
}

export const Scene3D = () => {
  const [targetScale, setTargetScale] = useState(0.01);
  const [currentScale, setCurrentScale] = useState(0.01);
  const controlsRef = useRef<any>(null);

  const MODEL_PATH = "/models/Modelo 3D MOON.glb";

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "CANVAS" || target.id === "canvas-container") {
        setTargetScale(2.5);
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full" id="canvas-container">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />

        <Suspense fallback={<PlaceholderSphere targetScale={targetScale} onScaleChange={setCurrentScale} />}>
          <CustomModel modelPath={MODEL_PATH} targetScale={targetScale} onScaleChange={setCurrentScale} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.6}
          rotateSpeed={0.5}
          minDistance={1}
          maxDistance={30}
        />
      </Canvas>
    </div>
  );
};


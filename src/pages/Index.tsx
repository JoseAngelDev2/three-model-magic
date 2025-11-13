import { Scene3D } from "@/components/Scene3D";
import { Stars } from "@/components/Stars";
import { ModelUploadInstructions } from "@/components/ModelUploadInstructions";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fondo con estrellas */}
      <div className="fixed inset-0 w-full h-full">
        <Stars />
      </div>

      {/* Escena 3D */}
      <Scene3D />

      {/* Instrucciones */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="bg-black/50 backdrop-blur-md px-8 py-4 rounded-xl">
          <h1 className="text-foreground text-2xl font-semibold text-center">
            🙈🙉🙊 Hazme ZOOM 🙊🙉🙈
          </h1>
        </div>
      </div>

      {/* Instrucciones de cómo cargar modelo */}
      <ModelUploadInstructions />

      {/* Instrucciones de uso (esquina inferior) */}
      <div className="fixed bottom-5 right-5 z-50 pointer-events-none">
        <div className="bg-card/80 backdrop-blur-sm px-4 py-3 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground">
            🖱️ Arrastra para rotar • 🔍 Scroll/Pinch para zoom • 👆 Click para agrandar
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

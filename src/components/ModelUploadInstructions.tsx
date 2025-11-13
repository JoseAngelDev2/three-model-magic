import { Card } from "@/components/ui/card";
import { Upload, FileCode, CheckCircle } from "lucide-react";

export const ModelUploadInstructions = () => {
  return (
    <div className="fixed bottom-20 left-5 z-50 max-w-md">
      <Card className="bg-card/90 backdrop-blur-sm border-border/50 p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Upload className="w-5 h-5" />
            <h3 className="font-semibold">Cómo cargar tu modelo 3D</h3>
          </div>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <p>Coloca tu archivo <code className="bg-muted px-1 rounded">.glb</code> o <code className="bg-muted px-1 rounded">.gltf</code> en la carpeta <code className="bg-muted px-1 rounded">public/models/</code></p>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <p>Nómbralo <code className="bg-muted px-1 rounded">mi_modelo.glb</code> o edita la ruta en <code className="bg-muted px-1 rounded">Scene3D.tsx</code></p>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <p>Guarda y recarga - ¡tu modelo aparecerá!</p>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <FileCode className="w-3 h-3" />
              Mientras tanto, verás una esfera gris como placeholder
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

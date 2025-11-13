# 📦 Modelos 3D

Coloca aquí tus archivos de modelos 3D (.glb, .gltf, .obj, etc.)

## 🚀 Cómo usar tu modelo:

1. **Coloca tu modelo** en esta carpeta:
   - Ejemplo: `public/models/mi_modelo.glb`
   - Ejemplo: `public/models/personaje.gltf`

2. **Edita el archivo** `src/components/Scene3D.tsx`:
   - Descomenta la sección de carga de modelo (línea ~66)
   - Cambia la ruta: `useLoader(GLTFLoader, '/models/TU_ARCHIVO.glb')`
   - Comenta la sección de la luna (línea ~104-111)
   - Descomenta `<primitive object={gltf.scene} />` (línea ~115)

3. **Guarda y recarga** - ¡Tu modelo aparecerá!

## 🎨 Formatos soportados:

- ✅ `.glb` / `.gltf` (recomendado) - usa GLTFLoader
- ✅ `.obj` - necesitarás OBJLoader de three.js
- ✅ `.fbx` - necesitarás FBXLoader de three.js

## 💡 Consejos:

- Los modelos .glb son más compactos (incluyen texturas)
- Los modelos .gltf pueden tener archivos separados de texturas
- Si tu modelo es muy grande, puede tardar en cargar
- Ajusta el scale inicial si tu modelo es muy grande o pequeño

## 🧪 Probar en local:

Si tienes problemas de CORS al cargar modelos en desarrollo:
```bash
npm run dev
```

El servidor de Vite ya maneja esto automáticamente.

## 📚 Recursos para modelos gratuitos:

- https://sketchfab.com/
- https://poly.pizza/
- https://market.pmnd.rs/
- https://www.cgtrader.com/free-3d-models

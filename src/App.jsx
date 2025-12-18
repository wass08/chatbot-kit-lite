import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
} from "@react-three/postprocessing";
import { Suspense } from "react";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

function App() {
  return (
    <>
      <UI />
      <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
        <color attach="background" args={["#333"]} />
        <Suspense>
          <Experience />
        </Suspense>
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.9} mipmapBlur />
          <DepthOfField
            blur={2}
            bokehScale={5}
            target={[0, 1.8, 0]}
            focalLength={5}
            height={512}
          />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;

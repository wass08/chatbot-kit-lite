import { Clone, useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

export const Reindeer = ({ ...props }) => {
  const { scene, animations } = useGLTF("models/Stag.glb");
  const ref = useRef();

  const { actions, mixer } = useAnimations(animations, ref);

  useEffect(() => {
    actions["Gallop"].time =
      Math.random() * actions["Gallop"].getClip().duration;
    actions["Gallop"].play();
  }, [actions]);

  return (
    <group ref={ref}>
      <Clone
        object={scene}
        {...props}
        inject={<meshBasicMaterial color="white" />}
      />
    </group>
  );
};

useGLTF.preload("models/Stag.glb");

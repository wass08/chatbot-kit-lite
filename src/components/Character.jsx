import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MeshPhysicalMaterial } from "three";
import { lerp, randInt } from "three/src/math/MathUtils.js";
import { VISEMES } from "wawa-lipsync";
import useChatbot from "../hooks/useChatbot";

export const Character = ({ ...props }) => {
  const { scene, animations } = useGLTF("models/Santa.glb");

  const { actions, mixer } = useAnimations(animations, scene);
  const lipsyncManager = useChatbot((state) => state.lipsyncManager);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = false;
        child.frustumCulled = false;
        child.material = new MeshPhysicalMaterial({
          ...child.material,
          roughness: 1,
          ior: 2.2,
          iridescence: 0.7,
          iridescenceIOR: 1.3,
          reflectivity: 1,
        });
      }
    });
  }, [scene]);

  const status = useChatbot((state) => state.status);
  const [animation, setAnimation] = useState("Idle");
  useEffect(() => {
    const action = {
      playing: ["Talking", "Talking 2 ", "Talking 3"][randInt(0, 2)],
      loading: "Thinking",
      idle: "Idle",
    }[status];

    setAnimation(action);
  }, [actions, status]);

  useEffect(() => {
    if (mixer.time < 0.01) {
      actions[animation]?.reset().play();
    } else {
      actions[animation]?.reset().fadeIn(0.5).play();
    }
    return () => {
      actions[animation]?.fadeOut(0.5);
    };
  }, [animation, actions]);

  // Blend Shapes
  const avatarSkinnedMeshes = useMemo(() => {
    const skinnedMeshes = [];
    scene.traverse((child) => {
      if (child.isSkinnedMesh) {
        skinnedMeshes.push(child);
      }
    });
    return skinnedMeshes;
  }, [scene]);

  const lerpMorphTarget = useCallback(
    (target, value, speed = 0.1) => {
      avatarSkinnedMeshes.forEach((skinnedMesh) => {
        if (!skinnedMesh.morphTargetDictionary) {
          return;
        }
        const morphIndex = skinnedMesh.morphTargetDictionary[target];
        if (morphIndex !== undefined) {
          const currentValue = skinnedMesh.morphTargetInfluences[morphIndex];
          skinnedMesh.morphTargetInfluences[morphIndex] = lerp(
            currentValue,
            value,
            speed
          );
        }
      });
    },
    [avatarSkinnedMeshes]
  );

  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 150);
      }, randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  useFrame(() => {
    lerpMorphTarget("eyeBlinkLeft", blink ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink ? 1 : 0, 0.5);
    if (lipsyncManager) {
      lipsyncManager.processAudio();
      const currentViseme = lipsyncManager.viseme;
      Object.values(VISEMES).forEach((viseme) => {
        lerpMorphTarget(viseme, viseme === currentViseme ? 1 : 0, 0.2);
      });
    }
  });

  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload("models/Santa.glb");

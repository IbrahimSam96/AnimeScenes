'use client'

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { CameraControls, Loader, useProgress } from "@react-three/drei";
import { Experience } from "./Experience";
import { Leva } from "leva";
import { Bloom, EffectComposer } from "@react-three/postprocessing";


export default function AppComponent() {

    const { progress } = useProgress();

    return (
        <>
            <Leva hidden />
            <Canvas className={`col-start-1 col-span-8 row-start-1`} shadows camera={{ position: [13, 7, 10], fov: 60 }}  >
                <EffectComposer>
                    <Bloom
                        mipmapBlur
                        luminanceThreshold={1}
                        intensity={1.42}
                        radius={0.72}
                    />
                </EffectComposer>
                <Suspense>
                    {/* <CameraControls /> */}
                    <Experience />
                </Suspense>
            </Canvas>
            <Loader />
        </>
    )
}
'use client'

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { CameraControls, Loader, useProgress } from "@react-three/drei";
import { Experience } from "./Experience";
import { Leva } from "leva";
import { Bloom, EffectComposer } from "@react-three/postprocessing";


export default function AppComponent() {

    const [started, setStarted] = useState(false);
        // Play SoundTrack on enter
        const audio = new Audio(`./sounds/Hisoka.mp3`);

    return (
        <>
            <Leva  />

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
                    <Experience started={started} />
                </Suspense>
            </Canvas>

            <LoadingScreeen audio={audio} started={started} setStarted={setStarted} />

            <Loader />
        </>
    )
}


export const LoadingScreeen = ({ started, setStarted, audio }) => {

    const { progress } = useProgress();

    return (

        <div className={`menu col-start-1 col-span-8 row-start-1 transition-all duration-1000 ease-in-out ${started ? 'hidden opacity-0 pointer-events-none' : 'grid'} `}>

            <button onClick={() => {
                if (progress < 100) {
                    // Do Nothing
                }
                else {
                    setStarted(true)
                    audio.play()
                }
            }} disabled={progress < 100}
                className={`bg-[rgb(215,186,223,60%)] px-10 py-6 font-extrabold text-white rounded-[4px] border-none self-center justify-self-center transition-all duration-500 hover:bg-[#fffffff5] hover:text-black hover:cursor-pointer`}>
                Start
            </button>

        </div>
    )
}
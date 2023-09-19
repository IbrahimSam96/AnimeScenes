'use client'

import { Canvas, useFrame} from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { CameraControls, Loader, useProgress } from "@react-three/drei";
import { Experience } from "./Experience";
import { Leva, useControls } from "leva";

import { Bloom, EffectComposer } from "@react-three/postprocessing";
import Image from "next/image";


export default function AppComponent() {

    const [started, setStarted] = useState(false);
    // Play SoundTrack on enter
    const [audio, setAudio] = useState(null)
    useEffect(() => {
        let URL = `./sounds/Hisoka.mp3`
        setAudio(new Audio(URL))
        // only run once on the first render on the client
    }, [])

    const [subtitle, setSubtitle] = useState('');

    const { startingPosition } = useControls({
        startingPosition: {
            value: [13, 7, 9]
        },
    })

    return (
        <>
            <Leva hidden />

            <Canvas className={`col-start-1 col-span-8 row-start-1 bg-black`} shadows camera={{ position: startingPosition, fov: 60 }}  >
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

            <Subtitles subtitle={subtitle} setSubtitle={setSubtitle} started={started} />

            <Loader />
        </>
    )
}


export const LoadingScreeen = ({ started, setStarted, audio }) => {

    const { progress, loaded } = useProgress();

    return (

        <div className={`menu col-start-1 col-span-8 row-start-1 transition-all duration-1000 ease-in-out opacity-70 ${started ? 'hidden opacity-0 pointer-events-none' : 'grid self-center '} `}>

            <Image className={`self-center justify-self-center`} src={'/warning.jpg'} height={250} width={400} />

            {progress == 100 && loaded &&
                <button onClick={() => {
                    if (progress < 100) {
                        // Do Nothing
                    }
                    else {
                        setStarted(true)
                        audio.play()
                    }
                }} disabled={progress < 100}
                    className={`bg-[rgb(215,186,223,70%)] px-10 py-6 font-extrabold text-white rounded-[4px] border-none self-center justify-self-center transition-all duration-500 hover:bg-[#fffffff5] hover:text-black hover:cursor-pointer`}>
                    Start
                </button>

            }


        </div>
    )
}

export const Subtitles = ({ subtitle, setSubtitle, started }) => {

    // Replace this with your actual transcript
    const transcript =
        `00:00:00.10
        Gon,
        00:00:01.08
      
        00:00:02.06
        Gon.
        00:00:03.09
      
        00:00:05.14
        That's good.
        00:00:06.18
      
        00:00:06.24
        You are so very good.
        00:00:09.11
      
        00:00:09.11
        Those eyes that look,
        00:00:13.03
      
        00:00:13.04
        that spirit.
        00:00:14.19
      
        00:00:18.17
        *Hisoka moaning*: Ohhhhh.
        00:00:19.04`

    let lines = transcript.split('\n').map(line => line.trim());

    // Initialize an array to store objects
    const objectsArray = [];

    // Iterate through the lines and create objects
    for (let i = 0; i < lines.length; i += 4) {
        const timestamp1 = lines[i];
        const timestamp2 = lines[i + 2];

        // Create an object with title and intervalDifference properties
        const obj = {
            title: lines[i + 1], // The text transcript
            start: timestamp1,
            end: timestamp2
        };
        // Push the object into the array
        objectsArray.push(obj);
    }

    const [index, setIndex] = useState(0);

    const differencesInMilliseconds = [
        1000, // Delay for the first text
        2000, // Delay for the second text
        1500, // Delay for the third text
        3000, // Delay for the fourth text
        1000, // Delay for the fifth text
        2000, // Delay for the sixth text
        1500, // Delay for the seventh text
        3000, // Delay for the eighth text
        4000  // Delay for the ninth text
    ];

    const changeParagraph = () => {

        if (!objectsArray[index]) {
            setSubtitle('');
            return
        }
        else {
            setSubtitle(objectsArray[index].title);
            setIndex(index + 1);
            console.log(objectsArray[index].title)
        }
    }
    const { progress } = useProgress();

    useEffect(() => {

        if (progress == 100 && started) {
            setTimeout(changeParagraph, differencesInMilliseconds[index]);
        }

    }, [started, index])

    return (
        <div className={`col-start-1 col-span-8 row-start-1 self-end justify-self-center transition-all duration-1000 ease-in-out z-[100] bg-[rgb(215,186,223,60%)] w-auto bg-opacity-20 backdrop-blur-lg rounded drop-shadow-lg p-4 px-8 mb-[60px] ${!started || subtitle == '' ? 'hidden opacity-0 pointer-events-none' : 'grid'} `}>
            <h2 className={` text-xl text-white justify-self-center self-end font-sansCaption transition-all duration-1000 ease-in-out`}> {subtitle} </h2>
        </div>
    )
}
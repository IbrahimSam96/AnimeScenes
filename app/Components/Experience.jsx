'use client'

import { ContactShadows, Environment, OrbitControls, PerspectiveCamera, Stars, useScroll, MeshReflectorMaterial, useTexture } from "@react-three/drei"
import { Hisoka } from "./Hisoka"
import { useEffect, useRef } from "react"
import { randFloatSpread } from "three/src/math/MathUtils";

import { useFrame } from "@react-three/fiber"
import { easing } from "maath"
import * as THREE from "three";
import { Tree } from "./Tree"
import { Lamp } from "./Lamp"
import { useControls } from "leva"
import { Torii } from "./Torii";


import { Instance, Instances } from "@react-three/drei";
import { AdditiveBlending, DoubleSide, MathUtils } from "three";
import { FarTree } from "./FarTree";
import { Moon } from "./Moon";



import { DissolveMaterial } from "./DissolveMaterial";
import { Water } from "./Water";


// Variables 
const OFFSET_X = 20;
const LAMPS_NB = 10;
const LAMPS_SPEED = 0.8;

const TRESS_NB = 16;
const TREES_SPEED = 0.4;

const FARTRESS_NB = 12;
const FAR_TREES_SPEED = 15;

const TORI_NB = 5;
const TORI_SPEED = 2;


const RANDOMIZER_STRENGTH_SCALE = 0.42;
const RANDOMIZER_STRENGTH_POSITION = 1;


export const Experience = () => {



    const Ground = (props) => {

        // const terrainTextures = useTexture({
        //     map: "textures/Snow_Diff.jpg",
        //     displacementMap: "textures/Snow_Disp.jpg",
        //     aoMap: "textures/Snow_AO.jpg",
        //     roughnessMap: "textures/Snow_Rough.jpg",
        //     metalnessMap: "textures/Snow_Metal.jpg",
        //     normalMap: "textures/Snow_Normal.jpg"
        // });


        const terrainTextures = useTexture({
            normalMap: "textures/grid-texture.png"
        });


        return (
            <>
                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
                    <planeGeometry args={[50, 50]} />
                    <MeshReflectorMaterial
                        {...terrainTextures}
                        envMapIntensity={0}
                        normalScale={[0.15, 0.15]}
                        dithering={true}
                        color={[0.015, 0.015, 0.015]}
                        roughness={0.5}
                        blur={[1000, 400]} // Blur ground reflections (width, heigt), 0 skips blur
                        mixBlur={30} // How much blur mixes with surface roughness (default = 1)
                        mixStrength={80} // Strength of the reflections
                        mixContrast={1} // Contrast of the reflections
                        resolution={348} // Off-buffer resolution, lower=faster, higher=better quality, slower
                        mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
                        depthScale={0.01} // Scale the depth factor (0 = no depth, default = 0)
                        minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
                        maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
                        depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
                        debug={0}
                        reflectorOffset={0.2} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
                    />

                    {/* <meshBasicMaterial
                        color={groundColor}
                    /> */}

                </mesh>
            </>
        )
    }


    const MovingItem = (props) => {

        const ref = useRef();

        useFrame((_state, delta) => {
            ref.current.position.x += delta * props.speed;

            if (ref.current.position.x >= 15) {
                ref.current.position.x = -OFFSET_X;
            }
        });
        useEffect(() => {
            if (props.randomizePosition) {
                ref.current.position.x += randFloatSpread(RANDOMIZER_STRENGTH_POSITION);
                ref.current.position.z += randFloatSpread(RANDOMIZER_STRENGTH_POSITION);
            }
            if (props.randomizeScale) {
                ref.current.scale.x += randFloatSpread(RANDOMIZER_STRENGTH_SCALE);
                ref.current.scale.y += randFloatSpread(RANDOMIZER_STRENGTH_SCALE);
                ref.current.scale.z += randFloatSpread(RANDOMIZER_STRENGTH_SCALE);
            }
        }, []);

        return <group ref={ref}>{props.children} </group>
    }

    const cameraGroup = useRef();

    const { lampsNb, lampsSpeed, treesNb, treesSpeed, farTreesNb, farTreesSpeed, toriNb, toriSpeed, color, groundColor } = useControls({
        color: {
            value: 'black'
        },
        groundColor: {
            value: [0.015, 0.015, 0.015]
        },
        lampsNb: {
            value: LAMPS_NB,
            min: 1,
            max: 100,
            step: 1
        },
        lampsSpeed: {
            value: LAMPS_SPEED,
            min: 0.1,
            max: 2,
            step: 0.05,
        },
        treesNb: {
            value: TRESS_NB,
            min: 1,
            max: 100,
            step: 1
        },
        treesSpeed: {
            value: TREES_SPEED,
            min: 0.1,
            max: 2,
            step: 0.05,
        },
        farTreesNb: {
            value: FARTRESS_NB,
            min: 1,
            max: 100,
            step: 1
        },
        farTreesSpeed: {
            value: FAR_TREES_SPEED,
            min: 0.1,
            max: 50,
            step: 0.01,
        },
        toriNb: {
            value: TORI_NB,
            min: 1,
            max: 100,
            step: 1
        },
        toriSpeed: {
            value: TORI_SPEED,
            min: 0.1,
            max: 2,
            step: 0.01,
        }
    })

    const basicMaterial = new THREE.MeshStandardMaterial({ color: 'white' })

    return (
        <>
            <OrbitControls
                minAzimuthAngle={-Math.PI / 2}
                maxAzimuthAngle={Math.PI / 2}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
                // minDistance={2}
                // maxDistance={15}
                enableZoom={true}
            />
            {/* Background  */}
            <Stars radius={100} depth={500} count={5000} factor={4} saturation={0} fade speed={2} />
            <ambientLight intensity={0.2} />
            <Environment preset="city" intensity={0.4} blur={0.8} />
            <color attach="background" args={[color]} />
            {/* <fog attach="fog" args={["black", 12, 30]} /> */}

            <Water position={[7, -2, 60]}  />
            {/* Scene */}
            <group position={[0, 0, 0]} ref={cameraGroup} >

                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[50, 50]} />

                    <MeshReflectorMaterial
                        // {...terrainTextures}
                        envMapIntensity={0}
                        normalScale={[0.15, 0.15]}
                        dithering={true}
                        color={groundColor}
                        roughness={0.5}
                        blur={[1000, 400]} // Blur ground reflections (width, heigt), 0 skips blur
                        mixBlur={30} // How much blur mixes with surface roughness (default = 1)
                        mixStrength={80} // Strength of the reflections
                        mixContrast={1} // Contrast of the reflections
                        resolution={348} // Off-buffer resolution, lower=faster, higher=better quality, slower
                        mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
                        depthScale={0.01} // Scale the depth factor (0 = no depth, default = 0)
                        minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
                        maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
                        depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
                        debug={0}
                        reflectorOffset={0.2} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
                    />

                    {/* <DissolveMaterial baseMaterial={boxMaterial} /> */}
                </mesh>

                <spotLight
                    color={[1, 0.25, 0.7]}
                    intensity={20}
                    angle={0.6}
                    penumbra={0.5}
                    position={[0, 5, 0]}
                    castShadow
                    shadow-bias={-0.0001}
                />
                <spotLight
                    color={[0.14, 0.5, 1]}
                    intensity={20}
                    angle={0.6}
                    penumbra={0.5}
                    position={[-5, 5, 0]}
                    castShadow
                    shadow-bias={-0.0001}
                />


                <Hisoka rotation-y={-Math.PI / 2} />
                <Speed />

                {[...Array(treesNb)].map((_v, index) => {
                    return (
                        <MovingItem
                            key={index}
                            speed={farTreesSpeed}
                            randomizePosition
                            randomizeScale
                        >
                            <FarTree scale={[0.5, 0.5, 0.5]} position={[-OFFSET_X + (index / treesNb) * OFFSET_X * 7, 0, -12]} rotation-y={-Math.PI / 2} />
                        </MovingItem>
                    )
                })}

                <ContactShadows opacity={0.42} scale={[16, 16]} />
            </group>

        </>
    )
}



const INSTANCES = 140;

const SpeedShape = () => {
    const ref = useRef();
    let randomPosition = {
        x: 0,
        y: 0,
        z: 0,
    };
    let randomSpeed = 0;

    const resetRandom = () => {
        randomPosition = {
            x: MathUtils.randFloatSpread(8),
            y: MathUtils.randFloatSpread(5),
            z: MathUtils.randFloatSpread(8),
        };
        randomSpeed = MathUtils.randFloat(16, 20);
    };

    resetRandom();

    useFrame((_state, delta) => {
        if (ref.current) {
            ref.current.position.z += randomSpeed * delta;
            if (ref.current.position.z > 5) {
                resetRandom();
                ref.current.position.z = randomPosition.z;
            }
        }
    });

    return (
        <Instance
            ref={ref}
            color="white"
            position={[randomPosition.x, randomPosition.y, randomPosition.z]}
            rotation-y={Math.PI}
        />
    );
};

export const Speed = () => {


    return (
        <group>
            <Instances>
                <planeGeometry args={[1, 0.004]} />
                <meshBasicMaterial
                    side={DoubleSide}
                    blending={AdditiveBlending}
                    opacity={0.1}
                    transparent
                />
                {Array(INSTANCES)
                    .fill()
                    .map((_, key) => (
                        <SpeedShape key={key} />
                    ))}
            </Instances>
        </group>
    );
};
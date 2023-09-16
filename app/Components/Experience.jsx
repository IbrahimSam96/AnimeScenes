'use client'

import { useEffect, useRef, useState, useMemo } from "react"

// 3D Models
import { Hisoka } from "./Hisoka"
import { Gon } from './Gon'
import { FarTree } from "./FarTree";

// R3F drei, & THRRE.js 
import { useFrame, useThree } from "@react-three/fiber";

import { ContactShadows, Environment, OrbitControls, Stars, MeshReflectorMaterial, useTexture, MeshPortalMaterial, RoundedBox, Text, Html, Text3D, Center, CameraControls, useProgress } from "@react-three/drei"

import { Instance, Instances } from "@react-three/drei";
import { AdditiveBlending, DoubleSide, MathUtils } from "three";

import * as THREE from "three";

import { useControls } from "leva"

import { randFloatSpread } from "three/src/math/MathUtils";

import { easing } from "maath"


// Components 

import { DissolveMaterial } from "./DissolveMaterial";
import { Water } from "./Water";


// Variables 
const OFFSET_X = 20;
const TRESS_NB = 16;
const TREES_SPEED = 15;

const RANDOMIZER_STRENGTH_SCALE = 0.42;
const RANDOMIZER_STRENGTH_POSITION = 1;


export const Experience = ({ started }) => {

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

    const characterGroup = useRef();

    const { treesNb, treesSpeed, color, groundColor, fogColor, fogNear, fogFar } = useControls({
        color: {
            value: 'black'
        },
        groundColor: {
            value: [0.015, 0.015, 0.015]
        },
        fogColor: {
            value: 'black'
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
            max: 50,
            step: 0.05,
        },
        fogNear: {
            value: 12,
            min: 1,
            max: 100,
            step: 1
        },
        fogFar: {
            value: 30,
            min: 1,
            max: 100,
            step: 1
        },

    })

    // Move character on mouse movement
    useFrame((state, delta) => {
        let z = state.mouse.x * 4
        characterGroup.current.position.z = -z
    })

    const { progress } = useProgress();


    useEffect(() => {
        // Play SoundTrack on enter
        const audio = new Audio(`./sounds/Hisoka.mp3`);

        if (started) {
            audio.play();

        }

    }, [started])
    

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
            <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

            {/* <Water position={[7, -2, 60]}  /> */}

            {/* Scene */}
            <group position={[0, 0, 0]} >

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


                <group ref={characterGroup}  >

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

                </group>

                {[...Array(treesNb)].map((_v, index) => {
                    return (
                        <MovingItem
                            key={index}
                            speed={treesSpeed}
                            randomizePosition
                            randomizeScale
                        >
                            <FarTree scale={[0.5, 0.5, 0.5]} position={[-OFFSET_X + (index / treesNb) * OFFSET_X * 7, 0, -12]} rotation-y={-Math.PI / 2} />
                        </MovingItem>
                    )
                })}

                {/* Another World */}
                <group position={[-11, 5, 7]}>
                    <NFTCard
                        name="Perverted Hisoka"
                        color="#ffa997"
                        texture={"textures/cloudy.jpeg"}
                        position-x={3}
                        rotation-y={-Math.PI / 8}
                    >

                        <Gon position-y={-1} position-x={0.2} rotation-y={2.5} scale={[3, 3, 3]} />
                    </NFTCard>
                </group>

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

const NFTCard = ({
    children,
    texture,
    name,
    color,
    q = new THREE.Quaternion(),
    p = new THREE.Vector3(),
    ...props
}) => {

    const [active, setActive] = useState(false)
    const ref = useRef();
    const map = useTexture(texture);
    const portalMaterial = useRef();

    useFrame((_state, delta) => {
        const worldOpen = active === name;
        easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2, delta);
    });


    const { textPosition, textRotation, textColor } = useControls({
        textColor: {
            value: 'black'
        },
        textPosition: {
            value: [0, -3, -0.5]
        },
        textRotation: {
            value: [0, 3.1, 0]
        },
    })

    return (
        <group  {...props}>

            <Text
                font="fonts/Caprasimo-Regular.ttf"
                fontSize={1.15}
                position={textPosition}
                rotation={textRotation}
                anchorY={"top"}
            >
                {name}
                <meshBasicMaterial color={color} toneMapped={false} />
            </Text>
            <RoundedBox
                ref={ref}
                name={name}
                args={[9.5, 5, 0.1]}
                onClick={() => setActive(!active)} onPointerMissed={() => setActive(false)}
            >
                <MeshPortalMaterial ref={portalMaterial} side={THREE.DoubleSide} onClick={() => setActive(!active)} onPointerMissed={() => setActive(false)}
                >
                    <ambientLight intensity={1} />
                    <Environment preset="sunset" />
                    {children}
                    <mesh>
                        <sphereGeometry args={[5, 64, 64]} />
                        <meshStandardMaterial map={map} side={THREE.BackSide} />
                    </mesh>
                </MeshPortalMaterial>
            </RoundedBox>

        </group>
    );
};
/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Gon(props) {
  const { nodes, materials } = useGLTF('/models/Gon/scene.gltf')
  return (
    <group {...props} dispose={null}>
      <group position={[-0.23, -0.13, -0.2]} rotation={[-0.13, -0.01, 0.12]}>
        <mesh geometry={nodes.BezierCurve007.geometry} material={materials['Gon-Cabelo']} />
        <mesh geometry={nodes.BezierCurve007_1.geometry} material={materials.Outline} />
        <mesh geometry={nodes.BezierCurve007_2.geometry} material={materials['Gon-Brilho-Pele']} />
        <mesh geometry={nodes.BezierCurve007_3.geometry} material={materials['Gon-Brilho-Verde']} />
        <mesh geometry={nodes.BezierCurve007_4.geometry} material={materials['Gon-Brilho-Branco']} />
        <mesh geometry={nodes.BezierCurve007_5.geometry} material={materials['Gon-OlhosDetalhe']} />
        <mesh geometry={nodes.BezierCurve007_6.geometry} material={materials['Gon-Brilho-Iris']} />
        <mesh geometry={nodes.BezierCurve007_7.geometry} material={materials['Gon-Pupila']} />
        <mesh geometry={nodes.BezierCurve007_8.geometry} material={materials['Gon-IrisDetalhe']} />
        <mesh geometry={nodes.BezierCurve007_9.geometry} material={materials['Gon-Esclera']} />
        <mesh geometry={nodes.BezierCurve007_10.geometry} material={materials.Brilho} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/Gon/scene.gltf')

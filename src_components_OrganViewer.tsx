import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const Heart = ({ specs }) => {
  const heartRef = useRef()
  const { nodes, materials } = useGLTF('/assets/3d/heart.glb')

  useFrame(() => {
    if (heartRef.current) {
      heartRef.current.rotation.y += 0.01
      
      // Simulate heartbeat
      const scale = 1 + Math.sin(Date.now() * 0.01) * 0.05
      heartRef.current.scale.set(scale, scale, scale)
      
      // Change color based on temperature
      const hue = THREE.MathUtils.lerp(0, 0.3, (specs.temperature - 35) / 5)
      materials.HeartMaterial.color.setHSL(hue, 1, 0.5)
    }
  })

  return (
    <group ref={heartRef}>
      <mesh geometry={nodes.Heart.geometry} material={materials.HeartMaterial} />
    </group>
  )
}

const OrganViewer = ({ specs }) => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <Heart specs={specs} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Environment preset="studio" background />
    </Canvas>
  )
}

export default OrganViewer
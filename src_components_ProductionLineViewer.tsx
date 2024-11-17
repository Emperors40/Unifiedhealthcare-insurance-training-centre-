import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Html } from '@react-three/drei'
import { Badge } from "@/components/ui/badge"

const GeneticSequencer = ({ position, rotation, onClick }) => {
  const { nodes, materials } = useGLTF('/assets/3d/genetic_sequencer.glb')
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      <mesh ref={meshRef} geometry={nodes.Sequencer.geometry} material={materials.SequencerMaterial}>
        <Html distanceFactor={15}>
          <Badge variant="outline">DNA Sequencer</Badge>
        </Html>
      </mesh>
    </group>
  )
}

const PCRMachine = ({ position, rotation, onClick }) => {
  const { nodes, materials } = useGLTF('/assets/3d/pcr_machine.glb')
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      <mesh ref={meshRef} geometry={nodes.PCR.geometry} material={materials.PCRMaterial}>
        <Html distanceFactor={15}>
          <Badge variant="outline">PCR Machine</Badge>
        </Html>
      </mesh>
    </group>
  )
}

const ProductionLineViewer = ({ lineId, zoomLevel, rotation, onPartClick }) => {
  return (
    <Canvas camera={{ position: [0, 5, 10] }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <G
eneticSequencer position={[-2, 0, 0]} rotation={[0, rotation, 0]} onClick={() => onPartClick('sequencer')} />
      <PCRMachine position={[2, 0, 0]} rotation={[0, rotation, 0]} onClick={() => onPartClick('pcr')} />
      <OrbitControls 
        enableZoom={true}
        enableRotate={true}
        zoomSpeed={0.5}
        rotateSpeed={0.5}
        minDistance={5}
        maxDistance={20}
      />
      <Environment preset="studio" background />
    </Canvas>
  )
}

export default ProductionLineViewer
import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Printer3d, Search, Cog, Goggles } from 'lucide-react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

const productionLines = [
  {
    category: "Automotive Production Lines",
    lines: [
      "Electric Vehicle Assembly Line",
      "Automotive Engine Manufacturing Line",
      "Autonomous Vehicle Assembly Line",
      "Electric Motorcycle Production Line",
      "Self-Driving Car Sensor Assembly Line",
      "Luxury Car Interior Production Line",
      "Solar-Powered Car Assembly Line",
      "Motorcycle Engine Assembly Line",
      "Automated Gearbox Production Line",
      "EV Battery Manufacturing Line"
    ]
  },
  // ... Add all other categories and their respective production lines
]

function ARGoggles() {
  const { nodes, materials } = useGLTF("/assets/3d/ar_goggles.glb")
  const mesh = useRef()

  useFrame((state, delta) => {
    mesh.current.rotation.y += delta * 0.5
  })

  return (
    <group ref={mesh}>
      <mesh geometry={nodes.Goggles.geometry} material={materials.Goggles} />
    </group>
  )
}

export default function TrainingCentre() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLine, setSelectedLine] = useState(null)
  const [command, setCommand] = useState("")
  const [printProgress, setPrintProgress] = useState(0)
  const [assemblyProgress, setAssemblyProgress] = useState(0)

  const filteredLines = productionLines.map(category => ({
    ...category,
    lines: category.lines.filter(line => 
      line.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.lines.length > 0)

  const handleLineSelect = (line) => {
    setSelectedLine(line)
    setPrintProgress(0)
    setAssemblyProgress(0)
  }

  const handleCommandSubmit = (e) => {
    e.preventDefault()
    // Simulate 3D printing and assembly process
    setPrintProgress(0)
    setAssemblyProgress(0)
    const printInterval = setInterval(() => {
      setPrintProgress(prev => {
        if (prev >= 100) {
          clearInterval(printInterval)
          return 100
        }
        return prev + 10
      })
    }, 500)
    setTimeout(() => {
      const assemblyInterval = setInterval(() => {
        setAssemblyProgress(prev => {
          if (prev >= 100) {
            clearInterval(assemblyInterval)
            return 100
          }
          return prev + 10
        })
      }, 500)
    }, 5000)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Training Centre</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Production Lines</CardTitle>
            <CardDescription>Select a production line to design and assemble</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                type="search"
                placeholder="Search production lines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <ScrollArea className="h-[600px]">
              <Tabs defaultValue={productionLines[0].category}>
                <TabsList className="mb-4">
                  {filteredLines.map((category, index) => (
                    <TabsTrigger key={index} value={category.category}>
                      {category.category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {filteredLines.map((category, index) => (
                  <TabsContent key={index} value={category.category}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.lines.map((line, lineIndex) => (
                        <Button
                          key={lineIndex}
                          variant={selectedLine === line ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => handleLineSelect(line)}
                        >
                          {line}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </ScrollArea>
          </CardContent>
        </Card>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>AR Vision Goggles</CardTitle>
              <CardDescription>3D view of the AR goggles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded-md overflow-hidden">
                <Canvas>
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                  <ARGoggles />
                  <OrbitControls />
                </Canvas>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Natural Language Command</CardTitle>
              <CardDescription>Design and assemble using voice commands</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCommandSubmit}>
                <Input
                  type="text"
                  placeholder="Enter your command..."
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="w-full mb-4"
                />
                <Button type="submit" className="w-full">Execute Command</Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Production Progress</CardTitle>
              <CardDescription>3D printing and assembly status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>3D Printing</span>
                  <Badge variant={printProgress === 100 ? "default" : "outline"}>
                    {printProgress === 100 ? "Complete" : "In Progress"}
                  </Badge>
                </div>
                <Progress value={printProgress} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Assembly</span>
                  <Badge variant={assemblyProgress === 100 ? "default" : "outline"}>
                    {assemblyProgress === 100 ? "Complete" : "In Progress"}
                  </Badge>
                </div>
                <Progress value={assemblyProgress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Upload, ZoomIn, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

export default function ImageProcessingApp() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null)
  const [detectedObjects, setDetectedObjects] = useState<string[]>([])
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setEnhancedImage(null)
        setDetectedObjects([])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEnhanceImage = () => {
    // Simulating image enhancement
    setEnhancedImage(selectedImage)
  }

  const handleDetectObjects = () => {
    // Simulating object detection
    setDetectedObjects(['Person', 'Car', 'Tree'])
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">AI Image Processing Platform</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Select an image to process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full">
              <Label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <Input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            {selectedImage && (
              <img src={selectedImage} alt="Selected" className="max-w-full h-auto rounded-lg" />
            )}
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Image Processing</CardTitle>
            <CardDescription>Enhance or analyze your image</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="enhance" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="enhance">Enhance</TabsTrigger>
                <TabsTrigger value="detect">Detect Objects</TabsTrigger>
              </TabsList>
              <TabsContent value="enhance">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="brightness">Brightness</Label>
                    <Slider
                      id="brightness"
                      min={0}
                      max={200}
                      step={1}
                      value={[brightness]}
                      onValueChange={(value) => setBrightness(value[0])}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contrast">Contrast</Label>
                    <Slider
                      id="contrast"
                      min={0}
                      max={200}
                      step={1}
                      value={[contrast]}
                      onValueChange={(value) => setContrast(value[0])}
                    />
                  </div>
                  <div>
                    <Label htmlFor="saturation">Saturation</Label>
                    <Slider
                      id="saturation"
                      min={0}
                      max={200}
                      step={1}
                      value={[saturation]}
                      onValueChange={(value) => setSaturation(value[0])}
                    />
                  </div>
                  <Button onClick={handleEnhanceImage} className="w-full">
                    <ZoomIn className="mr-2 h-4 w-4" /> Enhance Image
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="detect">
                <Button onClick={handleDetectObjects} className="w-full">
                  <Search className="mr-2 h-4 w-4" /> Detect Objects
                </Button>
                {detectedObjects.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Detected Objects:</h3>
                    <ul className="list-disc list-inside">
                      {detectedObjects.map((object, index) => (
                        <li key={index}>{object}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            {enhancedImage && (
              <img src={enhancedImage} alt="Enhanced" className="max-w-full h-auto rounded-lg" />
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
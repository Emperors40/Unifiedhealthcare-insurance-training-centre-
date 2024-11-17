import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Heart, Zap, Clipboard, Scan, Camera, RotateCcw } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"

// ... (previous imports and healthData remain unchanged)

export default function Dashboard() {
  const [bodyScanning, setBodyScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [selectedMetric, setSelectedMetric] = useState('heartRate')
  const [cameraActive, setCameraActive] = useState(false)
  const [currentCamera, setCurrentCamera] = useState('environment') // 'environment' for back camera, 'user' for front camera
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startBodyScan = () => {
    setBodyScanning(true)
    setScanProgress(0)
  }

  useEffect(() => {
    if (bodyScanning) {
      const interval = setInterval(() => {
        setScanProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval)
            setBodyScanning(false)
            return 0
          }
          return prevProgress + 10
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [bodyScanning])

  const toggleCamera = async () => {
    if (cameraActive) {
      stopCamera()
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: currentCamera } })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        streamRef.current = stream
        setCameraActive(true)
        toast({
          title: "Camera activated",
          description: `${currentCamera === 'environment' ? 'Back' : 'Front'} camera is now active.`,
        })
      } catch (error) {
        console.error('Error accessing camera:', error)
        toast({
          title: "Camera access error",
          description: "Unable to access the camera. Please check your permissions.",
          variant: "destructive",
        })
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
    toast({
      title: "Camera deactivated",
      description: "Camera has been turned off.",
    })
  }

  const switchCamera = () => {
    const newCamera = currentCamera === 'environment' ? 'user' : 'environment'
    setCurrentCamera(newCamera)
    if (cameraActive) {
      stopCamera()
      toggleCamera()
    }
  }

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
      const imageDataUrl = canvas.toDataURL('image/jpeg')
      // Here you would typically send this image data to your server or process it
      console.log('Image captured:', imageDataUrl)
      toast({
        title: "Image captured",
        description: "The image has been captured and is ready for processing.",
      })
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (cameraActive) {
      interval = setInterval(() => {
        captureImage()
      }, 30 * 60 * 1000) // 30 minutes
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [cameraActive])

  // ... (previous useEffect and other functions remain unchanged)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ... (header remains unchanged) */}
      
      <main className="flex-grow container mx-auto py-8">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="camera">Camera</TabsTrigger>
          </TabsList>
          
          {/* ... (previous TabsContent for dashboard, appointments, history, and profile remain unchanged) */}
          
          <TabsContent value="camera">
            <Card>
              <CardHeader>
                <CardTitle>Camera Access</CardTitle>
                <CardDescription>Manage camera settings for periodic health checks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="camera-active"
                    checked={cameraActive}
                    onCheckedChange={toggleCamera}
                  />
                  <Label htmlFor="camera-active">Activate Camera</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={switchCamera} disabled={!cameraActive}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Switch Camera
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Current: {currentCamera === 'environment' ? 'Back' : 'Front'} Camera
                  </span>
                </div>
                <Alert>
                  <Camera className="h-4 w-4" />
                  <AlertTitle>Automated Capture</AlertTitle>
                  <AlertDescription>
                    When active, the camera will automatically capture an image every 30 minutes.
                  </AlertDescription>
                </Alert>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  {cameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t">
        <div className="container mx-auto py-4 text-center text-sm text-muted-foreground">
          © 2023 HealthScan Pro. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
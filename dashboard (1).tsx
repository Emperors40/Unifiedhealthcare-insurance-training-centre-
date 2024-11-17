import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Heart, Zap, Clipboard, Scan, Camera, RotateCcw, Bell, Settings, LogOut } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

const healthData = [
  { date: '2023-06-01', heartRate: 72, bloodPressure: 120, sleep: 7.5, steps: 8000 },
  { date: '2023-06-02', heartRate: 75, bloodPressure: 118, sleep: 8, steps: 10000 },
  { date: '2023-06-03', heartRate: 70, bloodPressure: 122, sleep: 7, steps: 7500 },
  { date: '2023-06-04', heartRate: 73, bloodPressure: 121, sleep: 7.8, steps: 9000 },
  { date: '2023-06-05', heartRate: 71, bloodPressure: 119, sleep: 8.2, steps: 8500 },
  { date: '2023-06-06', heartRate: 74, bloodPressure: 120, sleep: 7.3, steps: 11000 },
  { date: '2023-06-07', heartRate: 72, bloodPressure: 117, sleep: 7.9, steps: 9500 },
]

export default function Dashboard() {
  const [bodyScanning, setBodyScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [selectedMetric, setSelectedMetric] = useState('heartRate')
  const [cameraActive, setCameraActive] = useState(false)
  const [currentCamera, setCurrentCamera] = useState('environment')
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [captureInterval, setCaptureInterval] = useState(30)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [userGoals, setUserGoals] = useState({
    steps: 10000,
    sleep: 8,
    heartRate: { min: 60, max: 100 },
  })

  const startBodyScan = useCallback(() => {
    setBodyScanning(true)
    setScanProgress(0)
  }, [])

  useEffect(() => {
    if (bodyScanning) {
      const interval = setInterval(() => {
        setScanProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval)
            setBodyScanning(false)
            toast({
              title: "Body Scan Complete",
              description: "Your body scan results are ready for review.",
            })
            return 0
          }
          return prevProgress + 10
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [bodyScanning])

  const toggleCamera = useCallback(async () => {
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
  }, [cameraActive, currentCamera])

  const stopCamera = useCallback(() => {
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
  }, [])

  const switchCamera = useCallback(() => {
    const newCamera = currentCamera === 'environment' ? 'user' : 'environment'
    setCurrentCamera(newCamera)
    if (cameraActive) {
      stopCamera()
      toggleCamera()
    }
  }, [cameraActive, currentCamera, stopCamera, toggleCamera])

  const captureImage = useCallback(() => {
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
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (cameraActive) {
      interval = setInterval(() => {
        captureImage()
      }, captureInterval * 60 * 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [cameraActive, captureInterval, captureImage])

  const toggleNotifications = useCallback(() => {
    setNotificationsEnabled(prev => !prev)
    if (!notificationsEnabled) {
      toast({
        title: "Notifications Enabled",
        description: "You will now receive health updates and reminders.",
      })
    } else {
      toast({
        title: "Notifications Disabled",
        description: "You will no longer receive health updates and reminders.",
      })
    }
  }, [notificationsEnabled])

  const updateUserGoal = useCallback((goal: string, value: number | { min: number; max: number }) => {
    setUserGoals(prev => ({ ...prev, [goal]: value }))
    toast({
      title: "Goal Updated",
      description: `Your ${goal} goal has been updated.`,
    })
  }, [])

  const getLatestMetrics = useCallback(() => {
    const latest = healthData[healthData.length - 1]
    return {
      heartRate: latest.heartRate,
      bloodPressure: latest.bloodPressure,
      sleep: latest.sleep,
      steps: latest.steps,
    }
  }, [])

  const checkGoals = useCallback(() => {
    const latestMetrics = getLatestMetrics()
    if (latestMetrics.steps < userGoals.steps) {
      toast({
        title: "Step Goal Alert",
        description: `You're ${userGoals.steps - latestMetrics.steps} steps away from your daily goal!`,
        variant: "warning",
      })
    }
    if (latestMetrics.sleep < userGoals.sleep) {
      toast({
        title: "Sleep Goal Alert",
        description: `You slept ${latestMetrics.sleep} hours. Try to get ${userGoals.sleep} hours for optimal health.`,
        variant: "warning",
      })
    }
    if (latestMetrics.heartRate < userGoals.heartRate.min || latestMetrics.heartRate > userGoals.heartRate.max) {
      toast({
        title: "Heart Rate Alert",
        description: `Your heart rate is outside your target range. Please check your activity level.`,
        variant: "warning",
      })
    }
  }, [getLatestMetrics, userGoals])

  useEffect(() => {
    if (notificationsEnabled) {
      const interval = setInterval(checkGoals, 3600000) // Check goals every hour
      return () => clearInterval(interval)
    }
  }, [notificationsEnabled, checkGoals])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <Scan className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">HealthScan Pro</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a className="transition-colors hover:text-foreground/80 text-foreground" href="/dashboard">Dashboard</a>
              <a className="transition-colors hover:text-foreground/80 text-muted-foreground" href="/appointments">Appointments</a>
              <a className="transition-colors hover:text-foreground/80 text-muted-foreground" href="/history">History</a>
              <a className="transition-colors hover:text-foreground/80 text-muted-foreground" href="/settings">Settings</a>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Input
                type="search"
                placeholder="Search..."
                className="md:w-[100px] lg:w-[300px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="@user" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto py-8">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="camera">Camera</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getLatestMetrics().heartRate} BPM</div>
                  <p className="text-xs text-muted-foreground">
                    {getLatestMetrics().heartRate >= userGoals.heartRate.min && getLatestMetrics().heartRate <= userGoals.heartRate.max
                      ? 'Within target range'
                      : 'Outside target range'}
                  </p>
                  <Progress value={(getLatestMetrics().heartRate / userGoals.heartRate.max) * 100} className="mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getLatestMetrics().bloodPressure}/80 mmHg</div>
                  <p className="text-xs text-muted-foreground">Optimal</p>
                  <Progress  value={80} className="mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sleep</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getLatestMetrics().sleep}h</div>
                  <p className="text-xs text-muted-foreground">
                    {getLatestMetrics().sleep >= userGoals.sleep ? 'Goal achieved' : 'Below target'}
                  </p>
                  <Progress value={(getLatestMetrics().sleep / userGoals.sleep) * 100} className="mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Steps</CardTitle>
                  <Clipboard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getLatestMetrics().steps}</div>
                  <p className="text-xs text-muted-foreground">
                    {getLatestMetrics().steps >= userGoals.steps ? 'Goal achieved' : `${userGoals.steps - getLatestMetrics().steps} steps to go`}
                  </p>
                  <Progress value={(getLatestMetrics().steps / userGoals.steps) * 100} className="mt-2" />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Health Metrics Over Time</CardTitle>
                <CardDescription>Track your progress over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heartRate">Heart Rate</SelectItem>
                      <SelectItem value="bloodPressure">Blood Pressure</SelectItem>
                      <SelectItem value="sleep">Sleep</SelectItem>
                      <SelectItem value="steps">Steps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-[300px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey={selectedMetric} stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Body Scan</CardTitle>
                <CardDescription>Perform a comprehensive body scan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-64 h-64 bg-muted rounded-full flex items-center justify-center relative">
                    <Scan className={`h-32 w-32 ${bodyScanning ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
                    {bodyScanning && (
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-primary"
                          strokeWidth="4"
                          stroke="currentColor"
                          fill="transparent"
                          r="48"
                          cx="50"
                          cy="50"
                          style={{
                            strokeDasharray: '301.59',
                            strokeDashoffset: 301.59 - (scanProgress / 100) * 301.59,
                          }}
                        />
                      </svg>
                    )}
                  </div>
                  <Button onClick={startBodyScan} disabled={bodyScanning}>
                    {bodyScanning ? 'Scanning...' : 'Start Body Scan'}
                  </Button>
                  {bodyScanning && (
                    <p className="text-sm text-muted-foreground">Scan progress: {scanProgress}%</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Manage your scheduled medical appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: '2023-06-15', time: '10:00 AM', doctor: 'Dr. Smith', type: 'Annual Checkup' },
                    { date: '2023-06-22', time: '2:30 PM', doctor: 'Dr. Johnson', type: 'Dental Cleaning' },
                    { date: '2023-07-05', time: '11:15 AM', doctor: 'Dr. Lee', type: 'Eye Examination' },
                  ].map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{appointment.type}</p>
                        <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                      </div>
                      <div className="text-right">
                        <p>{appointment.date}</p>
                        <p className="text-sm text-muted-foreground">{appointment.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">Schedule New Appointment</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Health History</CardTitle>
                <CardDescription>View your past health records and test results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: '2023-05-10', type: 'Blood Test', result: 'Normal' },
                    { date: '2023-04-22', type: 'X-Ray', result: 'No abnormalities detected' },
                    { date: '2023-03-15', type: 'Allergy Test', result: 'Mild pollen allergy' },
                  ].map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{record.type}</p>
                        <p className="text-sm text-muted-foreground">{record.result}</p>
                      </div>
                      <div className="text-right">
                        <p>{record.date}</p>
                        <Button variant="outline" size="sm" className="mt-2">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Manage your personal information and health goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="@user" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">John Doe</h3>
                      <p className="text-sm text-muted-foreground">john@example.com</p>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input type="date" id="dob" defaultValue="1990-01-01" />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select defaultValue="male">
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input type="number" id="height" defaultValue="175" />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input type="number" id="weight" defaultValue="70" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Health Goals</h4>
                    <div>
                      <Label htmlFor="steps-goal">Daily Steps Goal</Label>
                      <Slider
                        id="steps-goal"
                        min={1000}
                        max={20000}
                        step={1000}
                        value={[userGoals.steps]}
                        onValueChange={(value) => updateUserGoal('steps', value[0])}
                      />
                      <p className="text-sm text-muted-foreground mt-1">{userGoals.steps} steps</p>
                    </div>
                    <div>
                      <Label htmlFor="sleep-goal">Sleep Goal (hours)</Label>
                      <Slider
                        id="sleep-goal"
                        min={5}
                        max={12}
                        step={0.5}
                        value={[userGoals.sleep]}
                        onValueChange={(value) => updateUserGoal('sleep', value[0])}
                      />
                      <p className="text-sm text-muted-foreground mt-1">{userGoals.sleep} hours</p>
                    </div>
                    <div>
                      <Label>Heart Rate Range (BPM)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={userGoals.heartRate.min}
                          onChange={(e) => updateUserGoal('heartRate', { ...userGoals.heartRate, min: parseInt(e.target.value) })}
                          className="w-20"
                        />
                        <span>to</span>
                        <Input
                          type="number"
                          value={userGoals.heartRate.max}
                          onChange={(e) => updateUserGoal('heartRate', { ...userGoals.heartRate, max: parseInt(e.target.value) })}
                          className="w-20"
                        />
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
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
                <div>
                  <Label htmlFor="capture-interval">Capture Interval (minutes)</Label>
                  <Slider
                    id="capture-interval"
                    min={1}
                    max={60}
                    step={1}
                    value={[captureInterval]}
                    onValueChange={(value) => setCaptureInterval(value[0])}
                  />
                  <p className="text-sm text-muted-foreground mt-1">Capture every {captureInterval} minutes</p>
                </div>
                <Alert>
                  <Camera className="h-4 w-4" />
                  <AlertTitle>Automated Capture</AlertTitle>
                  <AlertDescription>
                    When active, the camera will automatically capture an image every {captureInterval} minutes.
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

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="fixed bottom-4 right-4 rounded-full">
            <Bell className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>Manage your notification preferences</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={toggleNotifications}
              />
              <Label htmlFor="notifications">Enable Notifications</Label>
            </div>
            {/* Add more notification settings here */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
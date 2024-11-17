'use client'

import { useState, useEffect } from 'react'
import Parse from 'parse/dist/parse.min.js'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Upload, Database, Brain, BarChartIcon as ChartBar, Rocket, Activity, Image, Type, Mic } from 'lucide-react'

// Initialize Back4App
Parse.initialize("YOUR_APP_ID", "YOUR_JS_KEY");
Parse.serverURL = 'https://parseapi.back4app.com/';

export default function AITrainingDashboard() {
  const [activeDataset, setActiveDataset] = useState('Dataset A')
  const [datasets, setDatasets] = useState([])
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [modelPerformance, setModelPerformance] = useState([])
  const [deployedModels, setDeployedModels] = useState([])
  const [modelType, setModelType] = useState('image')

  useEffect(() => {
    fetchDatasets()
    fetchDeployedModels()
    fetchModelPerformance()
  }, [])

  const fetchDatasets = async () => {
    const Dataset = Parse.Object.extend("Dataset");
    const query = new Parse.Query(Dataset);
    const results = await query.find();
    setDatasets(results.map(dataset => dataset.get('name')));
  }

  const fetchDeployedModels = async () => {
    const DeployedModel = Parse.Object.extend("DeployedModel");
    const query = new Parse.Query(DeployedModel);
    const results = await query.find();
    setDeployedModels(results.map(model => ({
      name: model.get('name'),
      version: model.get('version'),
      status: model.get('status'),
      type: model.get('type')
    })));
  }

  const fetchModelPerformance = async () => {
    const ModelPerformance = Parse.Object.extend("ModelPerformance");
    const query = new Parse.Query(ModelPerformance);
    const results = await query.find();
    setModelPerformance(results.map(performance => ({
      name: performance.get('metric'),
      value: performance.get('value')
    })));
  }

  const handleDatasetUpload = async (event) => {
    const file = event.target.files[0];
    const name = file.name;
    const parseFile = new Parse.File(name, file);
    
    const Dataset = Parse.Object.extend("Dataset");
    const dataset = new Dataset();
    
    dataset.set("name", name);
    dataset.set("file", parseFile);
    dataset.set("type", modelType);
    
    try {
      await dataset.save();
      fetchDatasets();
    } catch (error) {
      console.error("Error uploading dataset: ", error);
    }
  }

  const handleStartTraining = async () => {
    // Simulating training progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setTrainingProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        fetchModelPerformance()
      }
    }, 1000)

    // In a real scenario, you would call a Back4App Cloud Function here
    // to start the training process
    // Example:
    // try {
    //   await Parse.Cloud.run("startModelTraining", { modelType, dataset: activeDataset });
    // } catch (error) {
    //   console.error("Error starting training: ", error);
    // }
  }

  const handleModelDeploy = async (modelName, version) => {
    const DeployedModel = Parse.Object.extend("DeployedModel");
    const deployedModel = new DeployedModel();
    
    deployedModel.set("name", modelName);
    deployedModel.set("version", version);
    deployedModel.set("status", "Deployed");
    deployedModel.set("type", modelType);
    
    try {
      await deployedModel.save();
      fetchDeployedModels();
    } catch (error) {
      console.error("Error deploying model: ", error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">AI Training Dashboard</h1>
      <Tabs defaultValue="data-management" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data-management">Data Management</TabsTrigger>
          <TabsTrigger value="model-training">Model Training</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="data-management">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Upload and manage your datasets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="model-type">Model Type</Label>
                  <Select value={modelType} onValueChange={setModelType}>
                    <SelectTrigger id="model-type">
                      <SelectValue placeholder="Select model type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image"><Image className="mr-2 h-4 w-4 inline" />Image</SelectItem>
                      <SelectItem value="text"><Type className="mr-2 h-4 w-4 inline" />Text</SelectItem>
                      <SelectItem value="voice"><Mic className="mr-2 h-4 w-4 inline" />Voice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dataset-upload">Upload Dataset</Label>
                  <Input id="dataset-upload" type="file" onChange={handleDatasetUpload} />
                </div>
                <div>
                  <Label htmlFor="dataset-select">Select Active Dataset</Label>
                  <Select value={activeDataset} onValueChange={setActiveDataset}>
                    <SelectTrigger id="dataset-select">
                      <SelectValue placeholder="Select a dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      {datasets.map((dataset, index) => (
                        <SelectItem key={index} value={dataset}>{dataset}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button><Database className="mr-2 h-4 w-4" /> Manage Datasets</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="model-training">
          <Card>
            <CardHeader>
              <CardTitle>Model Training</CardTitle>
              <CardDescription>Configure and start model training</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="model-architecture">Model Architecture</Label>
                  <Select>
                    <SelectTrigger id="model-architecture">
                      <SelectValue placeholder="Select model architecture" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cnn">Convolutional Neural Network</SelectItem>
                      <SelectItem value="rnn">Recurrent Neural Network</SelectItem>
                      <SelectItem value="transformer">Transformer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="learning-rate">Learning Rate</Label>
                  <Input id="learning-rate" type="number" placeholder="0.001" />
                </div>
                <div>
                  <Label htmlFor="batch-size">Batch Size</Label>
                  <Input id="batch-size" type="number" placeholder="32" />
                </div>
                <div>
                  <Label>Training Progress</Label>
                  <Progress value={trainingProgress} className="w-full" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartTraining}><Brain className="mr-2 h-4 w-4" /> Start Training</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="evaluation">
          <Card>
            <CardHeader>
              <CardTitle>Model Evaluation</CardTitle>
              <CardDescription>View model performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart width={600} height={300} data={modelPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </CardContent>
            <CardFooter>
              <Button><ChartBar className="mr-2 h-4 w-4" /> Generate Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="deployment">
          <Card>
            <CardHeader>
              <CardTitle>Model Deployment</CardTitle>
              <CardDescription>Deploy and manage your models</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deployedModels.map((model, index) => (
                    <TableRow key={index}>
                      <TableCell>{model.name}</TableCell>
                      <TableCell>{model.version}</TableCell>
                      <TableCell>{model.type}</TableCell>
                      <TableCell>{model.status}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleModelDeploy(model.name, model.version)}>
                          {model.status === 'Deployed' ? 'Update' : 'Deploy'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button><Rocket className="mr-2 h-4 w-4" /> Manage Deployments</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Model Monitoring</CardTitle>
              <CardDescription>Monitor model performance and system health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Model Performance Over Time</Label>
                  {/* Placeholder for a line chart showing model performance trends */}
                  <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                    Performance Trend Chart (Integration with Back4App Analytics needed)
                  </div>
                </div>
                <div>
                  <Label>System Resource Usage</Label>
                  {/* Placeholder for system resource usage metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-semibold">CPU Usage</p>
                      <p>65%</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-semibold">Memory Usage</p>
                      <p>78%</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded">
                      <p className="font-semibold">GPU Usage</p>
                      <p>92%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button><Activity className="mr-2 h-4 w-4" /> View Detailed Metrics</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
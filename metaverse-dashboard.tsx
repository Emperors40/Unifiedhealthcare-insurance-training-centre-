'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Globe, Brain, Zap, Database, Activity } from 'lucide-react'

export default function MetaverseDashboard() {
  const [activeEnvironments, setActiveEnvironments] = useState([])
  const [knowledgeGrowth, setKnowledgeGrowth] = useState([])
  const [computeUsage, setComputeUsage] = useState([])
  const [activeAgents, setActiveAgents] = useState([])

  useEffect(() => {
    // Simulated data fetching
    fetchActiveEnvironments()
    fetchKnowledgeGrowth()
    fetchComputeUsage()
    fetchActiveAgents()
  }, [])

  const fetchActiveEnvironments = () => {
    // Simulated API call
    setActiveEnvironments([
      { id: 1, name: 'Urban Planning Simulation', agents: 50, uptime: '3d 7h' },
      { id: 2, name: 'Climate Model', agents: 75, uptime: '5d 12h' },
      { id: 3, name: 'Financial Market Simulation', agents: 100, uptime: '2d 3h' },
    ])
  }

  const fetchKnowledgeGrowth = () => {
    // Simulated API call
    setKnowledgeGrowth([
      { date: '2023-01-01', knowledge: 1000 },
      { date: '2023-02-01', knowledge: 1200 },
      { date: '2023-03-01', knowledge: 1500 },
      { date: '2023-04-01', knowledge: 1800 },
      { date: '2023-05-01', knowledge: 2200 },
    ])
  }

  const fetchComputeUsage = () => {
    // Simulated API call
    setComputeUsage([
      { date: '2023-01-01', usage: 5000 },
      { date: '2023-02-01', usage: 5500 },
      { date: '2023-03-01', usage: 6000 },
      { date: '2023-04-01', usage: 7000 },
      { date: '2023-05-01', usage: 7500 },
    ])
  }

  const fetchActiveAgents = () => {
    // Simulated API call
    setActiveAgents([
      { id: 1, name: 'Data Collector', type: 'Gatherer', environment: 'Urban Planning', status: 'Active' },
      { id: 2, name: 'Market Analyzer', type: 'Processor', environment: 'Financial Market', status: 'Learning' },
      { id: 3, name: 'Climate Predictor', type: 'Forecaster', environment: 'Climate Model', status: 'Idle' },
    ])
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">AI Metaverse Training Dashboard</h1>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="environments">Environments</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Environments</CardTitle>
                <CardDescription>Currently running simulations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{activeEnvironments.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Active Agents</CardTitle>
                <CardDescription>AI agents learning and evolving</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {activeEnvironments.reduce((sum, env) => sum + env.agents, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Growth</CardTitle>
                <CardDescription>Cumulative knowledge acquisition</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={knowledgeGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="knowledge" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Compute Usage</CardTitle>
                <CardDescription>Total compute resources utilized</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={computeUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="usage" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="environments">
          <Card>
            <CardHeader>
              <CardTitle>Active Metaverse Environments</CardTitle>
              <CardDescription>Manage and monitor running simulations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Environment Name</TableHead>
                    <TableHead>Active Agents</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeEnvironments.map((env) => (
                    <TableRow key={env.id}>
                      <TableCell>{env.name}</TableCell>
                      <TableCell>{env.agents}</TableCell>
                      <TableCell>{env.uptime}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button><Globe className="mr-2 h-4 w-4" /> Create New Environment</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="agents">
          <Card>
            <CardHeader>
              <CardTitle>Active AI Agents</CardTitle>
              <CardDescription>Monitor and control AI agents in the metaverse</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>{agent.name}</TableCell>
                      <TableCell>{agent.type}</TableCell>
                      <TableCell>{agent.environment}</TableCell>
                      <TableCell>{agent.status}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button><Brain className="mr-2 h-4 w-4" /> Deploy New Agent</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Acquisition Rate</CardTitle>
                <CardDescription>Rate of new information learned by agents</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={knowledgeGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="knowledge" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Compute Efficiency</CardTitle>
                <CardDescription>Knowledge gained per unit of compute</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={computeUsage.map((item, index) => ({
                    ...item,
                    efficiency: knowledgeGrowth[index] ? knowledgeGrowth[index].knowledge / item.usage : 0
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="efficiency" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
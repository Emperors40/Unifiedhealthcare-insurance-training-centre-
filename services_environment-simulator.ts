import { v4 as uuidv4 } from 'uuid';
import { Environment, Agent, Task } from '../types';
import { errorHandler } from './error-handler';
import { taskManager } from './task-manager';
import { environmentMonitor } from './task-manager';

class EnvironmentSimulator {
  private environments: Environment[] = [];

  createEnvironment(name: string, type: string, initialCapacity: number): Environment {
    const newEnvironment: Environment = {
      id: uuidv4(),
      name,
      type,
      capacity: initialCapacity,
      agents: [],
      tasks: [],
      connections: [],
      status: 'initializing',
    };

    this.environments.push(newEnvironment);
    return newEnvironment;
  }

  addAgentToEnvironment(environmentId: string, agent: Agent): void {
    const environment = this.getEnvironmentById(environmentId);
    if (environment) {
      environment.agents.push(agent);
    }
  }

  removeAgentFromEnvironment(environmentId: string, agentId: string): void {
    const environment = this.getEnvironmentById(environmentId);
    if (environment) {
      environment.agents = environment.agents.filter(a => a.id !== agentId);
    }
  }

  createTask(environmentId: string, description: string, type: string): Task {
    const environment = this.getEnvironmentById(environmentId);
    if (environment) {
      const newTask = taskManager.createTask(description, type, environmentId);
      environment.tasks.push(newTask);
      return newTask;
    }
    throw new Error(`Environment with id ${environmentId} not found`);
  }

  assignTaskToAgent(environmentId: string, taskId: string, agentId: string): void {
    const environment = this.getEnvironmentById(environmentId);
    if (environment) {
      const task = environment.tasks.find(t => t.id === taskId);
      const agent = environment.agents.find(a => a.id === agentId);
      if (task && agent) {
        const updatedTask = taskManager.assignTask(task, agent);
        environment.tasks = environment.tasks.map(t => t.id === taskId ? updatedTask : t);
      }
    }
  }

  simulateEnvironment(environmentId: string, duration: number): void {
    const environment = this.getEnvironmentById(environmentId);
    if (environment) {
      let time = 0;
      const interval = setInterval(() => {
        this.updateEnvironment(environment);
        time += 1;
        if (time >= duration) {
          clearInterval(interval);
          errorHandler.logInfo(`Simulation completed for environment ${environmentId}`);
        }
      }, 1000); // Update every second
    }
  }

  private updateEnvironment(environment: Environment): void {
    // Simulate agent actions
    for (const agent of environment.agents) {
      if (agent.status === 'idle' && environment.tasks.some(t => t.status === 'unassigned')) {
        const unassignedTask = environment.tasks.find(t => t.status === 'unassigned');
        if (unassignedTask) {
          this.assignTaskToAgent(environment.id, unassignedTask.id, agent.id);
        }
      }
    }

    // Simulate task completion
    for (const task of environment.tasks) {
      if (task.status === 'assigned' && Math.random() < 0.1) { // 10% chance of completion each update
        const completedTask = taskManager.completeTask(task);
        environment.tasks = environment.tasks.map(t => t.id === completedTask.id ? completedTask : t);
      }
    }

    // Monitor environment health
    const monitoringResult = environmentMonitor.monitorEnvironment(environment);
    environment.status = monitoringResult.status;

    // Scale environment if needed
    if (monitoringResult.status === 'overloaded') {
      this.scaleEnvironment(environment);
    }
  }

  private scaleEnvironment(environment: Environment): void {
    environment.capacity = Math.ceil(environment.capacity * 1.5);
    errorHandler.logInfo(`Scaled environment ${environment.id}`, { newCapacity: environment.capacity });
  }

  private getEnvironmentById(id: string): Environment | undefined {
    return this.environments.find(env => env.id === id);
  }
}

export const environmentSimulator = new EnvironmentSimulator();
import { v4 as uuidv4 } from 'uuid';
import { Task, Agent, Environment } from '../types';

class TaskManager {
  createTask(description: string, type: string, environmentId: string): Task {
    return {
      id: uuidv4(),
      description,
      type,
      environmentId,
      status: 'unassigned',
      createdAt: new Date(),
      assignedAgentId: null,
      completedAt: null,
    };
  }

  assignTask(task: Task, agent: Agent): Task {
    return {
      ...task,
      status: 'assigned',
      assignedAgentId: agent.id,
    };
  }

  completeTask(task: Task): Task {
    return {
      ...task,
      status: 'completed',
      completedAt: new Date(),
    };
  }
}

export const taskManager = new TaskManager();

class EnvironmentMonitor {
  monitorEnvironment(environment: Environment): { status: string; metrics: Record<string, number> } {
    // Simulate monitoring logic
    const cpuUsage = Math.random() * 100;
    const memoryUsage = Math.random() * 100;
    const networkLatency = Math.random() * 1000;

    return {
      status: cpuUsage > 90 ? 'overloaded' : 'normal',
      metrics: {
        cpuUsage,
        memoryUsage,
        networkLatency,
      },
    };
  }
}

export const environmentMonitor = new EnvironmentMonitor();

class PerformanceEvaluator {
  evaluateAgentPerformance(agent: Agent, completedTasks: Task[]): { score: number; metrics: Record<string, number> } {
    const taskCompletionRate = completedTasks.length / agent.assignedTasks.length;
    const averageCompletionTime = completedTasks.reduce((sum, task) => {
      return sum + (task.completedAt!.getTime() - task.createdAt.getTime());
    }, 0) / completedTasks.length;

    return {
      score: taskCompletionRate * 100,
      metrics: {
        taskCompletionRate,
        averageCompletionTime,
      },
    };
  }
}

export const performanceEvaluator = new PerformanceEvaluator();
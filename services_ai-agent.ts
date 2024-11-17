import { Agent, Task, KnowledgeBase, Environment } from '../types';
import { errorHandler } from './error-handler';
import { aiImprovementService } from './ai-improvement-service';
import { knowledgeMerger } from './knowledge-merger';

class AIAgent {
  private agent: Agent;

  constructor(agent: Agent) {
    this.agent = agent;
  }

  async performTask(task: Task, environment: Environment): Promise<void> {
    try {
      errorHandler.logInfo(`Agent ${this.agent.id} starting task ${task.id}`);

      // Simulate task execution
      await new Promise(resolve => setTimeout(resolve, Math.random() * 5000));

      // Update agent's knowledge based on task
      this.agent.knowledgeBase = this.learnFromTask(task);

      // Improve agent's capabilities
      this.agent = await aiImprovementService.improveAgent(this.agent);

      errorHandler.logInfo(`Agent ${this.agent.id} completed task ${task.id}`);
    } catch (error) {
      errorHandler.logError(error as Error, { agentId: this.agent.id, taskId: task.id });
    }
  }

  async collaborateWithAgents(agents: AIAgent[]): Promise<void> {
    try {
      const knowledgeBases = agents.map(agent => agent.getKnowledgeBase());
      const mergedKnowledge = knowledgeMerger.mergeKnowledgeBases([this.agent.knowledgeBase, ...knowledgeBases]);

      this.agent.knowledgeBase = mergedKnowledge;

      errorHandler.logInfo(`Agent ${this.agent.id} collaborated with ${agents.length} agents`);
    } catch (error) {
      errorHandler.logError(error as Error, { agentId: this.agent.id });
    }
  }

  async selfImprove(): Promise<void> {
    try {
      this.agent = await aiImprovementService.improveAgent(this.agent);
      errorHandler.logInfo(`Agent ${this.agent.id} self-improved`);
    } catch (error) {
      errorHandler.logError(error as Error, { agentId: this.agent.id });
    }
  }

  getKnowledgeBase(): KnowledgeBase {
    return this.agent.knowledgeBase;
  }

  private learnFromTask(task: Task): KnowledgeBase {
    // Simulate learning from task
    const updatedKnowledge = { ...this.agent.knowledgeBase };
    updatedKnowledge[task.type] = (updatedKnowledge[task.type] || 0) + 1;
    return updatedKnowledge;
  }
}

export class AIAgentFactory {
  static createAgent(type: string, initialKnowledge: KnowledgeBase): AIAgent {
    const agent: Agent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      knowledgeBase: initialKnowledge,
      capabilities: [],
      performance: { taskCompletionRate: 0, averageCompletionTime: 0 },
      status: 'idle',
      assignedTasks: [],
      version: 1,
    };
    return new AIAgent(agent);
  }
}
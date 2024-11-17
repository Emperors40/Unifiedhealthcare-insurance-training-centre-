import { KnowledgeBase } from '../types';

class KnowledgeMerger {
  mergeKnowledgeBases(knowledgeBases: KnowledgeBase[]): KnowledgeBase {
    const mergedKnowledge: KnowledgeBase = {};

    for (const kb of knowledgeBases) {
      for (const [key, value] of Object.entries(kb)) {
        if (key in mergedKnowledge) {
          if (typeof value === 'number' && typeof mergedKnowledge[key] === 'number') {
            mergedKnowledge[key] = (mergedKnowledge[key] as number + value) / 2;
          } else {
            mergedKnowledge[key] = value;
          }
        } else {
          mergedKnowledge[key] = value;
        }
      }
    }

    return mergedKnowledge;
  }
}

export const knowledgeMerger = new KnowledgeMerger();
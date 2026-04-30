import { describe, expect, it } from 'vitest';
import {
  generateCrossClassificationTask,
  generateDiscriminatingRelationshipsTask,
  generateDiscriminationTask,
  generateGeneralizationTask,
  generateRecognizingRelationshipsTask,
  generateSystemConstructionTask
} from '../src/generators';

const gens = [
  generateGeneralizationTask,
  generateDiscriminationTask,
  generateCrossClassificationTask,
  generateRecognizingRelationshipsTask,
  generateDiscriminatingRelationshipsTask,
  generateSystemConstructionTask
];

describe('task generators', () => {
  gens.forEach((gen) => {
    it(`${gen.name} validity`, () => {
      const t = gen(42, 7, 'visual');
      expect(t.correctAnswer).toBeTruthy();
      expect(t.answerOptions).toContain(t.correctAnswer);
      expect(t.explanation.length).toBeGreaterThan(5);
      expect(t.difficultyParams.requestedDifficulty).toBe(7);
      expect(new Set(t.answerOptions).size).toBe(t.answerOptions.length);
    });
  });
});

import type { Mode, Task } from '../types/task';
import { createTask } from './base';

export const generateGeneralizationTask = (seed: number, difficulty: number, mode?: Mode): Task =>
  createTask('generalization', seed, difficulty, mode, 'group by shared feature');
export const generateDiscriminationTask = (seed: number, difficulty: number, mode?: Mode): Task =>
  createTask('discrimination', seed, difficulty, mode, 'separate by critical feature');
export const generateCrossClassificationTask = (seed: number, difficulty: number, mode?: Mode): Task =>
  createTask('crossClassification', seed, difficulty, mode, 'classify by two independent dimensions');
export const generateRecognizingRelationshipsTask = (seed: number, difficulty: number, mode?: Mode): Task =>
  createTask('recognizingRelationships', seed, difficulty, mode, 'identify relation pattern A→B');
export const generateDiscriminatingRelationshipsTask = (seed: number, difficulty: number, mode?: Mode): Task =>
  createTask('discriminatingRelationships', seed, difficulty, mode, 'separate valid vs invalid relations');
export const generateSystemConstructionTask = (seed: number, difficulty: number, mode?: Mode): Task =>
  createTask('systemConstruction', seed, difficulty, mode, 'compose multi-rule system');

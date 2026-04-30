export type Operation =
  | 'generalization'
  | 'discrimination'
  | 'crossClassification'
  | 'recognizingRelationships'
  | 'discriminatingRelationships'
  | 'systemConstruction';

export type Mode = 'visual' | 'symbolic' | 'numeric';

export interface DifficultyParams {
  requestedDifficulty: number;
  distractorCount: number;
  featureCount: number;
  relationDepth: number;
}

export interface Stimulus {
  id: string;
  label: string;
  svg: string;
  attrs: Record<string, string | number>;
}

export interface Task {
  id: string;
  seed: number;
  operation: Operation;
  difficulty: number;
  prompt: string;
  stimuli: Stimulus[];
  answerOptions: string[];
  correctAnswer: string;
  ruleDescription: string;
  explanation: string;
  difficultyParams: DifficultyParams;
  mode: Mode;
}

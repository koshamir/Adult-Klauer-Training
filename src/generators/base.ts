import type { DifficultyParams, Mode, Operation, Stimulus, Task } from '../types/task';
import { mulberry32, pick, uniqueOptions } from '../utils/rng';

const mkSvg = (shape: string, color: string) => `<svg width='80' height='80'><${shape} cx='40' cy='40' r='22' width='44' height='44' fill='${color}' /></svg>`;
const colors = ['#ef4444', '#3b82f6', '#10b981', '#eab308'];
const shapes = ['circle', 'rect'];

export const createTask = (operation: Operation, seed: number, difficulty: number, mode: Mode = 'symbolic', rule: string): Task => {
  const rng = mulberry32(seed + difficulty + operation.length);
  const targetColor = pick(rng, colors);
  const targetShape = pick(rng, shapes);
  const featureCount = Math.min(2 + Math.floor(difficulty / 3), 5);
  const distractorCount = Math.min(2 + Math.floor(difficulty / 2), 6);
  const relationDepth = Math.min(1 + Math.floor(difficulty / 4), 3);
  const stimuli: Stimulus[] = Array.from({ length: 4 }, (_, i) => ({
    id: `${operation}-${i}`,
    label: `${targetColor}-${targetShape}-${i}`,
    svg: mkSvg(targetShape, i % 2 === 0 ? targetColor : pick(rng, colors)),
    attrs: { targetColor, targetShape, i }
  }));
  const correctAnswer = `${rule} (${targetColor}/${targetShape})`;
  const answerOptions = uniqueOptions(correctAnswer, [
    `ignore color (${targetShape})`,
    `ignore shape (${targetColor})`,
    `random pairing`
  ]);
  const difficultyParams: DifficultyParams = { requestedDifficulty: difficulty, distractorCount, featureCount, relationDepth };

  return {
    id: `${operation}-${seed}-${difficulty}`,
    seed,
    operation,
    difficulty,
    prompt: `Identify the best rule for ${operation} at level ${difficulty}.`,
    stimuli,
    answerOptions,
    correctAnswer,
    ruleDescription: rule,
    explanation: `Relevant signal is ${rule}. Distractors rise with level ${difficulty}.`,
    difficultyParams,
    mode
  };
};

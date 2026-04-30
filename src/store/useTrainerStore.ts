import { create } from 'zustand';
import type { Mode, Operation, Task } from '../types/task';
import {
  generateCrossClassificationTask,
  generateDiscriminatingRelationshipsTask,
  generateDiscriminationTask,
  generateGeneralizationTask,
  generateRecognizingRelationshipsTask,
  generateSystemConstructionTask
} from '../generators';

const ops: Operation[] = ['generalization','discrimination','crossClassification','recognizingRelationships','discriminatingRelationships','systemConstruction'];
type TrainingMode = 'single' | 'mixed' | 'weakness' | 'expert';

interface HistoryItem { taskId: string; operation: Operation; correct: boolean; responseTimeMs: number; }
interface RuleJournal { relevantFeature: string; relevantRelation: string; temptingRule: string; notes?: string; }

interface State {
  mode: TrainingMode; selectedOperation: Operation; ability: Record<Operation, number>; currentTask: Task | null;
  history: HistoryItem[]; explanation: string; journal: RuleJournal | null;
  nextTask: () => void; submit: (ans: string, ms: number) => void; setMode: (m: TrainingMode)=>void; setJournal:(j:RuleJournal)=>void;
}

const genByOp = {
  generalization: generateGeneralizationTask,
  discrimination: generateDiscriminationTask,
  crossClassification: generateCrossClassificationTask,
  recognizingRelationships: generateRecognizingRelationshipsTask,
  discriminatingRelationships: generateDiscriminatingRelationshipsTask,
  systemConstruction: generateSystemConstructionTask
};

const pickOperation = (mode: TrainingMode, ability: Record<Operation, number>, selected: Operation) => {
  if (mode === 'single') return selected;
  if (mode === 'mixed') return ops[Math.floor(Math.random() * ops.length)];
  if (mode === 'weakness') return [...ops].sort((a,b)=>ability[a]-ability[b])[0];
  return ops[Math.floor(Math.random() * ops.length)];
};

const load = <T,>(k: string, fb: T) => JSON.parse(localStorage.getItem(k) || 'null') ?? fb;

export const useTrainerStore = create<State>((set,get)=>({
  mode: 'mixed',
  selectedOperation: 'generalization',
  ability: load('ability', Object.fromEntries(ops.map(o=>[o,5])) as Record<Operation,number>),
  currentTask: null,
  history: load('history', []),
  explanation: '',
  journal: null,
  setMode: (mode)=>set({mode}),
  setJournal: (journal)=>{ localStorage.setItem('journal', JSON.stringify(journal)); set({journal});},
  nextTask: ()=>{
    const {mode, ability, selectedOperation} = get();
    const op = pickOperation(mode, ability, selectedOperation);
    const difficulty = Math.max(1, Math.min(10, Math.round(ability[op])));
    const seed = Date.now() % 100000;
    const task = genByOp[op](seed, difficulty, 'visual' as Mode);
    set({ currentTask: task, explanation: '' });
  },
  submit: (ans, responseTimeMs)=>{
    const {currentTask, ability, history} = get(); if (!currentTask) return;
    const correct = ans === currentTask.correctAnswer;
    const delta = correct ? 0.6 : -0.4;
    const nextAbility = {...ability, [currentTask.operation]: Math.max(1, Math.min(10, ability[currentTask.operation] + delta))};
    localStorage.setItem('ability', JSON.stringify(nextAbility));
    const nextHistory = [...history, {taskId: currentTask.id, operation: currentTask.operation, correct, responseTimeMs}];
    localStorage.setItem('history', JSON.stringify(nextHistory));
    set({ability: nextAbility, history: nextHistory, explanation: currentTask.explanation});
  }
}));

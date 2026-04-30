import { useEffect, useState } from 'react';
import { useTrainerStore } from '../store/useTrainerStore';

export default function App() {
  const { mode, setMode, currentTask, nextTask, submit, explanation, ability, setJournal } = useTrainerStore();
  const [answer, setAnswer] = useState('');
  useEffect(() => { if (!currentTask) nextTask(); }, [currentTask, nextTask]);
  if (!currentTask) return <div className='p-4'>Loading…</div>;

  return <div className='max-w-5xl mx-auto p-4 space-y-4'>
    <h1 className='text-3xl font-bold'>Adult Klauer Trainer</h1>
    <div className='flex gap-2'>
      {(['single','mixed','weakness','expert'] as const).map(m=><button key={m} className='px-3 py-1 border rounded' onClick={()=>setMode(m)}>{m}{mode===m?' ✓':''}</button>)}
    </div>
    <div className='p-4 border rounded'>
      <p>{currentTask.prompt}</p>
      <div className='grid grid-cols-2 gap-2 mt-2'>{currentTask.stimuli.map(s=><div key={s.id} className='border p-2'><div dangerouslySetInnerHTML={{__html:s.svg}} /><small>{s.label}</small></div>)}</div>
      <div className='mt-3 space-y-2'>{currentTask.answerOptions.map(o=><label key={o} className='block'><input type='radio' checked={answer===o} onChange={()=>setAnswer(o)} /> {o}</label>)}</div>
      <div className='mt-3 flex gap-2'>
        <button className='px-3 py-1 bg-blue-600 text-white rounded' onClick={()=>submit(answer, 1000)}>Отправить</button>
        <button className='px-3 py-1 border rounded' onClick={()=>{setAnswer(''); nextTask();}}>Следующее</button>
      </div>
      {explanation && <p className='mt-2 text-sm'>{explanation}</p>}
    </div>
    <div className='p-4 border rounded'>
      <h2 className='font-semibold'>Rule Journal</h2>
      <input className='border p-1 w-full' placeholder='Какой признак релевантен?' onBlur={(e)=>setJournal({relevantFeature:e.target.value,relevantRelation:'',temptingRule:''})} />
    </div>
    <div className='p-4 border rounded'>
      {Object.entries(ability).map(([k,v])=><div key={k}>{k}: {v.toFixed(1)}</div>)}
    </div>
  </div>;
}

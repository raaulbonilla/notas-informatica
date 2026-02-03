
import React, { useState, useEffect } from 'react';
import { SUBJECTS, STORAGE_KEY, APP_CONFIG } from './constants';
import { State } from './types';
import SubjectCard from './components/SubjectCard';

const App: React.FC = () => {
  const [gradesState, setGradesState] = useState<State>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let parsedSaved: State = {};
    if (saved) {
      try {
        parsedSaved = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse grades", e);
      }
    }

    const initialState: State = {};
    SUBJECTS.forEach(s => {
      initialState[s.id] = {};
      s.parts.forEach(p => {
        initialState[s.id][p.id] = (parsedSaved[s.id] && parsedSaved[s.id][p.id] !== undefined) 
          ? parsedSaved[s.id][p.id] 
          : null;
      });
    });
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gradesState));
  }, [gradesState]);

  const handleGradeUpdate = (subjectId: string, partId: string, value: number | null) => {
    if (value !== null && (value > 10 || value < 0)) {
      return;
    }

    setGradesState(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [partId]: value
      }
    }));
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden px-8 py-8 md:px-16 md:py-10">
      <header className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black uppercase leading-none">
            {APP_CONFIG.title}
          </h1>
          <p className="text-[11px] text-gray-400 uppercase tracking-[0.3em] font-medium mt-2">
            {APP_CONFIG.subtitle}
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 bg-[#e6f4ea] border border-[#ceead6] px-5 py-2 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-[#34a853]"></div>
          <span className="text-[10px] font-bold text-[#137333] uppercase tracking-wide">
            AUTOSAVE ACTIVADO
          </span>
        </div>
      </header>

      <main className="flex-grow flex flex-col gap-4 overflow-hidden">
        {SUBJECTS.map(subject => (
          <div key={subject.id} className="flex-1 min-h-0">
            <SubjectCard
              subject={subject}
              grades={gradesState[subject.id]}
              onGradeChange={(partId, val) => handleGradeUpdate(subject.id, partId, val)}
            />
          </div>
        ))}
      </main>
    </div>
  );
};

export default App;

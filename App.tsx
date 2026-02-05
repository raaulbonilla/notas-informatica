import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SUBJECTS, STORAGE_KEY, APP_CONFIG } from './constants';
import { State } from './types';
import SubjectCard from './components/SubjectCard';
import MobileSubjectRow from './components/MobileSubjectRow';
import GradeModal from './components/GradeModal';

const App: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  
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

  const selectedSubject = SUBJECTS.find(s => s.id === selectedSubjectId);

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden px-6 py-8 md:px-16 md:py-10">
      <header className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-black uppercase leading-none">
            {APP_CONFIG.title}
          </h1>
          <p className="text-[10px] md:text-[11px] text-gray-400 uppercase tracking-[0.3em] font-medium mt-2">
            {APP_CONFIG.subtitle}
          </p>
        </div>
        
        <div className="hidden sm:flex items-center gap-2.5 bg-[#e6f4ea] border border-[#ceead6] px-5 py-2 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-[#34a853]"></div>
          <span className="text-[10px] font-bold text-[#137333] uppercase tracking-wide">
            LOCAL-SAVE ACTIVADO
          </span>
        </div>
      </header>

      <main className="hidden md:flex flex-grow flex-col gap-4 overflow-hidden">
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

      <main className="md:hidden flex-grow overflow-y-auto no-scrollbar pb-10">
        {SUBJECTS.map(subject => (
          <MobileSubjectRow
            key={subject.id}
            subject={subject}
            grades={gradesState[subject.id]}
            onClick={() => setSelectedSubjectId(subject.id)}
          />
        ))}
      </main>

      {selectedSubject && (
        <GradeModal
          subject={selectedSubject}
          grades={gradesState[selectedSubject.id]}
          onGradeChange={(partId, val) => handleGradeUpdate(selectedSubject.id, partId, val)}
          onClose={() => setSelectedSubjectId(null)}
        />
      )}
      <Analytics />
    </div>
  );
};

export default App;
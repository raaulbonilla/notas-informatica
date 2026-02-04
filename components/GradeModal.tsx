
import React from 'react';
import { Subject, SubjectGrades } from '../types';

interface GradeModalProps {
  subject: Subject;
  grades: SubjectGrades;
  onGradeChange: (partId: string, value: number | null) => void;
  onClose: () => void;
}

const GradeModal: React.FC<GradeModalProps> = ({ subject, grades, onGradeChange, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tighter uppercase">{subject.id}</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Introducir Notas</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          {subject.groups.map(group => {
            const groupParts = subject.parts.filter(p => p.groupId === group.id);
            return (
              <div key={group.id} className="mb-8 last:mb-0">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">{group.name}</span>
                  <div className="h-px flex-grow bg-gray-50"></div>
                </div>
                
                <div className="space-y-4">
                  {groupParts.map(part => {
                    const grade = grades[part.id];
                    const displayMin = part.minGrade ?? (groupParts.length === 1 && group.minGrade > 0 ? group.minGrade : null);
                    
                    return (
                      <div key={part.id} className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">{part.name}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gray-400 font-medium">Peso: {Math.round((part.weight * group.weight) * 100)}%</span>
                            {displayMin && (
                              <span className="text-[9px] text-[#c5221f] font-bold">MIN {displayMin}</span>
                            )}
                          </div>
                        </div>
                        
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={grade ?? ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? null : parseFloat(e.target.value);
                            onGradeChange(part.id, val);
                          }}
                          placeholder="-"
                          className="w-20 h-12 text-center text-xl font-bold bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-2xl outline-none transition-all"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="p-6 bg-gray-50">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-black text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg active:scale-[0.98] transition-all"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeModal;

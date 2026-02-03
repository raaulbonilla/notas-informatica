
import React from 'react';
import { Subject, SubjectGrades, SubjectStatus } from '../types';

interface SubjectCardProps {
  subject: Subject;
  grades: SubjectGrades;
  onGradeChange: (partId: string, value: number | null) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, grades, onGradeChange }) => {
  const calculateResults = () => {
    let finalTotal = 0;
    let hasFailedMin = false;
    let anyData = false;

    const groupResults = subject.groups.map(group => {
      let groupSum = 0;
      let groupHasData = false;
      const groupParts = subject.parts.filter(p => p.groupId === group.id);
      
      groupParts.forEach(part => {
        const grade = grades[part.id];
        if (grade !== null && grade !== undefined) {
          anyData = true;
          groupHasData = true;
          groupSum += grade * part.weight;
          
          if (part.minGrade !== undefined && grade < part.minGrade) {
            hasFailedMin = true;
          }
        }
      });

      if (groupHasData && groupSum < group.minGrade) {
        hasFailedMin = true;
      }

      return { 
        id: group.id, 
        grade: groupSum, 
        hasData: groupHasData,
        minMet: groupSum >= group.minGrade
      };
    });

    subject.groups.forEach(group => {
      const result = groupResults.find(r => r.id === group.id);
      if (!result || !result.hasData) return;

      let canSum = true;
      if (group.dependsOnGroupId) {
        const dependency = groupResults.find(r => r.id === group.dependsOnGroupId);
        if (dependency && !dependency.minMet) {
          canSum = false;
        }
      }

      if (canSum) {
        finalTotal += result.grade * group.weight;
      }
    });

    if (!anyData) {
      return { status: SubjectStatus.MISSING, total: 0, anyData: false };
    }
    
    const finalGrade = parseFloat(finalTotal.toFixed(2));
    const isPassing = finalGrade >= 5 && !hasFailedMin;

    return { 
      status: isPassing ? SubjectStatus.PASSED : SubjectStatus.FAILED, 
      total: finalGrade, 
      anyData: true 
    };
  };

  const { status, total, anyData } = calculateResults();

  const getStatusStyles = () => {
    if (!anyData) return { bg: 'bg-gray-50', text: 'text-gray-200', label: 'text-gray-200' };
    switch (status) {
      case SubjectStatus.PASSED:
        return { bg: 'bg-[#e6f4ea]', text: 'text-[#137333]', label: 'text-[#137333]' };
      case SubjectStatus.FAILED:
        return { bg: 'bg-[#fce8e6]', text: 'text-[#c5221f]', label: 'text-[#c5221f]' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-300', label: 'text-gray-300' };
    }
  };

  const styles = getStatusStyles();

  return (
    <div className="flex flex-row h-full items-center border border-gray-100 rounded-[2.5rem] bg-white group hover:border-gray-200 transition-all duration-300 overflow-hidden">
      
      <div className="w-[14%] h-full flex flex-col items-center justify-center border-r border-gray-50 px-4 text-center shrink-0 bg-white">
        <h2 className="text-4xl font-bold uppercase tracking-tighter text-black leading-none mb-1.5">
          {subject.id}
        </h2>
        <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-tight leading-[1.1] max-w-full">
          {subject.name.split(' - ')[1] || subject.name}
        </p>
        {subject.docUrl && (
          <a 
            href={subject.docUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:bg-black hover:text-white text-gray-400 transition-all duration-200"
            title="Ver Ficha 12A"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </a>
        )}
      </div>

      <div className="flex-grow h-full flex items-center justify-start gap-12 px-10 overflow-x-auto no-scrollbar">
        {subject.groups.map(group => {
          const groupParts = subject.parts.filter(p => p.groupId === group.id);
          
          return (
            <div key={group.id} className="flex gap-8 shrink-0 items-center">
              {groupParts.map(part => {
                const grade = grades[part.id];
                const displayMin = part.minGrade ?? (groupParts.length === 1 && group.minGrade > 0 ? group.minGrade : null);
                const isBelowMin = grade !== null && displayMin !== null && grade < displayMin;

                return (
                  <div key={part.id} className="flex flex-col items-center w-24">
                    <div className="flex flex-col items-center mb-2.5 h-10 justify-end">
                      <span className="text-[10px] text-gray-500 font-bold uppercase whitespace-nowrap tracking-wide leading-none text-center">
                        {part.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] text-gray-300 font-medium">
                          {Math.round((part.weight * group.weight) * 100)}%
                        </span>
                        {displayMin && displayMin > 0 && (
                          <span className="text-[8px] px-1 py-0.5 bg-gray-50 text-gray-400 border border-gray-100 rounded font-bold uppercase tracking-tighter">
                            min {displayMin}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <input
                      id={`${subject.id}-${part.id}`}
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
                      className={`
                        w-full h-14 text-center text-3xl font-semibold border-2 rounded-[1.2rem] outline-none transition-all placeholder:text-gray-200
                        ${isBelowMin 
                          ? 'bg-[#fce8e6] border-[#f1c4c2] text-[#c5221f] focus:bg-white focus:border-[#c5221f]' 
                          : 'bg-gray-50 border-gray-50 text-black focus:bg-white focus:border-black'
                        }
                      `}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className={`w-[16%] h-full flex items-center justify-center border-l border-gray-50 transition-colors duration-700 shrink-0 ${styles.bg}`}>
        <div className="flex flex-col items-center text-center">
          <span className={`text-6xl font-semibold tabular-nums tracking-tighter leading-none mb-1 transition-colors duration-700 ${styles.text}`}>
            {anyData ? total.toFixed(1) : '--'}
          </span>
          <span className={`text-[11px] font-bold tracking-[0.1em] uppercase transition-colors duration-700 ${styles.label}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;

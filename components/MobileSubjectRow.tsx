import React from 'react';
import { Subject, SubjectGrades, SubjectStatus } from '../types';

interface MobileSubjectRowProps {
  subject: Subject;
  grades: SubjectGrades;
  onClick: () => void;
}

const MobileSubjectRow: React.FC<MobileSubjectRowProps> = ({ subject, grades, onClick }) => {
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
          if (part.minGrade !== undefined && grade < part.minGrade) hasFailedMin = true;
        }
      });

      if (groupHasData && groupSum < group.minGrade) hasFailedMin = true;

      return { id: group.id, grade: groupSum, hasData: groupHasData, minMet: groupSum >= group.minGrade };
    });

    subject.groups.forEach(group => {
      const result = groupResults.find(r => r.id === group.id);
      if (!result || !result.hasData) return;
      let canSum = true;
      if (group.dependsOnGroupId) {
        const dependency = groupResults.find(r => r.id === group.dependsOnGroupId);
        if (dependency && !dependency.minMet) canSum = false;
      }
      if (canSum) finalTotal += result.grade * group.weight;
    });

    if (!anyData) return { status: SubjectStatus.MISSING, total: 0, anyData: false };
    const finalGrade = parseFloat(finalTotal.toFixed(2));
    const isPassing = finalGrade >= 5 && !hasFailedMin;
    return { status: isPassing ? SubjectStatus.PASSED : SubjectStatus.FAILED, total: finalGrade, anyData: true };
  };

  const { status, total, anyData } = calculateResults();

  const getStatusStyles = () => {
    if (!anyData) return { bg: 'bg-gray-50', border: 'border-gray-100', text: 'text-gray-400', grade: 'text-gray-300' };
    if (status === SubjectStatus.PASSED) return { bg: 'bg-[#e6f4ea]', border: 'border-[#ceead6]', text: 'text-[#137333]', grade: 'text-[#137333]' };
    return { bg: 'bg-[#fce8e6]', border: 'border-[#f1c4c2]', text: 'text-[#c5221f]', grade: 'text-[#c5221f]' };
  };

  const styles = getStatusStyles();

  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all active:scale-[0.98] ${styles.bg} ${styles.border} mb-3`}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tighter text-black uppercase">{subject.id}</span>
        </div>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide opacity-70">
          {subject.name.split(' - ')[1] || subject.name}
        </span>
      </div>

      <div className="flex flex-col items-end">
        <span className={`text-3xl font-bold tracking-tighter leading-none ${styles.grade}`}>
          {anyData ? total.toFixed(1) : '--'}
        </span>
        <span className={`text-[8px] font-black tracking-widest uppercase mt-1 ${styles.text}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default MobileSubjectRow;
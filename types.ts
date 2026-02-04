export interface EvaluationPart {
  id: string;
  name: string;
  weight: number;
  groupId: string;
  minGrade?: number;
}

export interface SubjectGroup {
  id: string;
  name: string;
  weight: number;
  minGrade: number;
  dependsOnGroupId?: string;
}

export interface Subject {
  id: string;
  name: string;
  groups: SubjectGroup[];
  parts: EvaluationPart[];
}

export interface SubjectGrades {
  [partId: string]: number | null;
}

export interface State {
  [subjectId: string]: SubjectGrades;
}

export enum SubjectStatus {
  MISSING = 'FALTAN DATOS',
  PASSED = 'APROBADO',
  FAILED = 'SUSPENSO'
}
import { Subject } from './types';

export const APP_CONFIG = {
  title: "2° Ing. Informática",
  subtitle: "Segundo Cuatrimestre",
  storageKey: "notas_universidad_v4",
};

export const SUBJECTS: Subject[] = [
  {
    id: 'FRC',
    name: 'FRC - Redes y Comunicaciones',
    groups: [
      { id: 'teo', name: 'TEORÍA', weight: 0.6, minGrade: 5 },
      { id: 'pra', name: 'PRÁCTICAS', weight: 0.4, minGrade: 5 }
    ],
    parts: [
      { id: 't', name: 'EXAMEN', weight: 1.0, groupId: 'teo', minGrade: 5 },
      { id: 'p', name: 'PROYECTO', weight: 1.0, groupId: 'pra', minGrade: 5 }
    ]
  },
  {
    id: 'PCD',
    name: 'PCD - Programación Concurrente y Distribuida',
    groups: [
      { id: 'teo', name: 'TEORÍA', weight: 0.5, minGrade: 4 },
      { id: 'pra', name: 'PRÁCTICAS', weight: 0.5, minGrade: 4 }
    ],
    parts: [
      { id: 't_f', name: 'TEST FINAL', weight: 0.8, groupId: 'teo' },
      { id: 't_c', name: 'TESTS CONTINUA', weight: 0.2, groupId: 'teo' },
      { id: 'p_f', name: 'PRÁCTICA FINAL', weight: 0.8, groupId: 'pra' },
      { id: 'p_s', name: 'SEGUIMIENTO', weight: 0.2, groupId: 'pra' }
    ]
  },
  {
    id: 'IASI',
    name: 'IASI - Inteligencia Artificial y Sistemas Inteligentes',
    groups: [
      { id: 'teo', name: 'TEORÍA', weight: 0.7, minGrade: 5 },
      { id: 'pro', name: 'PRÁCTICAS', weight: 0.2, minGrade: 5 },
      { id: 'por', name: 'PORTAFOLIO', weight: 0.1, minGrade: 0 }
    ],
    parts: [
      { id: 'npru', name: 'PRUEBA ESCRITA', weight: 1.0, groupId: 'teo', minGrade: 5 },
      { id: 'npro', name: 'PROYECTO', weight: 1.0, groupId: 'pro', minGrade: 5 },
      { id: 'npor', name: 'PORTAFOLIO', weight: 1.0, groupId: 'por' }
    ]
  },
  {
    id: 'EC',
    name: 'EC - Estructura de Computadores',
    groups: [
      { id: 'teo', name: 'TEORÍA', weight: 0.5, minGrade: 5 },
      { id: 'pra', name: 'LABORATORIO', weight: 0.5, minGrade: 5 }
    ],
    parts: [
      { id: 't1', name: 'EXAMEN 1', weight: 0.5, groupId: 'teo', minGrade: 4.5 },
      { id: 't2', name: 'EXAMEN 2', weight: 0.5, groupId: 'teo', minGrade: 4.5 },
      { id: 'p1', name: 'P1 RENDIMIENTO', weight: 0.1, groupId: 'pra', minGrade: 4.5 },
      { id: 'p2', name: 'P2 FPGA', weight: 0.5, groupId: 'pra', minGrade: 4.5 },
      { id: 'p3', name: 'P3 SEGMENTADO', weight: 0.4, groupId: 'pra', minGrade: 4.5 }
    ]
  },
  {
    id: 'GO',
    name: 'GO - Gestión de Organizaciones',
    groups: [
      { id: 'be', name: 'EXAMEN', weight: 0.6, minGrade: 4 },
      { id: 'bec', name: 'EVAL. CONTINUA', weight: 0.4, minGrade: 0, dependsOnGroupId: 'be' }
    ],
    parts: [
      { id: 'ef', name: 'EXAMEN FINAL', weight: 1.0, groupId: 'be', minGrade: 4 },
      { id: 'bec_p', name: 'BEC / CASOS', weight: 1.0, groupId: 'bec' }
    ]
  }
];

export const STORAGE_KEY = APP_CONFIG.storageKey;
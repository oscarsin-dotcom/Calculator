export type Operator = '+' | '-' | '×' | '÷' | '%' | null;

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  isAiDerived?: boolean;
}

export interface CalculatorState {
  currentValue: string;
  previousValue: string | null;
  operator: Operator;
  waitingForNewValue: boolean;
  history: HistoryItem[];
}

export enum CalculatorMode {
  STANDARD = 'STANDARD',
  AI_SOLVER = 'AI_SOLVER',
}

export interface AiResponse {
  result: string;
  explanation: string;
}

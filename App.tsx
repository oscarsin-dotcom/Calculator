import React, { useState, useCallback, useEffect } from 'react';
import { CalculatorState, HistoryItem, Operator } from './types';
import Button from './components/Button';
import Display from './components/Display';
import HistoryPanel from './components/HistoryPanel';
import SmartSolver from './components/SmartSolver';
import { Icons } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    currentValue: '0',
    previousValue: null,
    operator: null,
    waitingForNewValue: false,
    history: [],
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // Core Calculator Logic
  const handleNumber = useCallback((num: string) => {
    setState(prev => {
      if (prev.waitingForNewValue) {
        return {
          ...prev,
          currentValue: num,
          waitingForNewValue: false,
        };
      }
      return {
        ...prev,
        currentValue: prev.currentValue === '0' ? num : prev.currentValue + num,
      };
    });
  }, []);

  const handleDecimal = useCallback(() => {
    setState(prev => {
      if (prev.waitingForNewValue) {
        return { ...prev, currentValue: '0.', waitingForNewValue: false };
      }
      if (!prev.currentValue.includes('.')) {
        return { ...prev, currentValue: prev.currentValue + '.' };
      }
      return prev;
    });
  }, []);

  const calculateResult = (a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? NaN : a / b;
      case '%': return a % b; // Standard modulus, not percent of
      default: return b;
    }
  };

  const performOperation = useCallback((nextOperator: Operator) => {
    setState(prev => {
      const inputValue = parseFloat(prev.currentValue);

      if (prev.previousValue === null) {
        return {
          ...prev,
          previousValue: prev.currentValue,
          waitingForNewValue: true,
          operator: nextOperator,
        };
      }

      if (prev.operator && !prev.waitingForNewValue) {
        const prevValue = parseFloat(prev.previousValue);
        const result = calculateResult(prevValue, inputValue, prev.operator);
        const resultStr = String(parseFloat(result.toPrecision(12))); // Handle float precision issues

        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          expression: `${prev.previousValue} ${prev.operator} ${prev.currentValue}`,
          result: resultStr,
          timestamp: Date.now(),
        };

        return {
          ...prev,
          previousValue: resultStr,
          currentValue: resultStr,
          waitingForNewValue: true,
          operator: nextOperator,
          history: [newHistoryItem, ...prev.history],
        };
      }

      // If just changing operator
      return {
        ...prev,
        operator: nextOperator,
        waitingForNewValue: true,
      };
    });
  }, []);

  const handleEqual = useCallback(() => {
    setState(prev => {
      if (!prev.operator || !prev.previousValue) return prev;

      const current = parseFloat(prev.currentValue);
      const previous = parseFloat(prev.previousValue);
      const result = calculateResult(previous, current, prev.operator);
      const resultStr = isNaN(result) ? "Error" : String(parseFloat(result.toPrecision(12)));

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        expression: `${prev.previousValue} ${prev.operator} ${prev.currentValue}`,
        result: resultStr,
        timestamp: Date.now(),
      };

      return {
        ...prev,
        currentValue: resultStr,
        previousValue: null,
        operator: null,
        waitingForNewValue: true,
        history: [newHistoryItem, ...prev.history],
      };
    });
    setAiExplanation(null);
  }, []);

  const handleClear = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentValue: '0',
      previousValue: null,
      operator: null,
      waitingForNewValue: false,
    }));
    setAiExplanation(null);
  }, []);

  const handleSignToggle = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentValue: String(parseFloat(prev.currentValue) * -1),
    }));
  }, []);

  const handlePercentage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentValue: String(parseFloat(prev.currentValue) / 100),
    }));
  }, []);

  // AI Integration Handler
  const handleAiSolve = (expression: string, result: string, explanation: string) => {
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      expression: expression,
      result: result,
      timestamp: Date.now(),
      isAiDerived: true,
    };

    setState(prev => ({
      ...prev,
      currentValue: result,
      previousValue: null,
      operator: null,
      waitingForNewValue: true,
      history: [newHistoryItem, ...prev.history],
    }));
    setAiExplanation(explanation);
  };

  // Keyboard Support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      
      if (/[0-9]/.test(key)) handleNumber(key);
      if (key === '.') handleDecimal();
      if (key === 'Enter' || key === '=') handleEqual();
      if (key === 'Escape') handleClear();
      if (key === 'Backspace') {
        setState(prev => ({
          ...prev,
          currentValue: prev.currentValue.length > 1 ? prev.currentValue.slice(0, -1) : '0'
        }));
      }
      if (key === '+') performOperation('+');
      if (key === '-') performOperation('-');
      if (key === '*') performOperation('×');
      if (key === '/') {
        event.preventDefault(); // Prevent quick find in Firefox
        performOperation('÷');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleDecimal, handleEqual, handleClear, performOperation]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-sans text-gray-100 overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-orange-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-sm bg-gray-900 rounded-[3rem] p-6 shadow-2xl border border-gray-800 flex flex-col z-10 h-[850px] max-h-[95vh]">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6 px-2">
          <button 
            onClick={() => setHistoryOpen(true)}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800"
          >
            <Icons.History />
          </button>
          <div className="flex gap-1">
             <div className="w-16 h-1 bg-gray-800 rounded-full" />
          </div>
          <button 
            onClick={() => setAiModalOpen(true)}
            className="p-2 text-indigo-400 hover:text-indigo-300 transition-colors rounded-full hover:bg-indigo-900/30"
            title="AI Solver"
          >
            <Icons.Sparkles />
          </button>
        </div>

        {/* Display */}
        <Display 
          value={state.currentValue} 
          previousValue={state.previousValue} 
          operator={state.operator} 
        />

        {/* AI Explanation Toast (if exists) */}
        {aiExplanation && (
          <div className="mb-4 bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-xl text-xs text-indigo-200 animate-in slide-in-from-top-2 fade-in relative">
            <button 
              onClick={() => setAiExplanation(null)}
              className="absolute top-1 right-2 text-indigo-400 hover:text-white"
            >
              ×
            </button>
            <strong className="block mb-1 text-indigo-300">Explanation:</strong>
            {aiExplanation}
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-3 flex-1 content-end">
          {/* Row 1 */}
          <Button label="AC" onClick={handleClear} variant="secondary" />
          <Button label="±" onClick={handleSignToggle} variant="secondary" />
          <Button label="%" onClick={handlePercentage} variant="secondary" />
          <Button label="÷" onClick={() => performOperation('÷')} variant="accent" />

          {/* Row 2 */}
          <Button label="7" onClick={() => handleNumber('7')} />
          <Button label="8" onClick={() => handleNumber('8')} />
          <Button label="9" onClick={() => handleNumber('9')} />
          <Button label="×" onClick={() => performOperation('×')} variant="accent" />

          {/* Row 3 */}
          <Button label="4" onClick={() => handleNumber('4')} />
          <Button label="5" onClick={() => handleNumber('5')} />
          <Button label="6" onClick={() => handleNumber('6')} />
          <Button label="-" onClick={() => performOperation('-')} variant="accent" />

          {/* Row 4 */}
          <Button label="1" onClick={() => handleNumber('1')} />
          <Button label="2" onClick={() => handleNumber('2')} />
          <Button label="3" onClick={() => handleNumber('3')} />
          <Button label="+" onClick={() => performOperation('+')} variant="accent" />

          {/* Row 5 */}
          <Button label="0" onClick={() => handleNumber('0')} doubleWidth className="pl-8 !items-start !justify-start" />
          <Button label="." onClick={handleDecimal} />
          <Button label="=" onClick={handleEqual} variant="accent" />
        </div>
      </div>

      {/* Slide-overs and Modals */}
      <HistoryPanel 
        history={state.history}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onClear={() => setState(prev => ({ ...prev, history: [] }))}
        onSelect={(res) => {
          setState(prev => ({ ...prev, currentValue: res, waitingForNewValue: true }));
          setHistoryOpen(false);
        }}
      />

      <SmartSolver 
        isOpen={aiModalOpen} 
        onClose={() => setAiModalOpen(false)} 
        onSolve={handleAiSolve}
      />
    </div>
  );
};

export default App;

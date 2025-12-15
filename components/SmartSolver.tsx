import React, { useState } from 'react';
import { Icons } from '../constants';
import { solveMathWithGemini } from '../services/geminiService';
import { AiResponse } from '../types';

interface SmartSolverProps {
  onSolve: (expression: string, result: string, explanation: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SmartSolver: React.FC<SmartSolverProps> = ({ onSolve, isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response: AiResponse = await solveMathWithGemini(input);
      onSolve(input, response.result, response.explanation);
      setInput('');
      onClose();
    } catch (err) {
      setError("Failed to solve. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 w-full max-w-lg rounded-3xl border border-gray-700 shadow-2xl overflow-hidden scale-in-center animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 to-gray-900 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg text-white">
              <Icons.Sparkles />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Ask OmniCalc AI</h3>
              <p className="text-xs text-indigo-300">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-300 mb-4 text-sm leading-relaxed">
            Describe your math problem in natural language. For example: 
            <span className="italic text-indigo-400"> "Calculate 20% tip on a $85.50 bill split between 3 people"</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your math problem here..."
                className="w-full bg-gray-950 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-32 text-lg font-light"
                autoFocus
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all 
                  ${loading || !input.trim() 
                    ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/40 active:scale-95'
                  }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Solving...
                  </>
                ) : (
                  <>
                    Solve <Icons.Send />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SmartSolver;

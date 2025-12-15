import React from 'react';
import { HistoryItem } from '../types';
import { Icons } from '../constants';

interface HistoryPanelProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  onSelect: (result: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, isOpen, onClose, onClear, onSelect }) => {
  return (
    <div 
      className={`fixed inset-y-0 left-0 w-80 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Icons.History /> History
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              No calculations yet.
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.result)}
                className="w-full text-right p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors group border border-transparent hover:border-gray-700"
              >
                <div className="text-gray-400 text-sm mb-1 font-mono break-all">{item.expression}</div>
                <div className="text-xl text-white font-medium group-hover:text-orange-400 transition-colors">
                  = {item.result}
                </div>
                {item.isAiDerived && (
                  <div className="mt-2 text-xs text-indigo-400 flex items-center justify-end gap-1">
                    <Icons.Sparkles /> AI Generated
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={onClear}
              className="w-full py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-colors font-medium"
            >
              Clear History
            </button>
          </div>
        )}
      </div>
      
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[-1] md:hidden"
          onClick={onClose}
        />
      )}
    </div>
  );
};

export default HistoryPanel;

import React, { useEffect, useRef } from 'react';

interface DisplayProps {
  value: string;
  previousValue: string | null;
  operator: string | null;
}

const Display: React.FC<DisplayProps> = ({ value, previousValue, operator }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [value]);

  // Format numbers with commas for better readability
  const formatNumber = (numStr: string) => {
    if (!numStr) return '';
    if (numStr === 'Error') return 'Error';
    // Split into integer and decimal parts
    const parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
  };

  return (
    <div className="w-full h-40 bg-gray-950 flex flex-col items-end justify-end px-6 py-4 mb-4 rounded-3xl border border-gray-800 shadow-inner">
      <div className="text-gray-400 text-lg h-8 font-mono mb-1 opacity-70 flex items-center gap-2">
        {previousValue && (
          <>
            <span>{formatNumber(previousValue)}</span>
            <span className="text-orange-500">{operator}</span>
          </>
        )}
      </div>
      <div 
        ref={scrollRef}
        className="text-6xl text-white font-light tracking-tight w-full text-right whitespace-nowrap overflow-x-auto no-scrollbar"
      >
        {formatNumber(value)}
      </div>
    </div>
  );
};

export default Display;

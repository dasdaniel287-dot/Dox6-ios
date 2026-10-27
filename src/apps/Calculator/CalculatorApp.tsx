import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';

interface CalculatorAppProps {
  onClose: () => void;
}

export const CalculatorApp: React.FC<CalculatorAppProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isScientific, setIsScientific] = useState(false);

  const inputDigit = (digit: string) => {
    soundManager.playKeyClick();
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    soundManager.playKeyClick();
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    soundManager.playKeyClick();
    setDisplay('0');
    setPrevVal(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    soundManager.playKeyClick();
    const val = parseFloat(display);
    setDisplay(String(-val));
  };

  const inputPercent = () => {
    soundManager.playKeyClick();
    const val = parseFloat(display);
    setDisplay(String(val / 100));
  };

  const performOperation = (nextOp: string) => {
    soundManager.playKeyClick();
    const inputValue = parseFloat(display);

    if (prevVal === null) {
      setPrevVal(inputValue);
    } else if (operation) {
      const current = prevVal || 0;
      let result = current;

      if (operation === '+') result = current + inputValue;
      if (operation === '−') result = current - inputValue;
      if (operation === '×') result = current * inputValue;
      if (operation === '÷') result = inputValue !== 0 ? current / inputValue : 0;
      if (operation === '^') result = Math.pow(current, inputValue);

      setPrevVal(result);
      setDisplay(String(Number(result.toFixed(8))));
    }

    setWaitingForOperand(true);
    setOperation(nextOp === '=' ? null : nextOp);
  };

  const scientificFunc = (type: string) => {
    soundManager.playKeyClick();
    const val = parseFloat(display);
    let res = val;
    if (type === 'sqrt') res = Math.sqrt(val);
    if (type === 'sin') res = Math.sin((val * Math.PI) / 180);
    if (type === 'cos') res = Math.cos((val * Math.PI) / 180);
    if (type === 'tan') res = Math.tan((val * Math.PI) / 180);
    if (type === 'ln') res = Math.log(val);
    if (type === 'pi') res = Math.PI;
    if (type === 'e') res = Math.E;
    setDisplay(String(Number(res.toFixed(8))));
    setWaitingForOperand(true);
  };

  return (
    <div className="w-full h-full bg-black text-white flex flex-col justify-end p-5 pb-8 select-none">
      {/* Top bar with Scientific Toggle */}
      <div className="flex justify-between items-center pb-4 text-xs">
        <button
          onClick={() => {
            setIsScientific(!isScientific);
            soundManager.playKeyClick();
          }}
          className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 hover:text-white"
        >
          {isScientific ? 'Standard' : 'Scientific'}
        </button>
        <span className="text-neutral-500 font-mono text-[11px]">iOS 18 Math</span>
      </div>

      {/* Main Number Display */}
      <div className="flex items-end justify-end px-2 py-4 h-24 overflow-hidden">
        <span className="text-6xl font-light tracking-tight text-white font-mono truncate">
          {display}
        </span>
      </div>

      {/* Scientific Row if active */}
      {isScientific && (
        <div className="grid grid-cols-4 gap-2.5 pb-2.5">
          {['sin', 'cos', 'tan', 'sqrt'].map((fn) => (
            <button
              key={fn}
              onClick={() => scientificFunc(fn)}
              className="h-12 rounded-full bg-neutral-800 text-sm font-medium hover:bg-neutral-700 active:scale-95 transition-all text-neutral-300"
            >
              {fn}
            </button>
          ))}
        </div>
      )}

      {/* Calculator Buttons Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <button
          onClick={clear}
          className="h-16 rounded-full bg-neutral-400 text-black text-xl font-medium hover:bg-neutral-300 active:scale-95 transition-all"
        >
          {display === '0' && prevVal === null ? 'AC' : 'C'}
        </button>
        <button
          onClick={toggleSign}
          className="h-16 rounded-full bg-neutral-400 text-black text-xl font-medium hover:bg-neutral-300 active:scale-95 transition-all"
        >
          ±
        </button>
        <button
          onClick={inputPercent}
          className="h-16 rounded-full bg-neutral-400 text-black text-xl font-medium hover:bg-neutral-300 active:scale-95 transition-all"
        >
          %
        </button>
        <button
          onClick={() => performOperation('÷')}
          className={`h-16 rounded-full text-2xl font-medium active:scale-95 transition-all ${
            operation === '÷' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white hover:bg-orange-400'
          }`}
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => inputDigit('7')}
          className="h-16 rounded-full bg-neutral-800 text-white text-2xl font-light hover:bg-neutral-700 active:scale-95 transition-all"
        >
          7
        </button>
        <button
          onClick={() => inputDigit('8')}
          className="h-16 rounded-full bg-neutral-800 text-white text-2xl font-light hover:bg-neutral-700 active:scale-95 transition-all"
        >
          8
        </button>
        <button
          onClick={() => inputDigit('9')}
          className="h-16 rounded-full bg-neutral-800 text-white text-2xl font-light hover:bg-neutral-700 active:scale-95 transition-all"
        >
          9
        </button>
        <button
          onClick={() => performOperation('×')}
          className={`h-16 rounded-full text-2xl font-medium active:scale-95 transition-all ${
            operation === '×' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white hover:bg-orange-400'
          }`}
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => inputDigit('4')}
          className="h-16 rounded-full bg-neutral-800 text-white text-2xl font-light hover:bg-neutral-700 active:scale-95 transition-all"
        >
          4
        </button>
        <button
          onClick={() => inputDigit('5')}
          className="h-16 rounded-full bg-neutral-800 text-white text-2xl font-light hover:bg-neutral-700 active:scale-95 transition-all"
        >
          5
        </button>
        <button
          onClick={() => inputDigit('6')}
          className="h-16 rounded-full bg-neutral-800 text-white text-2xl font-light hover:bg-neutral-700 active:scale-95 transition-all"
        >
          6
        </button>
        <button
          onClick={() => performOperation('−')}
          className={`h-16 rounded-full text-2xl font-medium active:scale-95 transition-all ${
            operation === '−' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white hover:bg-orange-400'
          }`}
        >
          −
        </button>

        {/* Row 4 */}
        <button
          onClick={() => inputDigit('1')}
          className="h-16 rounded-full bg-neutral-800 text-white text-2xl font-light hover:bg-neutral-700 active:scale-95 transition-all"
        >
          1
        </button>
        <button
          onClick={() => inputDigit('2')}
          className="h-16 rounded-full bg-neutral-800 text-white text-2xl font-light hover:bg-neutral-700 active:scale-95 transition-all"
        >
          2
        </button>
        <button
          onClick={() => inputDigit('3')}
          className="h-16 rounded-full bg-neutral-800 text-white text-2xl font-light hover:bg-neutral-700 active:scale-95 transition-all"
        >
          3
        </button>
        <button
          onClick={() => performOperation('+')}
          className={`h-16 rounded-full text-2xl font-medium active:scale-95 transition-all ${
            operation === '+' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white hover:bg-orange-400'
          }`}
        >
          +
        </button>

        {/* Row 5: 0, Dot, Equals */}
        <button
          onClick={() => inputDigit('0')}
          className="col-span-2 h-16 rounded-full bg-neutral-800 text-white text-2xl font-light pl-7 text-left hover:bg-neutral-700 active:scale-95 transition-all"
        >
          0
        </button>
        <button
          onClick={inputDot}
          className="h-16 rounded-full bg-neutral-800 text-white text-2xl font-light hover:bg-neutral-700 active:scale-95 transition-all"
        >
          .
        </button>
        <button
          onClick={() => performOperation('=')}
          className="h-16 rounded-full bg-orange-500 text-white text-2xl font-medium hover:bg-orange-400 active:scale-95 transition-all"
        >
          =
        </button>
      </div>
    </div>
  );
};

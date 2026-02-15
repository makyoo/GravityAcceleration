
import React from 'react';
import { X, Globe, Moon } from 'lucide-react';
import { PhysicsParams, GRAVITY_EARTH, GRAVITY_MOON } from '../types';

interface ParameterModalProps {
  params: PhysicsParams;
  setParams: React.Dispatch<React.SetStateAction<PhysicsParams>>;
  onClose: () => void;
}

const ParameterModal: React.FC<ParameterModalProps> = ({ params, setParams, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <Globe className="text-blue-500" />
            实验参数设置
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Gravity Toggle */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest block">重力加速度 (g)</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setParams(p => ({ ...p, gravity: GRAVITY_EARTH }))}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                  params.gravity === GRAVITY_EARTH 
                  ? 'border-blue-500 bg-blue-500/10 text-white' 
                  : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Globe size={24} className={params.gravity === GRAVITY_EARTH ? 'text-blue-400' : 'text-slate-600'} />
                <span className="font-bold">地球 (Earth)</span>
                <span className="mono text-xs">9.81 m/s²</span>
              </button>
              
              <button 
                onClick={() => setParams(p => ({ ...p, gravity: GRAVITY_MOON }))}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                  params.gravity === GRAVITY_MOON 
                  ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                  : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Moon size={24} className={params.gravity === GRAVITY_MOON ? 'text-indigo-400' : 'text-slate-600'} />
                <span className="font-bold">月球 (Moon)</span>
                <span className="mono text-xs">1.63 m/s²</span>
              </button>
            </div>
            
            <div className="flex items-center gap-4 px-2">
              <span className="text-sm text-slate-500">自定义:</span>
              <input 
                type="number"
                value={params.gravity}
                onChange={(e) => setParams(p => ({ ...p, gravity: parseFloat(e.target.value) || 0 }))}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm mono text-blue-400"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
          >
            应用参数
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParameterModal;

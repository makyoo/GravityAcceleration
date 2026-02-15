
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Settings, Play, RotateCcw, Pause, HelpCircle, X, Info } from 'lucide-react';
import { 
  Material, 
  WeightCategory, 
  GRAVITY_EARTH, 
  SphereConfig, 
  PhysicsParams,
  WEIGHT_SCALE,
  MATERIAL_PROPERTIES
} from './types';
import SimulationArea from './components/SimulationArea';
import ParameterModal from './components/ParameterModal';

const MAX_TIME = 10; // Maximum simulation time in seconds
const SCALE_PX_PER_M = 15; // 15 pixels = 1 meter

const App: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [params, setParams] = useState<PhysicsParams>({
    gravity: GRAVITY_EARTH
  });

  const [leftSphere, setLeftSphere] = useState<SphereConfig>({
    material: Material.WOOD,
    weight: WeightCategory.W2KG
  });

  const [rightSphere, setRightSphere] = useState<SphereConfig>({
    material: Material.IRON,
    weight: WeightCategory.W2KG
  });

  const requestRef = useRef<number>(null);
  const startTimeRef = useRef<number>(0);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp - (time * 1000);
    const elapsed = (timestamp - startTimeRef.current) / 1000;
    
    if (elapsed <= MAX_TIME) {
      setTime(elapsed);
      requestRef.current = requestAnimationFrame(animate);
    } else {
      setTime(MAX_TIME);
      setIsPlaying(false);
    }
  }, [time]);

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      startTimeRef.current = 0;
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, animate]);

  const handleStart = () => {
    if (time >= MAX_TIME) setTime(0);
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  const calculatePosition = (t: number, _config: SphereConfig) => {
    let g = params.gravity;
    // Simple free fall formula: d = 1/2 * g * t^2
    return 0.5 * g * Math.pow(t, 2);
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a] text-slate-200">
      {/* HEADER CONTROLS */}
      <header className="bg-slate-900/90 border-b border-slate-700 p-2 md:p-3 px-4 md:px-6 flex flex-col gap-2 md:gap-3 shadow-2xl z-50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
            <h1 className="text-xs md:text-sm font-bold leading-tight hidden sm:block">重力加速度实验</h1>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={isPlaying ? handlePause : handleStart}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg ${
                isPlaying ? 'bg-amber-600' : 'bg-green-600'
              }`}
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
              <span>{isPlaying ? '暂停' : '释放'}</span>
            </button>
            <button 
              onClick={handleReset} 
              className="p-1.5 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-lg border border-slate-700"
            >
              <RotateCcw size={16} />
            </button>
            <div className="h-6 w-px bg-slate-700 mx-1" />
            <button 
              onClick={() => setShowSettings(true)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-300"
            >
              <Settings size={18} />
            </button>
          </div>
          
          <div className="flex gap-2 text-[10px] mono shrink-0">
            <div className="px-2 py-1 bg-slate-800/60 rounded border border-slate-700">
               <span className="text-slate-500">G:</span> <span className="text-blue-400">{params.gravity.toFixed(2)}</span>
            </div>
            <div className="hidden md:flex px-2 py-1 bg-slate-800/60 rounded border border-slate-700">
               <span className="text-slate-500">H1:</span> <span className="text-amber-500">{calculatePosition(time, leftSphere).toFixed(1)}m</span>
            </div>
            <div className="hidden md:flex px-2 py-1 bg-slate-800/60 rounded border border-slate-700">
               <span className="text-slate-500">H2:</span> <span className="text-slate-300">{calculatePosition(time, rightSphere).toFixed(1)}m</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase">左 (木)</span>
            <div className="flex gap-1">
              {(Object.keys(WeightCategory) as Array<keyof typeof WeightCategory>).map((w) => (
                <button
                  key={w}
                  onClick={() => setLeftSphere(prev => ({ ...prev, weight: WeightCategory[w] }))}
                  className={`px-2 py-1 text-[10px] md:text-xs rounded border transition-all min-w-[40px] ${
                    leftSphere.weight === WeightCategory[w] 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md' 
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {WEIGHT_SCALE[WeightCategory[w]].label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase">右 (铁)</span>
            <div className="flex gap-1">
              {(Object.keys(WeightCategory) as Array<keyof typeof WeightCategory>).map((w) => (
                <button
                  key={w}
                  onClick={() => setRightSphere(prev => ({ ...prev, weight: WeightCategory[w] }))}
                  className={`px-2 py-1 text-[10px] md:text-xs rounded border transition-all min-w-[40px] ${
                    rightSphere.weight === WeightCategory[w] 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md' 
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {WEIGHT_SCALE[WeightCategory[w]].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/40 p-1.5 px-3 rounded-xl border border-slate-800/50">
          <span className="mono text-blue-400 font-bold text-xs w-12 text-center">{time.toFixed(2)}s</span>
          <div className="flex-1 relative h-6 flex items-center">
            <input 
              type="range"
              min="0"
              max={MAX_TIME}
              step="0.01"
              value={time}
              onChange={(e) => {
                setIsPlaying(false);
                setTime(parseFloat(e.target.value));
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer hover:bg-slate-700 transition-colors"
            />
          </div>
          <span className="mono text-slate-600 text-[10px]">10.00s</span>
        </div>
      </header>

      {/* SIMULATION AREA */}
      <main className="flex-1 relative overflow-hidden">
        <SimulationArea 
          time={time}
          leftSphere={leftSphere}
          rightSphere={rightSphere}
          params={params}
          calculatePosition={calculatePosition}
          scale={SCALE_PX_PER_M}
        />
        
        {/* HELP BUTTON - Bottom Right */}
        <button 
          onClick={() => setShowHelp(true)}
          className="absolute bottom-4 right-4 z-40 p-2.5 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-full text-blue-400 hover:text-blue-300 hover:bg-slate-700 transition-all shadow-xl hover:scale-110"
          title="实验说明"
        >
          <HelpCircle size={24} />
        </button>
      </main>

      <footer className="px-6 py-2 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 text-[10px] text-slate-500 flex justify-between shrink-0 z-50">
        <span className="font-medium tracking-wider">编程思维实验室</span>
        <span className="mono opacity-80">QAZ3.COM</span>
      </footer>

      {/* Parameter Modal */}
      {showSettings && (
        <ParameterModal 
          params={params} 
          setParams={setParams} 
          onClose={() => setShowSettings(false)} 
        />
      )}

      {/* HELP MODAL */}
      {showHelp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowHelp(false)} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Info className="text-blue-500" size={20} />
                实验原理说明
              </h3>
              <button onClick={() => setShowHelp(false)} className="p-1 hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">物理假设</h4>
                <p className="text-sm leading-relaxed text-slate-300">
                  本模拟实验是在 <span className="text-amber-500 font-bold">真空环境</span> 下进行的，即 <span className="text-white bg-slate-800 px-1.5 py-0.5 rounded">忽略空气阻力</span>。在此条件下，物体的下落距离仅与重力和时间有关，与物体的质量、材质无关。
                </p>
              </section>
              
              <section className="space-y-2">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">自由落体公式</h4>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                  <span className="mono text-blue-400 text-lg">d = ½ · g · t²</span>
                </div>
                <ul className="text-xs space-y-1 text-slate-400 mono">
                  <li><span className="text-blue-500">d</span>: 下落距离 (m)</li>
                  <li><span className="text-blue-500">g</span>: 重力加速度 (m/s²)</li>
                  <li><span className="text-blue-500">t</span>: 下落时间 (s)</li>
                </ul>
              </section>

              <p className="text-[11px] italic text-slate-500 text-center">
                观察木球与铁球在相同时间内下落的距离，验证等效原理。
              </p>
            </div>
            <div className="p-4 bg-slate-950/50 border-t border-slate-800">
              <button 
                onClick={() => setShowHelp(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;


import React, { useMemo } from 'react';
import { SphereConfig, MATERIAL_PROPERTIES, WEIGHT_SCALE, PhysicsParams } from '../types';

interface SimulationAreaProps {
  time: number;
  leftSphere: SphereConfig;
  rightSphere: SphereConfig;
  params: PhysicsParams;
  calculatePosition: (t: number, config: SphereConfig) => number;
  scale: number;
}

const SimulationArea: React.FC<SimulationAreaProps> = ({ 
  time, 
  leftSphere, 
  rightSphere, 
  params,
  calculatePosition,
  scale
}) => {
  const leftCurrentPos = calculatePosition(time, leftSphere);
  const rightCurrentPos = calculatePosition(time, rightSphere);

  // Constants for markers
  const STROBE_INTERVAL = 0.5; // seconds

  // Pre-calculate trajectory points
  const trajectoryPoints = useMemo(() => {
    const strobeMarkers: { t: number, left: number, right: number }[] = [];

    // Strobe points for visualization
    for (let t = 0; t <= 10; t += STROBE_INTERVAL) {
      strobeMarkers.push({
        t,
        left: calculatePosition(t, leftSphere),
        right: calculatePosition(t, rightSphere)
      });
    }

    return { strobeMarkers };
    // Fixed: 'params' was missing from destructured props but used in this dependency array.
  }, [leftSphere, rightSphere, calculatePosition, params]);

  // Ruler markers
  const rulerMarkers = useMemo(() => {
    const markers = [];
    for (let i = 0; i <= 500; i += 5) {
      markers.push(i);
    }
    return markers;
  }, []);

  return (
    <div className="absolute inset-0 flex justify-center bg-[#0f172a]">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', 
             backgroundSize: '100px 100px' 
           }} 
      />

      {/* Central Axis & Ruler */}
      <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-slate-800 flex justify-center z-10">
        <div className="h-full w-12 border-x border-slate-800/30 bg-slate-900/20 flex flex-col items-center overflow-hidden">
          <svg width="48" height="100%" className="absolute top-0">
            {rulerMarkers.map(m => (
              <g key={m} transform={`translate(0, ${m * scale + 48})`}>
                <line x1="0" y1="0" x2={m % 10 === 0 ? "16" : "8"} y2="0" stroke="#475569" strokeWidth="1" />
                <line x1="48" y1="0" x2={m % 10 === 0 ? "32" : "40"} y2="0" stroke="#475569" strokeWidth="1" />
                {m % 5 === 0 && (
                  <text x="24" y="4" fill="#475569" fontSize="9" textAnchor="middle" className="mono select-none">
                    {m}m
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Lane Container - Responsive Padding */}
      <div className="relative w-full h-full flex px-4 sm:px-12 md:px-20 lg:px-40">
        
        {/* Left Simulation Lane */}
        <div className="relative flex-1 h-full flex justify-center pt-12">
           {/* Trajectory visualization */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <line 
                x1="50%" y1="48" x2="50%" y2="100%" 
                stroke={MATERIAL_PROPERTIES[leftSphere.material].color} 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
                className="opacity-10"
              />
              {trajectoryPoints.strobeMarkers.map(m => (
                <g key={`l-${m.t}`} transform={`translate(0, ${m.left * scale + 48})`} className={`transition-opacity duration-300 ${m.t > time ? 'opacity-10' : 'opacity-80'}`}>
                   <circle cx="50%" cy="0" r="2.5" fill={MATERIAL_PROPERTIES[leftSphere.material].color} />
                   <text x="calc(50% - 10px)" y="3" fill="#64748b" fontSize="7" textAnchor="end" className="mono">{m.t}s</text>
                </g>
              ))}
           </svg>

           {/* Left Sphere */}
           <div 
             className="relative z-20 flex flex-col items-center"
             style={{ transform: `translateY(${leftCurrentPos * scale}px)`, transition: 'transform 50ms linear' }}
           >
             <div 
               className="rounded-full shadow-2xl border border-white/20 relative"
               style={{ 
                 width: WEIGHT_SCALE[leftSphere.weight].radius * 2,
                 height: WEIGHT_SCALE[leftSphere.weight].radius * 2,
                 backgroundColor: MATERIAL_PROPERTIES[leftSphere.material].color,
                 boxShadow: `inset -4px -4px 12px rgba(0,0,0,0.6), 0 10px 20px -5px rgba(0,0,0,0.5)`
               }}
             >
               <div className="absolute inset-0 rounded-full bg-white/10 blur-[2px] scale-75" />
             </div>
             
             <div className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap bg-blue-600/30 backdrop-blur-md border border-blue-500/40 px-1.5 py-0.5 rounded text-[9px] mono font-bold text-blue-300">
               {leftCurrentPos.toFixed(2)}m
             </div>
           </div>
        </div>

        {/* Right Simulation Lane */}
        <div className="relative flex-1 h-full flex justify-center pt-12">
           {/* Trajectory visualization */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
               <line 
                x1="50%" y1="48" x2="50%" y2="100%" 
                stroke={MATERIAL_PROPERTIES[rightSphere.material].color} 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
                className="opacity-10"
              />
              {trajectoryPoints.strobeMarkers.map(m => (
                <g key={`r-${m.t}`} transform={`translate(0, ${m.right * scale + 48})`} className={`transition-opacity duration-300 ${m.t > time ? 'opacity-10' : 'opacity-80'}`}>
                   <circle cx="50%" cy="0" r="2.5" fill={MATERIAL_PROPERTIES[rightSphere.material].color} />
                   <text x="calc(50% + 10px)" y="3" fill="#64748b" fontSize="7" textAnchor="start" className="mono">{m.t}s</text>
                </g>
              ))}
           </svg>

           {/* Right Sphere */}
           <div 
             className="relative z-20 flex flex-col items-center"
             style={{ transform: `translateY(${rightCurrentPos * scale}px)`, transition: 'transform 50ms linear' }}
           >
             <div 
               className="rounded-full shadow-2xl border border-white/20 relative"
               style={{ 
                 width: WEIGHT_SCALE[rightSphere.weight].radius * 2,
                 height: WEIGHT_SCALE[rightSphere.weight].radius * 2,
                 backgroundColor: MATERIAL_PROPERTIES[rightSphere.material].color,
                 boxShadow: `inset -4px -4px 12px rgba(0,0,0,0.6), 0 10px 20px -5px rgba(0,0,0,0.5)`
               }}
             >
               <div className="absolute inset-0 rounded-full bg-white/10 blur-[2px] scale-75" />
             </div>

             <div className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap bg-slate-700/50 backdrop-blur-md border border-slate-600/50 px-1.5 py-0.5 rounded text-[9px] mono font-bold text-slate-200">
               {rightCurrentPos.toFixed(2)}m
             </div>
           </div>
        </div>

      </div>

      {/* Top Platform Mask */}
      <div className="absolute top-0 w-full h-12 bg-slate-900 border-b border-slate-700/50 z-30" />
    </div>
  );
};

export default SimulationArea;

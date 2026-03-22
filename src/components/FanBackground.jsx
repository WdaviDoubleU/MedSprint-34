import React from 'react';

/**
 * Soft corner fans — wide radial bands, moderate slices, airy palette.
 * Kept minimal so it reads as atmosphere, not texture noise.
 */
function FanArc({ cx, cy, maxR, slices, baseColor, startDeg, endDeg }) {
  const toRad = (d) => (d * Math.PI) / 180;
  return (
    <>
      {Array.from({ length: slices }).map((_, i) => {
        const r = maxR - i * (maxR / slices) * 0.25;
        const a1 = startDeg + (i / slices) * (endDeg - startDeg);
        const a2 = startDeg + ((i + 1) / slices) * (endDeg - startDeg);
        const x1 = cx + Math.cos(toRad(a1)) * r;
        const y1 = cy + Math.sin(toRad(a1)) * r;
        const x2 = cx + Math.cos(toRad(a2)) * r;
        const y2 = cy + Math.sin(toRad(a2)) * r;
        const op = Math.max(0.1, 0.42 - i * 0.055);
        return (
          <path
            key={`${cx}-${cy}-${i}`}
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
            fill={baseColor}
            opacity={op}
          />
        );
      })}
    </>
  );
}

export default function FanBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-50" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full min-h-[100dvh]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <FanArc cx={0} cy={0} maxR={520} slices={8} baseColor="#bfdbfe" startDeg={0} endDeg={98} />
        <FanArc cx={1200} cy={0} maxR={480} slices={8} baseColor="#93c5fd" startDeg={82} endDeg={182} />
        <FanArc cx={0} cy={800} maxR={440} slices={7} baseColor="#dbeafe" startDeg={-12} endDeg={82} />
        <FanArc cx={1200} cy={800} maxR={460} slices={7} baseColor="#bfdbfe" startDeg={92} endDeg={192} />
        <FanArc cx={600} cy={920} maxR={400} slices={6} baseColor="#eff6ff" startDeg={195} endDeg={345} />
        <FanArc cx={600} cy={-80} maxR={360} slices={6} baseColor="#eff6ff" startDeg={12} endDeg={168} />
      </svg>
    </div>
  );
}

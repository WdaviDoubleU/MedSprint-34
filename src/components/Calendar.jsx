import { useState, useRef, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isPast,
  isToday,
  getDay,
  getDate,
  subDays,
  startOfDay,
} from 'date-fns';
import { Activity, ChevronDown, Mail, Share2, Copy, Flame } from 'lucide-react';
import './Calendar.css';

const GOLD_MIN = 30;

function streakFromToday(data, isExample, getExamplePoints, predicate) {
  let d = startOfDay(new Date());
  let count = 0;
  for (let i = 0; i < 4000; i++) {
    const raw = isExample ? getExamplePoints(d) : (data[format(d, 'yyyy-MM-dd')] ?? 0);
    const pts = Math.max(0, raw);
    if (!predicate(pts)) break;
    count += 1;
    d = subDays(d, 1);
  }
  return count;
}

function buildBragMessage(normalStreak, goldStreak) {
  return [
    'Fan of Exercise — streak update',
    '',
    `I am crushing my consistency: ${normalStreak} day${normalStreak === 1 ? '' : 's'} in a row with any exercise logged.`,
    '',
    `Gold streak (light green or better, ${GOLD_MIN}+ points): ${goldStreak} day${goldStreak === 1 ? '' : 's'} in a row.`,
    '',
    'If you are still deciding whether to move today — this is your sign. Come chase the calendar with me.',
    '',
    'Sent from Fan of Exercise.',
  ].join('\n');
}

export default function Calendar({ data, onDayClick }) {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isExample = selectedYear === 'Example';

  const getPointsClass = (points, date) => {
    if (points > 0) {
      if (points >= 60) return 'level-4';
      if (points >= 30) return 'level-3';
      if (points >= 15) return 'level-2';
      return 'level-1';
    }
    // 0 points — only mark red for real (non-example) past days
    if (!isExample && isPast(date) && !isToday(date)) {
      return 'level-missed';
    }
    return 'level-0';
  };

  // Deterministic pseudo-random points for 'Example' mode.
  // Uses a Murmur-style integer hash so every (day, month) pair is unique.
  const getExamplePoints = (date) => {
    const day = getDate(date);
    const month = date.getMonth() + 1;
    // Mix bits to avoid any visible period
    let h = day * 374761393 + month * 1013904223;
    h ^= h >>> 13; h = Math.imul(h, 1540483477);
    h ^= h >>> 15; h = Math.imul(h, 2246822519);
    h ^= h >>> 16;
    const r = Math.abs(h) % 100;

    if (r < 5)  return -1;  // these too should show as missed, not grey
    if (r < 25) return -1;  // ~25% missed (red)
    if (r < 45) return 5;   // ~20% Level 1
    if (r < 65) return 20;  // ~20% Level 2
    if (r < 85) return 45;  // ~20% Level 3
    return 70;               // ~15% Level 4
  };
  // Group days into months for the selectedYear (Jan-Dec) with padding 
  const generateMonthlyData = () => {
    const monthlyData = [];

    for (let month = 0; month < 12; month++) {
      const year = selectedYear === 'Example' ? 2026 : parseInt(selectedYear);
      const monthDate = startOfMonth(new Date(year, month, 1));
      const monthEnd = endOfMonth(monthDate);
      const days = eachDayOfInterval({ start: monthDate, end: monthEnd });
      
      const firstDayOfWeek = getDay(monthDate);
      const padding = Array(firstDayOfWeek).fill(null);

      monthlyData.push({
        name: format(monthDate, 'MMMM yyyy'),
        days: [...padding, ...days]
      });
    }
    return monthlyData;
  };
  
  const years = ['2024', '2025', '2026', '2027', 'Example'];

  const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthlyData = generateMonthlyData();

  const normalStreak = useMemo(
    () => streakFromToday(data, isExample, getExamplePoints, (p) => p > 0),
    [data, isExample]
  );
  const goldStreak = useMemo(
    () => streakFromToday(data, isExample, getExamplePoints, (p) => p >= GOLD_MIN),
    [data, isExample]
  );

  const bragBody = useMemo(
    () => buildBragMessage(normalStreak, goldStreak),
    [normalStreak, goldStreak]
  );

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent('My Fan of Exercise streaks — can you beat this?');
    const body = encodeURIComponent(bragBody);
    return `mailto:?subject=${subject}&body=${body}`;
  }, [bragBody]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Fan of Exercise streaks',
          text: bragBody,
        });
        return;
      }
    } catch {
      /* user cancelled or share failed */
    }
    try {
      await navigator.clipboard.writeText(bragBody);
      alert('Streak message copied to clipboard.');
    } catch {
      alert('Could not share or copy. Try the Email button instead.');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bragBody);
      alert('Streak message copied to clipboard.');
    } catch {
      alert('Copy failed.');
    }
  };

  return (
    <div className="calendar-wrapper flat-panel animate-fade-in p-6">
      <div className="calendar-header mb-6 flex flex-wrap justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="text-blue-500" size={24} />
            Exercise Frequency
          </h2>
          <p className="text-secondary mt-1 text-sm">Track your daily intensity for the selected year.</p>

          <div className="streak-strip mt-6 flex flex-wrap items-stretch gap-4">
            <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 min-w-[140px]">
              <Flame className="text-orange-500 shrink-0" size={28} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Streak</p>
                <p className="text-2xl font-black text-slate-900 leading-none">{normalStreak}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Any exercise</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3 min-w-[140px]">
              <span className="text-2xl shrink-0" aria-hidden>🏆</span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Gold streak</p>
                <p className="text-2xl font-black text-slate-900 leading-none">{goldStreak}</p>
                <p className="text-xs text-slate-600 font-medium mt-1">{GOLD_MIN}+ pts (light green+)</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
              >
                <Share2 size={16} />
                Share
              </button>
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
              >
                <Mail size={16} />
                Email
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
              >
                <Copy size={16} />
                Copy
              </button>
            </div>
          </div>
        </div>
        
        <div className="year-selector flex items-center gap-3 self-center">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Year:</label>

          {/* Custom themed dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onBlur={(e) => {
              // Close if focus leaves the entire dropdown widget
              if (!dropdownRef.current?.contains(e.relatedTarget)) setDropdownOpen(false);
            }}
          >
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-900 font-bold py-2 pl-4 pr-3 rounded-xl transition-all hover:border-blue-400 focus:outline-none focus:border-blue-500"
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              <span>{selectedYear}</span>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border-2 border-slate-200 rounded-xl overflow-hidden z-50 min-w-[120px]">
                {years.map(y => (
                  <button
                    key={y}
                    tabIndex={0}
                    onClick={() => { setSelectedYear(y); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors flex items-center justify-between gap-2 ${
                      selectedYear === y
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    {y}
                    {y === 'Example' && selectedYear !== y && (
                      <span className="text-[9px] bg-blue-100 text-blue-600 font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full">Demo</span>
                    )}
                    {y === 'Example' && selectedYear === y && (
                      <span className="text-[9px] bg-white/20 text-white font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full">Demo</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="calendar-months-container grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {monthlyData.map((month) => (
          <div key={month.name} className="month-section animate-fade-in">
            <h3 className="text-lg font-bold mb-4 text-blue-500">{month.name}</h3>
            
            <div className="weekday-header grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-500">
              {WEEKDAYS.map((day, idx) => <span key={idx}>{day}</span>)}
            </div>

            <div className="calendar-grid-monthly">
              {month.days.map((date, idx) => {
                if (!date) return <div key={`empty-${idx}`} className="calendar-cell-empty" />;
                
                const dateStr = format(date, 'yyyy-MM-dd');
                const rawPoints = isExample ? getExamplePoints(date) : (data[dateStr] || 0);
                // -1 is our sentinel for 'missed' in example mode
                const pointClass = isExample && rawPoints === -1
                  ? 'level-missed'
                  : getPointsClass(Math.max(rawPoints, 0), date);
                const points = Math.max(rawPoints, 0);
                
                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => onDayClick(date, rawPoints, isExample)}
                    className={`calendar-cell ${pointClass} flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-110 hover:z-10`}
                    title={`${dateStr} — ${rawPoints < 0 ? 'Missed' : `${points} pts`}`}
                    aria-label={`View stats for ${dateStr}`}
                  >
                    {getDate(date)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="calendar-legend mt-8 flex items-center justify-end gap-3 text-sm text-secondary">
        <span>Missed</span>
        <div className="calendar-cell level-missed w-5 h-5"></div>
        <span className="ml-4">Intensity</span>
        <div className="flex gap-1.5">
          <div className="calendar-cell level-0 w-5 h-5"></div>
          <div className="calendar-cell level-1 w-5 h-5"></div>
          <div className="calendar-cell level-2 w-5 h-5"></div>
          <div className="calendar-cell level-3 w-5 h-5"></div>
          <div className="calendar-cell level-4 w-5 h-5"></div>
        </div>
        <span>Success</span>
      </div>
    </div>
  );
}

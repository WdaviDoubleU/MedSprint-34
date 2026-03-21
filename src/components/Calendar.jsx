import { useState } from 'react';
import { format, subDays, startOfDay, startOfMonth, endOfMonth, eachDayOfInterval, isPast, isToday, getDay, getDate } from 'date-fns';
import { Activity } from 'lucide-react';
import { clsx } from 'clsx';
import './Calendar.css';

export default function Calendar({ data, onDayClick }) {
  const [selectedYear, setSelectedYear] = useState(2026);

  const getPointsClass = (points, date) => {
    if (points > 0) {
      if (points >= 60) return 'level-4';
      if (points >= 30) return 'level-3';
      if (points >= 15) return 'level-2';
      return 'level-1';
    }
    
    // 0 points
    if (isPast(date) && !isToday(date)) {
      return 'level-missed';
    }
    return 'level-0';
  };
  // Group days into months for the selectedYear (Jan-Dec) with padding 
  const generateMonthlyData = () => {
    const monthlyData = [];

    for (let month = 0; month < 12; month++) {
      const monthDate = startOfMonth(new Date(selectedYear, month, 1));
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
  
  const years = [2024, 2025, 2026, 2027];

  const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthlyData = generateMonthlyData();
  
  // Calculate offset to align the grid column start day based on weekday
  // By default we render columns of 7 descending rows
  
  return (
    <div className="calendar-wrapper flat-panel animate-fade-in p-6">
      <div className="calendar-header mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="text-emerald-400" size={24} />
            Exercise Frequency
          </h2>
          <p className="text-secondary mt-1 text-sm">Track your daily intensity for the selected year.</p>
        </div>
        
        <div className="year-selector flex items-center gap-3">
          <label htmlFor="year-select" className="text-sm font-bold text-slate-400 uppercase tracking-widest">Year:</label>
          <select 
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-slate-800 border-none text-white font-bold py-2 px-4 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      
      <div className="calendar-months-container grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {monthlyData.map((month) => (
          <div key={month.name} className="month-section animate-fade-in">
            <h3 className="text-lg font-bold mb-4 text-emerald-400">{month.name}</h3>
            
            <div className="weekday-header grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-500">
              {WEEKDAYS.map((day, idx) => <span key={idx}>{day}</span>)}
            </div>

            <div className="calendar-grid-monthly">
              {month.days.map((date, idx) => {
                if (!date) return <div key={`empty-${idx}`} className="calendar-cell-empty" />;
                
                const dateStr = format(date, 'yyyy-MM-dd');
                const points = data[dateStr] || 0;
                const pointClass = getPointsClass(points, date);
                
                return (
                  <button
                    key={dateStr}
                    onClick={() => onDayClick(date, points)}
                    className={`calendar-cell ${pointClass} flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-110 hover:z-10`}
                    title={`${dateStr} - Points: ${points}`}
                    aria-label={`Log exercise for ${dateStr}`}
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

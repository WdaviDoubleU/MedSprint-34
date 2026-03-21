import { X } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import './DayModal.css';

const levels = [
  { value: 0, label: 'Rest Day (No Activity)', colorClass: 'level-0' },
  { value: 1, label: 'Light Activity', colorClass: 'level-1' },
  { value: 2, label: 'Moderate Activity', colorClass: 'level-2' },
  { value: 3, label: 'Intense Workout', colorClass: 'level-3' },
  { value: 4, label: 'Very Intense', colorClass: 'level-4' },
];

export default function DayModal({ isOpen, onClose, date, initialLevel, onSave }) {
  if (!isOpen || !date) return null;

  const dateStr = format(date, 'MMMM d, yyyy');

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div 
        className="modal-content flat-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Log Activity</h3>
          <button 
            className="text-secondary hover:text-primary transition-colors"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-secondary mb-4">Select intensity for {dateStr}</p>
        
        <div className="flex flex-col gap-3">
          {levels.map((lvl) => (
            <button
              key={lvl.value}
              onClick={() => onSave(date, lvl.value)}
              className={clsx(
                "intensity-option flex items-center gap-3 p-3 rounded-lg border transition-all",
                initialLevel === lvl.value ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-slate-300 bg-white"
              )}
            >
              <div className={clsx("w-6 h-6 rounded-md", lvl.colorClass)} />
              <span className="font-medium">{lvl.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

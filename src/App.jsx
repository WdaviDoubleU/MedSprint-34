import { useState } from 'react';
import { format } from 'date-fns';
import { useExerciseData } from './hooks/useExerciseData';
import Calendar from './components/Calendar';
import DayModal from './components/DayModal';
import StartExercise from './components/StartExercise';
import './App.css';

function App() {
  const { data, addPoints } = useExerciseData();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [activeTab, setActiveTab] = useState('start_exercise');

  const handleDayClick = (date, currentLevel) => {
    setSelectedDate(date);
    setSelectedLevel(currentLevel);
    setModalOpen(true);
  };

  const handleSaveActivity = (date, level) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    // For manual logs, we can map levels to points (e.g., 1 level = 10 pts)
    addPoints(dateStr, level * 10);
    setModalOpen(false);
  };

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayLevel = data[todayStr] || 0;

  return (
    <div className="app-container p-6 w-full flex flex-col items-center min-h-screen">
      <header className="mb-12 text-center animate-fade-in w-full" style={{ animationDelay: '0.1s' }}>
        <h1 className="text-4xl md:text-6xl font-black mb-4 text-emerald-600 tracking-tight">
          Fan of Exercise
        </h1>
        <p className="text-secondary text-lg">Consistency is key. Track your daily momentum.</p>
        
        <div className="mt-8 inline-block flat-panel px-6 py-3 border-slate-200">
          <p className="text-secondary text-xs font-bold uppercase tracking-wider">Today's Intensity</p>
          <div className="flex items-center gap-3 justify-center mt-2">
             <div className={`w-8 h-8 rounded-md level-${todayLevel} border border-slate-200`} />
             <span className="font-bold text-slate-900">{todayLevel === 0 ? "Not logged yet" : `Level ${todayLevel}`}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button 
            className={`px-6 py-2 rounded-lg font-bold transition-all border-2 ${activeTab === 'start_exercise' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
            onClick={() => setActiveTab('start_exercise')}
          >
            Start Exercise
          </button>
          <button 
            className={`px-6 py-2 rounded-lg font-bold transition-all border-2 ${activeTab === 'calendar' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
            onClick={() => setActiveTab('calendar')}
          >
            Calendar
          </button>
        </div>
      </header>

      {activeTab === 'calendar' ? (
        <main className="w-full flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Calendar data={data} onDayClick={handleDayClick} />
        </main>
      ) : (
        <main className="w-full flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <StartExercise addPoints={addPoints} />
        </main>
      )}

      <DayModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        date={selectedDate}
        initialLevel={selectedLevel}
        onSave={handleSaveActivity}
      />
    </div>
  );
}

export default App;

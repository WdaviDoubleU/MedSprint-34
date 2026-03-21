import { useState } from 'react';
import { format } from 'date-fns';
import { useExerciseData } from './hooks/useExerciseData';
import Calendar from './components/Calendar';
import DayModal from './components/DayModal';
import StartExercise from './components/StartExercise';
import Leaderboard from './components/Leaderboard';
import Home from './components/Home';
import './App.css';

function App() {
  const { data, addPoints } = useExerciseData();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [activeTab, setActiveTab] = useState('home');

  const handleDayClick = (date, currentLevel) => {
    setSelectedDate(date);
    setSelectedLevel(currentLevel);
    setModalOpen(true);
  };

  const handleSaveActivity = (date, level) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    addPoints(dateStr, level * 10);
    setModalOpen(false);
  };

  const NAV_TABS = [
    { id: 'home', label: '⌂ Home' },
    { id: 'start_exercise', label: 'Start Exercise' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'leaderboard', label: 'Leaderboard' },
  ];

  return (
    <div className="app-container w-full flex flex-col min-h-screen">
      {/* Nav bar — hidden on home screen to let the big landing breathe */}
      {activeTab !== 'home' && (
        <nav className="w-full flex justify-center gap-3 px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-50">
          {NAV_TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-5 py-2 rounded-lg font-bold transition-all border-2 text-sm ${activeTab === id
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
            >
              {label}
            </button>
          ))}
        </nav>
      )}

      {/* Pages */}
      {activeTab === 'home' && (
        <Home onNavigate={(tab) => setActiveTab(tab)} />
      )}

      {activeTab === 'calendar' && (
        <main className="flex-1 w-full flex justify-center animate-fade-in p-6">
          <Calendar data={data} onDayClick={handleDayClick} />
        </main>
      )}

      {activeTab === 'start_exercise' && (
        <main className="flex-1 w-full flex justify-center animate-fade-in p-6">
          <StartExercise addPoints={addPoints} />
        </main>
      )}

      {activeTab === 'leaderboard' && (
        <main className="flex-1 w-full flex justify-center animate-fade-in p-6">
          <Leaderboard />
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


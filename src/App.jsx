import { useState } from 'react';
import { format } from 'date-fns';
import { useExerciseData } from './hooks/useExerciseData';
import { Home as HomeIcon, Dumbbell, CalendarDays, Trophy, BarChart3 } from 'lucide-react';
import Calendar from './components/Calendar';
import DayModal from './components/DayModal';
import StartExercise from './components/StartExercise';
import Leaderboard from './components/Leaderboard';
import Home from './components/Home';
import FanBackground from './components/FanBackground';
import StatsSummary from './components/StatsSummary';
import './App.css';

function App() {
  const { data, addPoints } = useExerciseData();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRawPoints, setSelectedRawPoints] = useState(0);
  const [modalIsExample, setModalIsExample] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const handleDayClick = (date, rawPoints, isExample) => {
    setSelectedDate(date);
    setSelectedRawPoints(rawPoints);
    setModalIsExample(isExample);
    setModalOpen(true);
  };

  const NAV_TABS = [
    { id: 'home', label: 'Home', Icon: HomeIcon },
    { id: 'start_exercise', label: 'Start Exercise', Icon: Dumbbell },
    { id: 'calendar', label: 'Calendar', Icon: CalendarDays },
    { id: 'stats', label: 'Stats', Icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard', Icon: Trophy },
  ];

  return (
    <div className="app-shell relative w-full min-h-screen">
      <FanBackground />
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <nav
          className="app-nav w-full flex flex-wrap justify-center items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 border-b-2 border-slate-100 bg-white sticky top-0 z-50 shrink-0"
          aria-label="Main"
        >
          {NAV_TABS.map((tab) => {
            const NavIcon = tab.Icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl font-bold transition-all border-2 text-sm whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
              >
                <NavIcon size={16} className="shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex-1 flex flex-col min-h-0 w-full">
          {activeTab === 'home' && (
            <Home onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'calendar' && (
            <main className="flex-1 w-full flex justify-center animate-fade-in p-6 min-h-0">
              <div className="app-main-inner w-full">
                <Calendar data={data} onDayClick={handleDayClick} />
              </div>
            </main>
          )}

          {activeTab === 'start_exercise' && (
            <main className="flex-1 w-full flex justify-center animate-fade-in p-6 min-h-0">
              <div className="app-main-inner w-full">
                <StartExercise addPoints={addPoints} />
              </div>
            </main>
          )}

          {activeTab === 'stats' && (
            <main className="flex-1 w-full flex justify-center animate-fade-in p-6 min-h-0">
              <div className="app-main-inner w-full">
                <StatsSummary />
              </div>
            </main>
          )}

          {activeTab === 'leaderboard' && (
            <main className="flex-1 w-full flex justify-center animate-fade-in p-6 min-h-0">
              <div className="app-main-inner w-full">
                <Leaderboard />
              </div>
            </main>
          )}
        </div>
      </div>

      <DayModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        date={selectedDate}
        rawPoints={selectedRawPoints}
        isExample={modalIsExample}
      />
    </div>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadPage from './pages/UploadPage';
import JobsPage from './pages/JobsPage';
import DashboardPage from './pages/DashboardPage';

const HexagonBackground = () => (
  <svg 
    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-[0.06] z-0"
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {[10, 25, 40].map((r, i) => (
      <polygon 
        key={i}
        points="50,10 85,30 85,70 50,90 15,70 15,30" 
        fill="none" 
        stroke="#1A1A1A" 
        strokeWidth="0.5" 
        transform={`scale(${r/40})`}
        style={{ transformOrigin: '50% 50%' }}
      />
    ))}
  </svg>
);

const AppLayout = () => {
  const location = useLocation();
  const isUploadPage = location.pathname === '/';

  return (
    <>
      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.045]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 18v4m-2-2h4' stroke='%231A1A1A' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px'
      }} />
      
      {isUploadPage && <HexagonBackground />}

      <div className="flex flex-col min-h-screen z-10 relative">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/dashboard/:jobId" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;

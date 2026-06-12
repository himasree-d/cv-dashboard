import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `relative text-accent-primary no-underline py-1 group transition-colors duration-200 ${isActive ? 'font-medium' : 'hover:text-accent-highlight'}`;
  };

  const Underline = ({ path }) => {
    const isActive = location.pathname === path;
    return (
      <span 
        className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-accent-highlight transform origin-left transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
      />
    );
  };

  return (
    <nav className="h-[56px] border-b border-border bg-surface flex items-center justify-between px-6 z-50 sticky top-0">
      <Link to="/" className="font-mono-custom tracking-[0.1em] text-accent-primary font-medium text-[15px]">
        CV DASHBOARD
      </Link>
      
      <div className="flex items-center space-x-6 text-[15px]">
        <Link to="/" className={navLinkClass('/')}>
          Upload
          <Underline path="/" />
        </Link>
        <Link to="/jobs" className={navLinkClass('/jobs')}>
          Jobs
          <Underline path="/jobs" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

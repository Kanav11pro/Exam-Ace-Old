import { ThemeToggle } from './ThemeToggle';
import { Link } from 'react-router-dom';
export function Header() {
  return <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="add hamburger">
        <Link to="/" className="font-bold text-xl flex items-center">
          <span className="mr-2">📊</span>
          <span>JEE Prepometer</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>;
}
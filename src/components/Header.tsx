
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthModal from './AuthModal';

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder until Supabase is integrated

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    // Placeholder for Supabase logout
    setIsLoggedIn(false);
  };

  // Placeholder login function for demo purposes
  const handleDemoLogin = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  return (
    <header className="rant-header">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">RantRoom</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'ghost'} 
              size="icon"
              aria-label="Home"
            >
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          
          {isLoggedIn && (
            <>
              <Link to="/create">
                <Button 
                  variant={location.pathname === '/create' ? 'default' : 'ghost'} 
                  size="icon"
                  aria-label="Create Rant"
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/profile">
                <Button 
                  variant={location.pathname === '/profile' ? 'default' : 'ghost'} 
                  size="icon"
                  aria-label="Profile"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
          
          {!isLoggedIn && (
            <Button onClick={handleAuthClick}>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
      
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onLogin={handleDemoLogin}
        />
      )}
    </header>
  );
};

export default Header;

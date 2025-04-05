
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, User, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
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
          
          {user && (
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
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          )}
          
          {!user && (
            <Link to="/auth">
              <Button>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;


import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import RantCard from '@/components/RantCard';
import RantForm from '@/components/RantForm';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [rants, setRants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder until Supabase integration
  const loadingRef = useRef(null);
  
  // Mock data - will be replaced with Supabase data
  const mockRants = [
    {
      id: '1',
      content: 'Today I had to wait 20 minutes for my coffee at the local cafe, and when I finally got it, it was lukewarm. Is it too much to ask for hot coffee in exchange for $6?!',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      user: {
        id: 'user1',
        name: 'Coffee Lover',
      },
      likes_count: 15,
      comments_count: 3,
    },
    {
      id: '2',
      content: 'Why does every streaming service need its own subscription now? I might as well go back to cable TV at this point! 📺💸',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      user: {
        id: 'user2',
        name: 'TV Enthusiast',
      },
      likes_count: 42,
      comments_count: 7,
    },
    {
      id: '3',
      content: 'Just spent 3 hours on hold with customer service only to be disconnected when I finally reached a human. Then they have the audacity to email me a satisfaction survey. 🤬',
      created_at: new Date(Date.now() - 14400000).toISOString(),
      user: {
        id: 'user3',
        name: 'Patient Person',
      },
      likes_count: 89,
      comments_count: 12,
    },
  ];

  // Simulate loading more rants for infinite scrolling
  const fetchMoreRants = () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simulate API call - will be replaced with Supabase
    setTimeout(() => {
      const newRants = mockRants.map(rant => ({
        ...rant,
        id: `${rant.id}-${page}`,
        created_at: new Date(Date.now() - (page * 86400000) - Math.random() * 100000).toISOString(),
      }));
      
      setRants(prevRants => [...prevRants, ...newRants]);
      setPage(prev => prev + 1);
      setIsLoading(false);
      
      // Stop after 5 pages for this demo
      if (page >= 5) {
        setHasMore(false);
      }
    }, 1000);
  };
  
  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreRants();
        }
      },
      { threshold: 1.0 }
    );
    
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }
    
    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [hasMore, isLoading]);
  
  // Initial load
  useEffect(() => {
    fetchMoreRants();
    
    // Demo login - will be replaced with Supabase auth
    setIsLoggedIn(false);
  }, []);
  
  const handleNewRant = async (content: string) => {
    // Will be replaced with Supabase integration
    const newRant = {
      id: `new-${Date.now()}`,
      content,
      created_at: new Date().toISOString(),
      user: {
        id: 'demo-user-id',
        name: 'Demo User',
      },
      likes_count: 0,
      comments_count: 0,
      user_has_liked: false,
    };
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setRants(prevRants => [newRant, ...prevRants]);
    return;
  };
  
  const handleDeleteRant = (rantId: string) => {
    // Will be replaced with Supabase integration
    setRants(prevRants => prevRants.filter(rant => rant.id !== rantId));
  };

  return (
    <div>
      <Header />
      
      <div className="rant-container">
        {isLoggedIn && (
          <Card className="mb-6 p-4">
            <RantForm onSubmit={handleNewRant} />
          </Card>
        )}
        
        <div className="space-y-4">
          {rants.length === 0 && !isLoading ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-2">Welcome to RantRoom!</h2>
              <p className="text-muted-foreground">
                Be the first to share your thoughts and frustrations.
              </p>
            </div>
          ) : (
            rants.map(rant => (
              <RantCard
                key={rant.id}
                rant={rant}
                currentUserId={isLoggedIn ? 'demo-user-id' : undefined}
                onDelete={handleDeleteRant}
              />
            ))
          )}
          
          {isLoading && (
            <div className="py-4 text-center">
              <p className="text-muted-foreground">Loading more rants...</p>
            </div>
          )}
          
          {!isLoading && !hasMore && rants.length > 0 && (
            <div className="py-4 text-center">
              <p className="text-muted-foreground">No more rants to load</p>
            </div>
          )}
          
          <div ref={loadingRef} className="h-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;

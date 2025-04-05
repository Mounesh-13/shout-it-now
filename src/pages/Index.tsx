
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import RantCard from '@/components/RantCard';
import RantForm from '@/components/RantForm';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type RantWithUser = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  likes_count: number;
  comments_count: number;
  user: {
    id: string;
    name: string;
    avatar_url?: string | null;
  };
};

const Index = () => {
  const [rants, setRants] = useState<RantWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const loadingRef = useRef(null);
  
  // Fetch rants from Supabase
  const fetchRants = async (pageNumber = 1) => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    try {
      // For pagination, calculate the range
      const from = (pageNumber - 1) * 10;
      const to = from + 9;
      
      // First, fetch the rants
      const { data: rantsData, error: rantsError } = await supabase
        .from('rants')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (rantsError) {
        console.error('Error fetching rants:', rantsError);
        return;
      }
      
      // If we have rants, fetch the associated profiles
      if (rantsData && rantsData.length > 0) {
        // Get unique user IDs
        const userIds = [...new Set(rantsData.map(rant => rant.user_id))];
        
        // Fetch profiles for these users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);
          
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }
        
        // Create a map of user IDs to profile data for quick lookup
        const profilesMap = new Map();
        profilesData?.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
        
        // Format data with user information
        const formattedRants = rantsData.map(rant => {
          const profile = profilesMap.get(rant.user_id);
          return {
            ...rant,
            user: {
              id: rant.user_id,
              name: profile?.username || 'Anonymous',
              avatar_url: profile?.avatar_url
            }
          };
        });
        
        if (pageNumber === 1) {
          setRants(formattedRants);
        } else {
          setRants(prev => [...prev, ...formattedRants]);
        }
      }
      
      // If we got fewer results than expected, there are no more to load
      if (!rantsData || rantsData.length < 10) {
        setHasMore(false);
      } else {
        setPage(pageNumber + 1);
      }
    } catch (error) {
      console.error('Error fetching rants:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchRants(page);
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
  }, [hasMore, isLoading, page]);
  
  // Initial load
  useEffect(() => {
    fetchRants(1);
  }, []);
  
  const handleNewRant = async (content: string) => {
    if (!user) return;
    
    try {
      // Add the rant
      const { data: newRantData, error: newRantError } = await supabase
        .from('rants')
        .insert([
          { content, user_id: user.id }
        ])
        .select()
        .single();
      
      if (newRantError) {
        console.error('Error creating rant:', newRantError);
        return;
      }
      
      if (!newRantData) return;
      
      // Get the user's profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile for new rant:', profileError);
      }
      
      // Create the formatted rant with user data
      const newRant: RantWithUser = {
        ...newRantData,
        user: {
          id: user.id,
          name: profileData?.username || 'Anonymous',
          avatar_url: profileData?.avatar_url
        }
      };
      
      // Add to state
      setRants(prev => [newRant, ...prev]);
    } catch (error) {
      console.error('Error creating rant:', error);
    }
  };
  
  const handleDeleteRant = async (rantId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('rants')
        .delete()
        .eq('id', rantId)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error deleting rant:', error);
        return;
      }
      
      setRants(prev => prev.filter(rant => rant.id !== rantId));
    } catch (error) {
      console.error('Error deleting rant:', error);
    }
  };

  return (
    <div>
      <Header />
      
      <div className="rant-container">
        {user && (
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
                currentUserId={user?.id}
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

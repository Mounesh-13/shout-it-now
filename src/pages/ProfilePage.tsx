
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Profile from '@/components/Profile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  
  // Check if this is the current user's profile
  const isCurrentUserProfile = userId === 'profile' || (!userId && user) || (userId && user && userId === user.id);
  const profileId = isCurrentUserProfile ? user?.id : userId;

  // Check if the profile exists
  useEffect(() => {
    if (!profileId) {
      setIsLoading(false);
      return;
    }

    const checkProfile = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', profileId)
          .maybeSingle();
        
        if (error) {
          console.error('Error checking profile:', error);
          setProfileExists(false);
        } else {
          setProfileExists(!!data);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        setProfileExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();
  }, [profileId]);

  // Redirect to login if trying to view own profile but not logged in
  useEffect(() => {
    if (userId === 'profile' && !user) {
      navigate('/auth');
    }
  }, [userId, user, navigate]);

  return (
    <div>
      <Header />
      
      <div className="rant-container">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {isLoading ? (
          <div className="text-center py-10">
            <p>Loading profile...</p>
          </div>
        ) : !profileExists ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground">
              The profile you're looking for doesn't exist.
            </p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
          </div>
        ) : (
          <Profile 
            userId={profileId || ''} 
            isCurrentUser={isCurrentUserProfile}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

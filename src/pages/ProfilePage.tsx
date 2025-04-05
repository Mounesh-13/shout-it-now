
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Profile from '@/components/Profile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const currentUserId = 'demo-user-id'; // Placeholder until Supabase auth
  const isCurrentUser = userId === 'profile' || userId === currentUserId;
  
  // When url is /profile, show current user's profile
  const profileId = userId === 'profile' ? currentUserId : userId || '';

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
        
        <Profile 
          userId={profileId} 
          isCurrentUser={isCurrentUser}
        />
      </div>
    </div>
  );
};

export default ProfilePage;

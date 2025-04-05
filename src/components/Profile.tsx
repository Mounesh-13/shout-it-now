
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RantCard from './RantCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Database } from '@/integrations/supabase/types';

interface ProfileProps {
  userId: string;
  isCurrentUser?: boolean;
}

type ProfileData = Database['public']['Tables']['profiles']['Row'];
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

const Profile = ({ userId, isCurrentUser = false }: ProfileProps) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userRants, setUserRants] = useState<RantWithUser[]>([]);
  const [likedRants, setLikedRants] = useState<RantWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }
        
        setProfileData(profileData);
        
        // Fetch user rants separately
        const { data: rantsData, error: rantsError } = await supabase
          .from('rants')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (rantsError) {
          console.error('Error fetching user rants:', rantsError);
          return;
        }
        
        // Fetch profile data for all rants
        if (rantsData && rantsData.length > 0) {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .eq('id', userId)
            .single();
            
          if (userError) {
            console.error('Error fetching user data:', userError);
            return;
          }
          
          // Format data with user information
          const formattedRants = rantsData.map(rant => ({
            ...rant,
            user: {
              id: rant.user_id,
              name: userData?.username || 'Anonymous',
              avatar_url: userData?.avatar_url
            }
          }));
          
          setUserRants(formattedRants);
        } else {
          setUserRants([]);
        }
      } catch (error) {
        console.error('Error in profile data fetching:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchProfileData();
    }
  }, [userId]);
  
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
      
      setUserRants(prev => prev.filter(rant => rant.id !== rantId));
    } catch (error) {
      console.error('Error deleting rant:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (!profileData) {
    return <div className="text-center py-10">Profile not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profileData.avatar_url || undefined} />
          <AvatarFallback>{getInitials(profileData.username || 'User')}</AvatarFallback>
        </Avatar>
        
        <div>
          <h1 className="text-2xl font-bold">{profileData.username || 'Anonymous'}</h1>
          <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
            <span>{userRants.length} Rants</span>
            <span>Joined {new Date(profileData.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="rants">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rants">Rants</TabsTrigger>
          <TabsTrigger value="liked">Liked</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rants" className="mt-4">
          {userRants.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No rants yet</p>
              {isCurrentUser && (
                <p className="text-sm">Your rants will appear here after you post them.</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {userRants.map((rant) => (
                <RantCard 
                  key={rant.id} 
                  rant={rant} 
                  currentUserId={isCurrentUser ? userId : undefined}
                  onDelete={isCurrentUser ? handleDeleteRant : undefined}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="liked" className="mt-4">
          <div className="text-center py-10">
            <p className="text-muted-foreground">No liked rants yet</p>
            {isCurrentUser && (
              <p className="text-sm">Rants you like will appear here.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;

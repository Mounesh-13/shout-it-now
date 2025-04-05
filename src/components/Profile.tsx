
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RantCard from './RantCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface ProfileProps {
  userId: string;
  isCurrentUser?: boolean;
}

interface ProfileData {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

const Profile = ({ userId, isCurrentUser = false }: ProfileProps) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userRants, setUserRants] = useState<any[]>([]);
  const [likedRants, setLikedRants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchUserRants = async () => {
      try {
        const { data, error } = await supabase
          .from('rants')
          .select(`
            *,
            profiles:user_id (
              username,
              avatar_url
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching user rants:', error);
          return;
        }
        
        // Format data to match the expected structure
        const formattedRants = data.map(rant => ({
          ...rant,
          user: {
            id: rant.user_id,
            name: rant.profiles?.username || 'Anonymous',
            avatar_url: rant.profiles?.avatar_url
          }
        }));
        
        setUserRants(formattedRants);
      } catch (error) {
        console.error('Error fetching user rants:', error);
      }
    };
    
    if (userId) {
      fetchProfileData();
      fetchUserRants();
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

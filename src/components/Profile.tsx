
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RantCard from './RantCard';

interface ProfileProps {
  userId: string;
  isCurrentUser?: boolean;
}

const Profile = ({ userId, isCurrentUser = false }: ProfileProps) => {
  // Mock data - will be replaced with Supabase data
  const userData = {
    id: userId,
    name: 'Demo User',
    avatar_url: '',
    bio: 'Just a demo user who loves to rant!',
    rants_count: 5,
    joined_date: '2023-01-01',
  };
  
  const userRants = [
    {
      id: '1',
      content: 'This is a demo rant from my profile. I have a lot to say about this topic!',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      user: {
        id: userId,
        name: userData.name,
        avatar_url: userData.avatar_url,
      },
      likes_count: 5,
      comments_count: 2,
    },
    {
      id: '2',
      content: 'Another demo rant to show multiple rants on the profile page.',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      user: {
        id: userId,
        name: userData.name,
        avatar_url: userData.avatar_url,
      },
      likes_count: 10,
      comments_count: 3,
    },
  ];
  
  const handleDeleteRant = (rantId: string) => {
    // Will be replaced with Supabase integration
    console.log('Delete rant:', rantId);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={userData.avatar_url} />
          <AvatarFallback>{getInitials(userData.name)}</AvatarFallback>
        </Avatar>
        
        <div>
          <h1 className="text-2xl font-bold">{userData.name}</h1>
          <p className="text-muted-foreground">{userData.bio}</p>
          <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
            <span>{userData.rants_count} Rants</span>
            <span>Joined {new Date(userData.joined_date).toLocaleDateString()}</span>
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
            <div>
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

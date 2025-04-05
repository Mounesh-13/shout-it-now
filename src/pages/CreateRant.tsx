
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import RantForm from '@/components/RantForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const CreateRant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a rant",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [user, navigate, toast]);
  
  const handleSubmitRant = async (content: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('rants')
        .insert([
          { content, user_id: user.id }
        ]);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to create rant: " + error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "Your rant has been posted",
      });
      
      // Navigate to home
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create rant: " + error.message,
        variant: "destructive",
      });
    }
  };

  // Don't render the form if not logged in
  if (!user) {
    return (
      <div>
        <Header />
        <div className="rant-container pt-10 text-center">
          <p>Please log in to create a rant.</p>
          <Button className="mt-4" onClick={() => navigate('/auth')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

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
        
        <Card>
          <CardHeader>
            <CardTitle>Create a New Rant</CardTitle>
          </CardHeader>
          <CardContent>
            <RantForm 
              onSubmit={handleSubmitRant}
              placeholder="What's bothering you today?"
              buttonText="Post Rant"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRant;

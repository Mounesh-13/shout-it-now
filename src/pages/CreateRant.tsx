
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import RantForm from '@/components/RantForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CreateRant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmitRant = async (content: string) => {
    // Will be replaced with Supabase integration
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Success, navigate to home
    navigate('/');
  };

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

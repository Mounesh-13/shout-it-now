
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Send } from 'lucide-react';

interface RantFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  buttonText?: string;
  initialContent?: string;
}

const RantForm = ({
  onSubmit,
  placeholder = "What's on your mind?",
  buttonText = "Post Rant",
  initialContent = "",
}: RantFormProps) => {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const maxLength = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Rant cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    if (content.length > maxLength) {
      toast({
        title: "Error",
        description: `Rant cannot be longer than ${maxLength} characters`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(content);
      setContent("");
      toast({
        title: "Success",
        description: "Your rant has been posted!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post rant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px] resize-none"
      />
      
      <div className="flex items-center justify-between">
        <span className={`text-sm ${
          content.length > maxLength ? "text-destructive" : "text-muted-foreground"
        }`}>
          {content.length}/{maxLength}
        </span>
        
        <Button 
          type="submit" 
          disabled={isSubmitting || !content.trim() || content.length > maxLength}
        >
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? "Posting..." : buttonText}
        </Button>
      </div>
    </form>
  );
};

export default RantForm;

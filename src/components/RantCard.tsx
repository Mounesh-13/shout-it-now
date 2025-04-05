
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import CommentSection from './CommentSection';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RantCardProps {
  rant: {
    id: string;
    content: string;
    created_at: string;
    user: {
      id: string;
      name: string;
      avatar_url?: string;
    };
    likes_count: number;
    comments_count: number;
    user_has_liked?: boolean;
  };
  currentUserId?: string;
  onDelete?: (id: string) => void;
}

const RantCard = ({ rant, currentUserId, onDelete }: RantCardProps) => {
  const [isLiked, setIsLiked] = useState(rant.user_has_liked || false);
  const [likesCount, setLikesCount] = useState(rant.likes_count);
  const [showComments, setShowComments] = useState(false);
  const isAuthor = currentUserId === rant.user.id;
  const timeAgo = formatDistanceToNow(new Date(rant.created_at), { addSuffix: true });

  const handleLike = () => {
    // Will be replaced with Supabase integration
    if (isLiked) {
      setIsLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(rant.id);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2 pt-4 flex flex-row justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={rant.user.avatar_url} />
            <AvatarFallback>{getInitials(rant.user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <Link 
              to={`/user/${rant.user.id}`} 
              className="font-semibold hover:underline"
            >
              {rant.user.name}
            </Link>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        
        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      
      <CardContent className="py-3">
        <p className="whitespace-pre-wrap">{rant.content}</p>
      </CardContent>
      
      <CardFooter className="flex flex-col pb-2">
        <Separator className="mb-2" />
        <div className="flex w-full justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLike}
            className={isLiked ? "text-primary" : ""}
          >
            <Heart className={`mr-1 h-4 w-4 ${isLiked ? "fill-primary" : ""}`} />
            {likesCount > 0 && likesCount}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="mr-1 h-4 w-4" />
            {rant.comments_count > 0 && rant.comments_count}
          </Button>
        </div>
        
        {showComments && (
          <div className="mt-3 w-full">
            <CommentSection rantId={rant.id} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default RantCard;

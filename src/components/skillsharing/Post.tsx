'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Comment {
  id: string;
  uid: string;
  uname: string;
  text: string;
}

interface Post {
  id: string;
  userId: string;
  description: string;
  url: string;
  date: string;
  comments: Comment[];
  likes: Like[];
  tags: string[];
}

interface Like {
  userId: string;
}

interface PostProps {
  post: Post;
  onDelete: (postId: string) => void;
  onUpdate: (postId: string, updatedData: Partial<Post>) => void;
  currentUser: {
    id: string;
    name: string;
  };
}

export const Post: React.FC<PostProps> = ({ post, onDelete, onUpdate, currentUser }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [mediaError, setMediaError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(post.description);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const response = await axios.post<Comment>(`http://localhost:8080/api/comments/${post.id}`, {
        uid: currentUser.id,
        uname: currentUser.name,
        text: newComment
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpdate = () => {
    onUpdate(post.id, { description: editedDescription });
    setIsEditing(false);
  };

  const isVideo = post.url?.toLowerCase().includes('video');

  const renderMedia = () => {
    if (!post.url || mediaError) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px] bg-gray-100 rounded-lg">
          <i className={`fas ${isVideo ? 'fa-video' : 'fa-image'} text-4xl mb-2 text-gray-400`}></i>
          <p className="text-sm text-gray-500">{isVideo ? 'Video' : 'Image'} not available</p>
        </div>
      );
    }

    if (isVideo) {
      return (
        <video 
          className="w-full max-h-[500px] rounded-lg bg-black mb-4"
          controls
          onError={() => setMediaError(true)}
          playsInline
          preload="metadata"
        >
          <source src={post.url} type="video/mp4" />
          Your browser does not support video playback.
        </video>
      );
    }

    return (
      <img 
        src={post.url} 
        alt="Post content" 
        className="w-full rounded-lg mb-4"
        onError={() => setMediaError(true)}
      />
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      {renderMedia()}
      
      {isEditing ? (
        <div className="mb-6">
          <Input
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="mb-2 text-black"
          />
          <div className="flex gap-2">
            <Button onClick={handleUpdate} className="bg-green-500 hover:bg-green-600 text-white">
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-black text-lg mb-3">{post.description}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </>
      )}
      
      {post.userId === currentUser.id && (
        <div className="flex gap-2 mb-6">
          <Button 
            variant="destructive" 
            onClick={() => onDelete(post.id)}
          >
            Delete Post
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            Edit Post
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-black mb-4">Comments</h4>
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                {comment.uname[0]}
              </div>
              <strong className="text-black font-semibold">{comment.uname}</strong>
            </div>
            <p className="text-black ml-10 text-base">{comment.text}</p>
          </div>
        ))}
        
        <div className="flex gap-3 mt-6">
          <Input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-white border-gray-200 text-black placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
          />
          <Button 
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}; 
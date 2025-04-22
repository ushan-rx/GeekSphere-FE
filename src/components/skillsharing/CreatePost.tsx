'use client';

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Image as ImageIcon, Video, X, Loader2, Upload, Camera, Smile, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CreatePostProps {
  onPostCreated: () => void;
  currentUser: {
    id: string;
    name: string;
  };
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, currentUser }) => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = currentTag.trim().toLowerCase();
      if (tag && !tags.includes(tag) && tags.length < 5) {
        setTags([...tags, tag]);
        setCurrentTag('');
      }
    } else if (e.key === 'Backspace' && !currentTag) {
      e.preventDefault();
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!description.trim() || !selectedFile) {
      alert('Please provide both description and file');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('userId', currentUser.id);
      formData.append('description', description.trim());
      formData.append('file', selectedFile);
      formData.append('tags', JSON.stringify(tags));

      const response = await axios.post('/api/posts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data) {
        setDescription('');
        clearSelectedFile();
        setTags([]);
        onPostCreated();
      }
    } catch (error: any) {
      console.error('Upload error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVideo = selectedFile?.type.startsWith('video/');
  const isImage = selectedFile?.type.startsWith('image/');

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg overflow-hidden sticky top-4">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white text-center">Create Post</h2>
      </div>

      <div className="max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {/* User Info & Input */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
              {currentUser.name[0]}
            </div>
            <span className="font-semibold text-white">{currentUser.name}</span>
          </div>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's on your mind?"
            className="min-h-[120px] resize-none bg-transparent border-none text-white text-lg placeholder:text-gray-400/70 focus:ring-0 p-0"
          />
        </div>

        {/* Tags Input */}
        <div className="px-4 mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 transition-colors"
              >
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 hover:text-red-400"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="relative">
            <Input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Add tags (max 5) - Press Enter or comma to add"
              className="bg-transparent border-gray-700 text-white placeholder:text-gray-400/70"
              maxLength={20}
            />
            <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>

        {/* Media Preview */}
        {previewUrl && (
          <div className="px-4 mb-4">
            <div className="relative rounded-lg overflow-hidden bg-black">
              <div className="relative aspect-video">
                {isVideo ? (
                  <video 
                    ref={videoRef}
                    src={previewUrl} 
                    className="w-full h-full object-contain"
                    controls
                    playsInline
                    preload="metadata"
                    onError={() => {
                      console.error('Video preview error');
                      clearSelectedFile();
                    }}
                  />
                ) : isImage ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                    onError={() => {
                      console.error('Image preview error');
                      clearSelectedFile();
                    }}
                  />
                ) : null}
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-full opacity-90 hover:opacity-100"
                onClick={clearSelectedFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add to Your Post - Fixed Bottom Section */}
      <div className="border-t border-gray-700 bg-gray-800/80 backdrop-blur-sm">
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">Add to your post</span>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="hidden"
                id="media-upload"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-green-400 hover:text-green-300 hover:bg-green-400/10 transition-colors duration-200"
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 transition-colors duration-200"
              >
                <Video className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 transition-colors duration-200"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Post Button */}
        <div className="p-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !description.trim() || !selectedFile}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Post
              </>
            )}
          </Button>

          {/* Loading Progress */}
          {isSubmitting && (
            <div className="w-full bg-gray-700/50 rounded-full h-1 mt-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                style={{ width: '100%' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 
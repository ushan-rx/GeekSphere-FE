import React from 'react';
import { Stories } from '@/components/skillsharing/Stories';
import { PostList } from '@/components/skillsharing/PostList';

export default function SkillSharingPage() {
  return (
    <div className="w-full max-w-[1000px] mx-auto">
      <div className="stories-section">
        <Stories />
      </div>
      <div className="main-feed">
        <PostList />
      </div>
    </div>
  );
} 
import { LucideIcon } from 'lucide-react';

export type NavMain = {
  type: 'main';
  name: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
};

export type NavSub = {
  type: 'sub';
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items: {
    name: string;
    url: string;
  }[];
};

export type NavigationArray = (NavMain | NavSub)[];

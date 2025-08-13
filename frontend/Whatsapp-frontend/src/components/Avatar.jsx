/** 
 * Avatar Component - WhatsApp style avatars with proper sizing
 */
import React from 'react';

const getInitials = (nameOrAvatar) => {
  if (!nameOrAvatar) return "U";
  if (nameOrAvatar.length <= 2) return nameOrAvatar.toUpperCase();
  return nameOrAvatar.split(' ')
    .map(s => s[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const Avatar = ({ text = "BA", size = 12 }) => {
  const initials = getInitials(text);
  
  // WhatsApp-like colors
  const colors = [
    '#00a884', '#0084ff', '#ff6b6b', '#4ecdc4', 
    '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'
  ];
  
  const colorIndex = (text || '').length % colors.length;
  const bg = colors[colorIndex];
  
  const sizeClasses = {
    8: 'w-8 h-8 text-xs',
    10: 'w-10 h-10 text-sm',  // Added size 10 for chat header
    12: 'w-12 h-12 text-sm',
    16: 'w-16 h-16 text-lg'
  };
  
  const sizePx = sizeClasses[size] || sizeClasses[12];
  
  return (
    <div
      className={`${sizePx} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
      style={{ backgroundColor: bg }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
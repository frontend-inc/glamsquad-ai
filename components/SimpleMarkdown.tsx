'use client';

import React from 'react';

interface SimpleMarkdownProps {
  children: string;
  className?: string;
}

export function SimpleMarkdown({ children, className = '' }: SimpleMarkdownProps) {
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return (
          <span key={index} className="font-bold">
            {boldText}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return <div className={className}>{renderText(children)}</div>;
}
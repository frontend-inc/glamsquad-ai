'use client';

import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface ArticleCardProps {
  article: {
    id: number
    title: string
    article_content: string
    slug: string
    custom_domain: string
    locale: string
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  console.log('Rendering ArticleCard', article);
  const { 
    id,
    title, 
    article_content, 
    slug,
    locale,
    custom_domain 
  } = article;
  const snippet = article_content ? article_content.slice(0, 40) + '...' : '';
  const url = `https://${custom_domain}/${locale}/${slug}-${id}`

  console.log('Article URL:', url);
  return (
    <Card className="p-4 space-y-2 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start gap-3">
        <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-1">
          <h3 className="font-medium text-sm leading-tight">{title}</h3>
          {snippet && (
            <p className="text-sm text-muted-foreground line-clamp-2">{snippet}</p>
          )}
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:underline text-sm"
            >
            Read more
            </a>
        </div>
      </div>
    </Card>
  );
}
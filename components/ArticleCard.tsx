'use client';

import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface ArticleCardProps {
  title: string;
  snippet?: string;
  url?: string;
}

export function ArticleCard({ title, snippet, url }: ArticleCardProps) {

  return (
    <Card className="p-4 space-y-2 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start gap-3">
        <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-1">
          <h3 className="font-medium text-sm leading-tight">{title}</h3>
          {snippet && (
            <p className="text-sm text-muted-foreground line-clamp-2">{snippet}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
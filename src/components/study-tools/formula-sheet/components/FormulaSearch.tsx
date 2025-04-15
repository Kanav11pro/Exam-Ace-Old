
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, BookOpen } from 'lucide-react';

interface FormulaSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSubject: string;
  onSubjectChange: (value: string) => void;
  selectedChapter: string;
  onChapterChange: (value: string) => void;
  chapters: string[];
}

export function FormulaSearch({
  searchTerm,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedChapter,
  onChapterChange,
  chapters
}: FormulaSearchProps) {
  return (
    <Card className="mb-8">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search formulas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-1 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select 
                value={selectedSubject} 
                onValueChange={onSubjectChange}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="Maths">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedSubject !== 'all' && (
              <div className="flex items-center gap-1 w-full sm:w-auto">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <Select 
                  value={selectedChapter} 
                  onValueChange={onChapterChange}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chapters</SelectItem>
                    {chapters.map(chapter => (
                      <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

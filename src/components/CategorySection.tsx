import { useState } from 'react';
import { useJEEData } from '@/context/jee';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ProgressBar } from './ProgressBar';
import { categoryLabels, categoryDescriptions, fieldLabels } from '@/data/jeeData';

interface CategorySectionProps {
  subject: string;
  chapter: string;
  category: 'learn' | 'practice' | 'tests' | 'revise';
  fields: string[];
  isOpen: boolean;
}

export function CategorySection({ subject, chapter, category, fields, isOpen }: CategorySectionProps) {
  const { studyData, updateChapterData, getCategoryProgress } = useJEEData();
  const [isExpanded, setIsExpanded] = useState(isOpen);
  
  const chapterData = studyData[subject]?.[chapter] || {} as SubtopicData;
  const progress = getCategoryProgress(subject, chapter, category);

  const progressVariant = 
    subject === 'Maths' ? 'maths' :
    subject === 'Physics' ? 'physics' :
    'chemistry';

  const handleCheckboxChange = (field: string, checked: boolean) => {
    updateChapterData(subject, chapter, { [field]: checked });
  };

  const handleTagChange = (value: string) => {
    updateChapterData(subject, chapter, { tag: value as '' | 'Weak' | 'Medium' | 'Strong' });
  };

  const handleRemarksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateChapterData(subject, chapter, { remarks: e.target.value });
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`category-button category-button-${category} flex items-center`}
          aria-expanded={isExpanded}
          title={categoryDescriptions[category]}
        >
          <span>{categoryLabels[category]}</span>
          <span className="ml-2">
            {isExpanded ? '▼' : '▶'}
          </span>
        </button>
        <div className="w-1/3">
          <ProgressBar 
            progress={progress} 
            variant={progressVariant} 
            showPercentage 
          />
        </div>
      </div>
      
      {isExpanded && (
        <div className="animate-slide-in space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          {fields.map((field) => (
            <div key={field} className="flex items-start space-x-2">
              <Checkbox
                id={`${chapter}-${field}`}
                checked={chapterData[field as keyof SubtopicData] as boolean}
                onCheckedChange={(checked) => handleCheckboxChange(field, checked as boolean)}
              />
              <Label
                htmlFor={`${chapter}-${field}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {fieldLabels[field]}
              </Label>
            </div>
          ))}
          
          {category === 'practice' && (
            <div className="space-y-2 pt-2">
              <Label htmlFor={`${chapter}-tag`}>Tag this chapter:</Label>
              <Select
                value={chapterData.tag || "none"}
                onValueChange={handleTagChange}
              >
                <SelectTrigger id={`${chapter}-tag`}>
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Weak">Weak 😔</SelectItem>
                  <SelectItem value="Medium">Medium 😐</SelectItem>
                  <SelectItem value="Strong">Strong 💪</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {category === 'revise' && (
            <div className="space-y-2 pt-2">
              <Label htmlFor={`${chapter}-remarks`}>Notes & Remarks:</Label>
              <Textarea
                id={`${chapter}-remarks`}
                placeholder="Add your notes or remarks about this chapter..."
                value={chapterData.remarks || ""}
                onChange={handleRemarksChange}
                className="min-h-24"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

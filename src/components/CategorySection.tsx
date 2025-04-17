
import { useState } from 'react';
import { useJEEData } from '@/context/jee';
import { SubtopicData } from '@/context/jee/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ProgressBar } from './ProgressBar';
import { categoryLabels, categoryDescriptions, fieldLabels } from '@/data/jeeData';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

interface CategorySectionProps {
  subject: string;
  chapter: string;
  category: 'learn' | 'practice' | 'tests' | 'revise';
  fields: string[];
  isOpen: boolean;
}

export function CategorySection({ subject, chapter, category, fields, isOpen }: CategorySectionProps) {
  const { jeeData, updateChapterData, getCategoryProgress } = useJEEData();
  const [isExpanded, setIsExpanded] = useState(isOpen);
  
  const chapterData = jeeData.subjects[subject]?.[chapter] || {} as SubtopicData;
  const progress = getCategoryProgress(subject, chapter, category);

  const progressVariant = 
    subject === 'Maths' ? 'maths' :
    subject === 'Physics' ? 'physics' :
    'chemistry';

  const handleCheckboxChange = (field: string, checked: boolean) => {
    updateChapterData(subject, chapter, field, checked);
  };

  const handleTagChange = (value: string) => {
    updateChapterData(subject, chapter, 'tag', value);
  };

  const handleRemarksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateChapterData(subject, chapter, 'remarks', e.target.value);
  };

  // Get the background color based on category
  const getBgColor = () => {
    switch(category) {
      case 'learn': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'practice': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'tests': return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'revise': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      default: return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };
  
  // Get the icon color based on category
  const getIconColor = () => {
    switch(category) {
      case 'learn': return 'text-blue-600 dark:text-blue-400';
      case 'practice': return 'text-green-600 dark:text-green-400';
      case 'tests': return 'text-amber-600 dark:text-amber-400';
      case 'revise': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`category-button category-button-${category} flex items-center gap-2 hover-scale`}
          aria-expanded={isExpanded}
          title={categoryDescriptions[category]}
        >
          {isExpanded ? 
            <ChevronDown className={`h-5 w-5 ${getIconColor()}`} /> : 
            <ChevronRight className={`h-5 w-5 ${getIconColor()}`} />}
          <span>{categoryLabels[category]}</span>
        </button>
        <div className="w-1/3">
          <ProgressBar 
            progress={progress} 
            variant={progressVariant} 
            showPercentage 
            animated
          />
        </div>
      </div>
      
      {isExpanded && (
        <motion.div 
          className={`animate-fade-in space-y-4 p-5 rounded-lg ${getBgColor()} border`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => (
              <motion.div 
                key={field} 
                className={`flex items-start space-x-3 p-3 rounded-md ${chapterData[field as keyof SubtopicData] ? 
                  'bg-white/60 dark:bg-gray-800/30 shadow-sm' : 
                  'bg-white/30 dark:bg-gray-800/10'}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Checkbox
                  id={`${chapter}-${field}`}
                  checked={chapterData[field as keyof SubtopicData] as boolean}
                  onCheckedChange={(checked) => handleCheckboxChange(field, checked as boolean)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`${chapter}-${field}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                  >
                    {fieldLabels[field]}
                    {chapterData[field as keyof SubtopicData] ? 
                      <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                      <XCircle className="h-4 w-4 text-gray-300 dark:text-gray-600" />}
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getDescription(field)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {category === 'practice' && (
            <motion.div 
              className="space-y-2 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Label htmlFor={`${chapter}-tag`} className="text-sm font-medium">Tag this chapter:</Label>
              <Select
                value={chapterData.tag || "none"}
                onValueChange={handleTagChange}
              >
                <SelectTrigger id={`${chapter}-tag`} className="bg-white dark:bg-gray-800">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Weak">Weak 😔</SelectItem>
                  <SelectItem value="Medium">Medium 😐</SelectItem>
                  <SelectItem value="Strong">Strong 💪</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}
          
          {category === 'revise' && (
            <motion.div 
              className="space-y-2 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Label htmlFor={`${chapter}-remarks`} className="text-sm font-medium">Notes & Remarks:</Label>
              <Textarea
                id={`${chapter}-remarks`}
                placeholder="Add your notes or remarks about this chapter..."
                value={chapterData.remarks || ""}
                onChange={handleRemarksChange}
                className="min-h-24 bg-white dark:bg-gray-800"
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// Helper function to get detailed descriptions for each field
function getDescription(field: string): string {
  const descriptions: Record<string, string> = {
    notes: 'Complete lecture notes for comprehensive understanding',
    shortNotes: 'Condensed notes for quick revision',
    modules: 'Practice from standard module problems',
    ncert: 'Complete NCERT textbook exercises',
    pyqMains: 'Previous year questions from JEE Mains',
    pyqAdv: 'Previous year questions from JEE Advanced',
    testMains: 'Mock tests for JEE Mains preparation',
    testAdv: 'Mock tests for JEE Advanced preparation',
    revisedMains: 'Revised important concepts for JEE Mains',
    revisedAdv: 'Revised important concepts for JEE Advanced'
  };
  
  return descriptions[field] || '';
}

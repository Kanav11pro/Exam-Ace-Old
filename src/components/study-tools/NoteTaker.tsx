
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Save, FileText, Trash, Search, Edit, Check, X } from 'lucide-react';

type Note = {
  id: string;
  title: string;
  content: string;
  subject: string;
  chapter?: string;
  createdAt: string;
  updatedAt: string;
};

export function NoteTaker() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // List of chapters by subject
  const chaptersBySubject: Record<string, string[]> = {
    'Maths': [
      'Sets & Relations', 'Complex Numbers', 'Quadratic Equations', 
      'Sequences & Series', 'Permutations & Combinations', 'Binomial Theorem',
      'Trigonometry', 'Inverse Trigonometry', 'Straight Lines', 
      'Circles', 'Conic Sections', 'Limits & Continuity', 
      'Differentiation', 'Integration', 'Differential Equations',
      'Vectors', 'Probability', 'Statistics'
    ],
    'Physics': [
      'Motion in 1D', 'Motion in 2D', 'Laws of Motion', 
      'Work & Energy', 'Rotational Motion', 'Gravitation', 
      'Fluid Mechanics', 'Thermal Properties', 'Thermodynamics',
      'Electrostatics', 'Current Electricity', 'Magnetism',
      'EM Induction', 'Ray Optics', 'Wave Optics',
      'Modern Physics', 'Nuclear Physics', 'Semiconductor Physics'
    ],
    'Chemistry': [
      'Basic Concepts', 'States of Matter', 'Atomic Structure',
      'Chemical Bonding', 'Thermodynamics', 'Chemical Equilibrium',
      'Redox Reactions', 'Chemical Kinetics', 'Periodic Table',
      'Coordination Compounds', 'p-Block Elements', 'd-Block Elements',
      'Hydrocarbons', 'Haloalkanes', 'Alcohols & Phenols',
      'Aldehydes & Ketones', 'Carboxylic Acids', 'Biomolecules'
    ]
  };

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('jeeNotes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Error loading notes:', e);
        setNotes([]);
      }
    }
  }, []);

  // Save notes to localStorage when they change
  useEffect(() => {
    localStorage.setItem('jeeNotes', JSON.stringify(notes));
  }, [notes]);

  // Reset chapter when subject changes
  useEffect(() => {
    setChapter('');
  }, [subject]);

  const saveNote = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your note",
        variant: "destructive"
      });
      return;
    }

    if (!subject) {
      toast({
        title: "Subject required",
        description: "Please select a subject for your note",
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === editingId ? {
          ...note,
          title,
          content,
          subject,
          chapter: chapter || undefined,
          updatedAt: new Date().toISOString()
        } : note
      ));
      
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully"
      });
      
      // Reset form and editing state
      setEditingId(null);
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        subject,
        chapter: chapter || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setNotes([newNote, ...notes]);
      
      toast({
        title: "Note saved",
        description: "Your note has been saved successfully"
      });
    }
    
    // Reset form
    setTitle('');
    setContent('');
    setSubject('');
    setChapter('');
  };

  const editNote = (note: Note) => {
    setTitle(note.title);
    setContent(note.content);
    setSubject(note.subject);
    setChapter(note.chapter || '');
    setEditingId(note.id);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    
    // If deleting the note being edited, reset the form
    if (editingId === id) {
      setTitle('');
      setContent('');
      setSubject('');
      setChapter('');
      setEditingId(null);
    }
    
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully"
    });
  };

  const cancelEditing = () => {
    setTitle('');
    setContent('');
    setSubject('');
    setChapter('');
    setEditingId(null);
  };

  // Filter notes based on search term and subject filter
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || note.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FileText className="h-6 w-6" />
          {editingId ? 'Edit Note' : 'Create Note'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Select
                value={subject}
                onValueChange={setSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maths">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Chapter (Optional)</label>
              <Select
                value={chapter}
                onValueChange={setChapter}
                disabled={!subject || subject === 'General'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select chapter" />
                </SelectTrigger>
                <SelectContent>
                  {subject && subject !== 'General' && chaptersBySubject[subject]?.map((chap) => (
                    <SelectItem key={chap} value={chap}>{chap}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your notes here..."
              className="min-h-[200px] w-full"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            {editingId && (
              <Button variant="outline" onClick={cancelEditing}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
            
            <Button onClick={saveNote}>
              {editingId ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Update
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Your Notes</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes..."
              className="pl-10"
            />
          </div>
          
          <Select
            value={filterSubject}
            onValueChange={setFilterSubject}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Maths">Mathematics</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {filteredNotes.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {filteredNotes.map(note => (
              <Card key={note.id} className="animate-fade-in">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{note.title}</h3>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {note.subject} {note.chapter && `- ${note.chapter}`} | 
                        {' '}{new Date(note.updatedAt).toLocaleDateString()}
                      </div>
                      <p className="text-sm line-clamp-3">
                        {note.content}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => editNote(note)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => deleteNote(note.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No notes found. Create your first note!
          </div>
        )}
      </div>
    </div>
  );
}

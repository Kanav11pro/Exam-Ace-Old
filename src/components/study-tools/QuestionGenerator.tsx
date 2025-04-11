import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { 
  PlusCircle, BookOpen, Check, X, ChevronLeft, 
  CopyCheck, ClipboardList, Lightbulb, Calculator, Trash
} from "lucide-react";

interface Question {
  id: string;
  type: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

const QuestionGenerator = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionType, setQuestionType] = useState<string>("multiple-choice");
  const [questionText, setQuestionText] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const { toast } = useToast();

  const addQuestion = () => {
    if (!questionText) {
      toast({
        title: "Error",
        description: "Question text cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (questionType === "multiple-choice" && options.some(option => !option)) {
      toast({
        title: "Error",
        description: "All options must be filled for multiple-choice questions.",
        variant: "destructive",
      });
      return;
    }

    if (questionType === "multiple-choice" && !correctAnswer) {
      toast({
        title: "Error",
        description: "Correct answer must be selected for multiple-choice questions.",
        variant: "destructive",
      });
      return;
    }

    const newQuestion: Question = {
      id: Math.random().toString(36).substring(7),
      type: questionType,
      questionText: questionText,
      options: options,
      correctAnswer: correctAnswer,
    };

    setQuestions([...questions, newQuestion]);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");

    toast({
      title: "Success",
      description: "Question added successfully!",
    });
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(question => question.id !== id));
    toast({
      title: "Success",
      description: "Question removed successfully!",
    });
  };

  return (
    <div className="container py-8 max-w-4xl animate-fade-in">
      <Link to="/study-tools" className="inline-flex items-center mb-4 text-sm font-medium hover:underline">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Study Tools
      </Link>
      <h1 className="text-3xl font-bold mb-4">Question Generator</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Create custom practice questions to reinforce your understanding.
      </p>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="create">Create Question</TabsTrigger>
          <TabsTrigger value="view">View Questions</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Add New Question</CardTitle>
              <CardDescription>Create a new question to add to your practice set.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="question-type">Question Type</Label>
                <Select value={questionType} onValueChange={setQuestionType}>
                  <SelectTrigger id="question-type">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    {/* <SelectItem value="true-false">True/False</SelectItem>
                    <SelectItem value="short-answer">Short Answer</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="question-text">Question Text</Label>
                <Textarea
                  id="question-text"
                  placeholder="Enter your question here."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                />
              </div>

              {questionType === "multiple-choice" && (
                <>
                  {options.map((option, index) => (
                    <div className="grid gap-2" key={index}>
                      <Label htmlFor={`option-${index + 1}`}>Option {index + 1}</Label>
                      <Input
                        type="text"
                        id={`option-${index + 1}`}
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...options];
                          newOptions[index] = e.target.value;
                          setOptions(newOptions);
                        }}
                      />
                    </div>
                  ))}
                  <div className="grid gap-2">
                    <Label>Correct Answer</Label>
                    <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer}>
                      <div className="flex items-center space-x-2">
                        {options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`option-${index + 1}-radio`} />
                            <Label htmlFor={`option-${index + 1}-radio`}>{`Option ${index + 1}`}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={addQuestion}>Add Question</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="view">
          {questions.length === 0 ? (
            <div className="text-center py-6">
              <ClipboardList className="h-12 w-12 mx-auto mb-2 text-gray-400 dark:text-gray-600" />
              <p className="text-lg text-gray-500 dark:text-gray-400">No questions added yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {questions.map((question) => (
                <Card key={question.id}>
                  <CardHeader>
                    <CardTitle>{question.questionText}</CardTitle>
                    <CardDescription>Type: {question.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {question.type === "multiple-choice" && (
                      <ul>
                        {question.options.map((option, index) => (
                          <li key={index} className="mb-1">
                            {option} {question.correctAnswer === option && <Check className="inline-block h-4 w-4 text-green-500 ml-1" />}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="destructive" onClick={() => removeQuestion(question.id)}>
                      <Trash className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionGenerator;

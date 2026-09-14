export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface QuestionOption {
  id?: string;
  option_key?: string;
  option_text?: string;
  key?: string;
  text?: string;
  is_correct?: number | boolean;
  isCorrect?: boolean | number;
  [key: string]: any;
}

export interface DetailedExplanation {
  whyCorrect?: string;
  whyOthersIncorrect?: Record<string, string>;
  topicSummary?: string;
  keyTakeaway?: string;
  [key: string]: any;
}

export interface Question {
  id: string;
  quiz_id?: string;
  question_number?: number;
  question_text?: string;
  question?: string;
  explanation?: any;
  topic_summary?: string;
  points?: number;
  options: QuestionOption[];
  correctOption?: string;
  topic: string;
  subtopic?: string;
  [key: string]: any;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  description: string;
  question_count?: number;
  created_at?: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  quiz_title: string;
  category?: string;
  score: number;
  total_questions: number;
  correct_count: number;
  wrong_count: number;
  duration_seconds: number;
  completed_at: string;
  details?: {
    question_id: string;
    selected_option: string;
    correct_option: string;
    is_correct: number;
  }[];
}

// Legacy application types compatibility
export interface SavedQuestionItem {
  id: string;
  question: any;
  savedAt: any;
  userNotes?: string;
  tags?: string[];
  wasCorrect?: boolean;
  [key: string]: any;
}

export interface Flashcard {
  id: string;
  front?: string;
  back?: string;
  topic?: string;
  frontTitle?: string;
  [key: string]: any;
}

export interface SavedFlashcardItem {
  id?: string;
  flashcard?: any;
  card: any;
  savedAt: any;
  userNotes?: string;
  [key: string]: any;
}

export interface AppSettings {
  theme?: string;
  soundEnabled?: boolean;
  notificationsEnabled?: boolean;
  [key: string]: any;
}

export interface UserStats {
  totalSolved?: number;
  correctCount?: number;
  wrongCount?: number;
  topicBreakdown?: Record<string, any>;
  [key: string]: any;
}

export interface JournalEntry {
  id: string;
  date?: string;
  content?: string;
  mood?: string;
  tags?: string[];
  [key: string]: any;
}

export interface HourlyLogEntry {
  id: string;
  hour?: any;
  activity?: string;
  [key: string]: any;
}

export interface DailyPlanTask {
  id: string;
  title?: string;
  completed?: any;
  [key: string]: any;
}

export interface UserProfile {
  name?: string;
  email?: string;
  avatar?: string;
  [key: string]: any;
}

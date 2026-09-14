import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  HelpCircle, 
  Bookmark, 
  BookmarkCheck, 
  RefreshCw, 
  Sparkles,
  Lightbulb,
  GraduationCap,
  X,
  FileText,
  AlertTriangle,
  Check,
  Clock
} from 'lucide-react';
import type { Question } from '../types/quiz';
import { FormattedMathText } from './FormattedMathText';

interface ExplanationCardProps {
  question: Question;
  userAnswerId: string;
  isSaved: boolean;
  solveTimeSeconds?: number;
  onToggleSave: () => void;
  onNextQuestion: () => void;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  question,
  userAnswerId,
  isSaved,
  solveTimeSeconds,
  onToggleSave,
  onNextQuestion,
}) => {
  const isCorrect = userAnswerId === question.correctOptionId;
  const [showFullLessonModal, setShowFullLessonModal] = useState<boolean>(false);

  useEffect(() => {
    if (isCorrect) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [isCorrect]);

  return (
    <div className="explanation-card">
      {/* Result Status Banner */}
      <div className={`result-banner ${isCorrect ? 'banner-success' : 'banner-warning'}`}>
        <div className="banner-left">
          {isCorrect ? (
            <CheckCircle className="banner-icon icon-success" />
          ) : (
            <XCircle className="banner-icon icon-warning" />
          )}
          <div>
            <h3>{isCorrect ? 'Congratulations! Correct Answer' : 'Incorrect Answer — Learning Opportunity!'}</h3>
            <p>
              {isCorrect 
                ? `+15 XP Earned! Option ${question.correctOptionId} is the correct answer.` 
                : `Your Choice: ${userAnswerId} | Correct Choice: ${question.correctOptionId}`}
            </p>
          </div>
        </div>

        {solveTimeSeconds !== undefined && solveTimeSeconds > 0 && (
          <div className="solve-time-badge" title="Solve Time For This Question">
            <Clock className="time-icon" />
            <span>Solve Time: <strong>{solveTimeSeconds} sec</strong></span>
          </div>
        )}
      </div>

      {/* Explanation Details */}
      <div className="explanation-body">
        {/* Section 1: Why Correct */}
        <div className="explain-section section-correct">
          <div className="section-header">
            <Sparkles className="sec-icon icon-green" />
            <h4>1. Why Option ({question.correctOptionId}) is Correct?</h4>
          </div>
          <p className="sec-content">
            <FormattedMathText text={question.explanation.whyCorrect} />
          </p>
        </div>

        {/* Section 2: Why Others are Wrong */}
        {question.explanation.whyOthersIncorrect && Object.keys(question.explanation.whyOthersIncorrect).length > 0 && (
          <div className="explain-section section-others">
            <div className="section-header">
              <HelpCircle className="sec-icon icon-purple" />
              <h4>2. Why Other Options are Incorrect?</h4>
            </div>
            <div className="wrong-options-grid">
              {Object.entries(question.explanation.whyOthersIncorrect).map(([optId, text]) => (
                <div key={optId} className="wrong-opt-item">
                  <span className="wrong-opt-badge">Option {optId}</span>
                  <span className="wrong-opt-text">
                    <FormattedMathText text={String(text || '')} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Topic Summary Note */}
        <div className="explain-section section-summary">
          <div className="section-header">
            <BookOpen className="sec-icon icon-blue" />
            <h4>3. Topic Summary ({question.topic})</h4>
          </div>
          <p className="sec-content">
            <FormattedMathText text={question.explanation.topicSummary} />
          </p>
        </div>

        {/* Section 4: Key Takeaway */}
        <div className="explain-section section-takeaway">
          <div className="section-header">
            <Lightbulb className="sec-icon icon-amber" />
            <h4>4. Key Takeaway & Golden Rule</h4>
          </div>
          <p className="sec-content takeaway-text">
            <FormattedMathText text={question.explanation.keyTakeaway || ""} />
          </p>
        </div>
      </div>

      {/* Bottom Action Toolbar */}
      <div className="explanation-actions">
        <button 
          className="lesson-explain-btn"
          onClick={() => setShowFullLessonModal(true)}
        >
          <GraduationCap className="btn-icon" />
          <span>📖 Deep Topic Analysis</span>
        </button>

        <button 
          className={`save-btn ${isSaved ? 'saved' : ''}`}
          onClick={onToggleSave}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="btn-icon" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="btn-icon" />
              <span>Bookmark Question</span>
            </>
          )}
        </button>

        <button className="next-btn" onClick={onNextQuestion}>
          <RefreshCw className="btn-icon" />
          <span>Next Question</span>
        </button>
      </div>

      {/* FULL LESSON EXPLANATION MODAL */}
      {showFullLessonModal && (
        <div className="modal-overlay" onClick={() => setShowFullLessonModal(false)}>
          <div className="modal-content full-lesson-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <GraduationCap className="modal-icon text-indigo" />
                <div>
                  <h2>📖 Comprehensive Topic Guide</h2>
                  <p className="modal-subtitle">{question.topic} — Deep Dive Analysis</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowFullLessonModal(false)}>
                <X />
              </button>
            </div>

            <div className="modal-body full-lesson-body">
              {/* Section A: Core Theoretical Foundation */}
              <div className="lesson-block">
                <div className="lesson-block-title">
                  <FileText className="block-icon text-blue" />
                  <h3>1. Theoretical Foundation & Core Logic</h3>
                </div>
                <p className="lesson-text">
                  {question.explanation.topicSummary}
                </p>
                <div className="lesson-highlight-box">
                  <strong>🎯 Key Solution Key ({question.correctOptionId}):</strong>
                  <p>{question.explanation.whyCorrect}</p>
                </div>
              </div>

              {/* Section B: Exam Tips & Pitfalls */}
              <div className="lesson-block">
                <div className="lesson-block-title">
                  <AlertTriangle className="block-icon text-amber" />
                  <h3>2. Common Distractors & Exam Pitfalls</h3>
                </div>
                <div className="pitfalls-list">
                  {Object.entries(question.explanation.whyOthersIncorrect || {}).map(([optId, text]) => (
                    <div key={optId} className="pitfall-card">
                      <div className="pitfall-badge">Option {optId} Distractor Trap</div>
                      <p>{String(text || '')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section C: Golden Rule / Takeaway */}
              <div className="lesson-block">
                <div className="lesson-block-title">
                  <Check className="block-icon text-green" />
                  <h3>3. Golden Rule & Memory Note</h3>
                </div>
                <div className="golden-takeaway-card">
                  <Lightbulb className="takeaway-big-icon" />
                  <div>
                    <h4>Key Rule to Remember:</h4>
                    <p>{question.explanation.keyTakeaway || "Follow the step-by-step logic and pay close attention to distractor traps."}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="primary-modal-btn" onClick={() => setShowFullLessonModal(false)}>
                Got it, Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle2, ArrowRight, Layers, Clock } from 'lucide-react';
import type { Question } from '../types/quiz';
import { FormattedMathText } from './FormattedMathText';

interface QuestionCardProps {
  question: Question;
  onAnswerSubmit: (selectedOptionId: string, solveTimeSeconds: number) => void;
  answeredOptionId: string | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswerSubmit,
  answeredOptionId,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(answeredOptionId);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Per-question timer: resets on question change, stops when answered
  useEffect(() => {
    setSelectedId(answeredOptionId);
    setElapsedSeconds(0);

    if (answeredOptionId !== null) return;

    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [question.id, answeredOptionId]);

  const handleOptionClick = (id: string) => {
    if (answeredOptionId !== null) return; // Prevent changing after submission
    setSelectedId(id);
  };

  const handleSubmit = () => {
    if (!selectedId || answeredOptionId !== null) return;
    onAnswerSubmit(selectedId, elapsedSeconds);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'beginner': return { label: 'Beginner', class: 'diff-beginner' };
      case 'intermediate': return { label: 'Intermediate', class: 'diff-intermediate' };
      case 'advanced': return { label: 'Advanced', class: 'diff-advanced' };
      default: return { label: diff, class: '' };
    }
  };

  const diffInfo = getDifficultyBadge(question.difficulty);

  return (
    <div className="question-card">
      {/* Top Meta info */}
      <div className="question-meta">
        <span className="topic-badge">
          <Layers className="icon" />
          {question.topic}
        </span>

        {/* Live Per-Question Timer Badge */}
        <span className={`question-timer-badge ${answeredOptionId !== null ? 'stopped' : 'running'}`} title="Solve Timer">
          <Clock className="timer-icon" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </span>

        <span className={`diff-badge ${diffInfo.class}`}>
          {diffInfo.label}
        </span>
        <span className="choice-count-badge">5 Options</span>
      </div>

      {/* Question Prompt */}
      <div className="question-prompt">
        <HelpCircle className="prompt-icon" />
        <h2 className="prompt-text">
          <FormattedMathText text={question.questionText} />
        </h2>
      </div>

      {/* Visual SVG Diagram (if available) */}
      {question.svgDiagram && (
        <div className="visual-diagram-box">
          <div 
            className="svg-diagram-container"
            dangerouslySetInnerHTML={{ __html: question.svgDiagram }}
          />
        </div>
      )}

      {/* 5 Choices Grid */}
      <div className="options-list">
        {question.options.map((option, index) => {
          const isSelected = selectedId === option.id;
          const isSubmitted = answeredOptionId !== null;
          const isCorrect = option.id === question.correctOptionId;
          const isUserChoice = answeredOptionId === option.id;

          let optionStateClass = '';
          if (isSubmitted) {
            if (isCorrect) {
              optionStateClass = 'option-correct';
            } else if (isUserChoice && !isCorrect) {
              optionStateClass = 'option-wrong';
            } else {
              optionStateClass = 'option-dimmed';
            }
          } else if (isSelected) {
            optionStateClass = 'option-selected';
          }

          return (
            <div
              key={option.id || index}
              className={`option-card ${optionStateClass}`}
              onClick={() => handleOptionClick(option.id || option.key || '')}
            >
              <div className="option-badge">{option.id || option.key || String.fromCharCode(65 + index)}</div>
              <div className="option-text">
                <FormattedMathText text={option.text || option.option_text || ''} />
              </div>
              <div className="option-status-icon">
                {isSubmitted && isCorrect && <CheckCircle2 className="correct-icon" />}
                {isSubmitted && isUserChoice && !isCorrect && <span className="wrong-x">✕</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {answeredOptionId === null && (
        <div className="submit-box">
          <button
            className="submit-btn"
            disabled={!selectedId}
            onClick={handleSubmit}
          >
            <span>Submit Answer & Read Explanation</span>
            <ArrowRight className="btn-icon" />
          </button>
        </div>
      )}
    </div>
  );
};

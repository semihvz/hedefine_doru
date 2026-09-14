import React from 'react';
import { X, Award, Flame, CheckCircle, Target, BookOpen, BarChart2, Clock } from 'lucide-react';
import type { UserStats } from '../types/quiz';

interface StatsDashboardProps {
  stats: UserStats;
  onClose: () => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats, onClose }) => {
  const accuracyPercentage = stats.totalAnswered > 0
    ? Math.round((stats.correctAnswers / stats.totalAnswered) * 100)
    : 0;

  const avgSolveTime = stats.averageTimePerQuestion || 0;

  // Level calculation: Every 100 XP is 1 level
  const userLevel = Math.floor(stats.xp / 100) + 1;
  const currentLevelXp = stats.xp % 100;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <BarChart2 className="icon icon-green" />
            <h3>Learning Analytics & Performance Dashboard</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>

        {/* Level & XP Banner */}
        <div className="level-banner">
          <div className="level-badge">
            <Award className="level-icon" />
            <div>
              <span className="level-title">Level {userLevel} Student</span>
              <span className="level-subtitle">Total {stats.xp} XP Earned</span>
            </div>
          </div>
          <div className="xp-bar-container">
            <div className="xp-bar-fill" style={{ width: `${currentLevelXp}%` }}></div>
            <span className="xp-bar-text">{currentLevelXp} / 100 XP (Next Level)</span>
          </div>
        </div>

        {/* Core Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <Flame className="stat-icon icon-flame" />
            <div className="stat-info">
              <span className="stat-number">{stats.streakDays} Days</span>
              <span className="stat-label">Study Streak</span>
            </div>
          </div>

          <div className="stat-card">
            <CheckCircle className="stat-icon icon-green" />
            <div className="stat-info">
              <span className="stat-number">{stats.correctAnswers} / {stats.totalAnswered}</span>
              <span className="stat-label">Correct Answers</span>
            </div>
          </div>

          <div className="stat-card">
            <Target className="stat-icon icon-purple" />
            <div className="stat-info">
              <span className="stat-number">%{accuracyPercentage}</span>
              <span className="stat-label">Accuracy Rate</span>
            </div>
          </div>

          <div className="stat-card">
            <Clock className="stat-icon icon-cyan" />
            <div className="stat-info">
              <span className="stat-number">{avgSolveTime} sec / Question</span>
              <span className="stat-label">Avg. Solve Duration</span>
            </div>
          </div>
        </div>

        {/* Topic Mastery Section */}
        <div className="topic-mastery-section">
          <div className="section-title">
            <BookOpen className="sec-icon" />
            <h4>Topic Mastery Breakdown</h4>
          </div>

          {Object.keys(stats.topicMastery).length === 0 ? (
            <div className="empty-mastery">
              <p>No question history recorded yet. Your topic mastery analysis will appear here as you solve practice questions.</p>
            </div>
          ) : (
            <div className="mastery-list">
              {Object.entries(stats.topicMastery).map(([topic, dataVal]) => {
                const data = dataVal as { correct: number; total: number };
                const perc = Math.round((data.correct / data.total) * 100);
                return (
                  <div key={topic} className="mastery-item">
                    <div className="mastery-info">
                      <span className="mastery-topic-name">{topic}</span>
                      <span className="mastery-stats-text">
                        {data.correct}/{data.total} Correct ({perc}%)
                      </span>
                    </div>
                    <div className="mastery-progress-bg">
                      <div
                        className={`mastery-progress-fill ${perc >= 70 ? 'fill-high' : perc >= 40 ? 'fill-mid' : 'fill-low'}`}
                        style={{ width: `${perc}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

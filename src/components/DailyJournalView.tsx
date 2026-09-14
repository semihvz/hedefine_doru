import React, { useState, useEffect } from 'react';
import { 
  BookOpenCheck, 
  Image as ImageIcon, 
  Video, 
  Trash2, 
  Calendar, 
  Tag, 
  Plus, 
  X, 
  Search, 
  Sparkles, 
  ZoomIn, 
  Check, 
  Link, 
  Mic, 
  Square, 
  Clock,
  Volume2,
  Camera
} from 'lucide-react';
import type { JournalEntry, HourlyLogEntry } from '../types/quiz';
import { 
  loadJournalEntries, 
  addJournalEntry, 
  deleteJournalEntry,
  loadHourlyLogs,
  addHourlyLog,
  deleteHourlyLog
} from '../services/storageService';
import { CameraCaptureModal } from './CameraCaptureModal';

const getEmbedVideoUrl = (url: string) => {
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return null;
};

export const DailyJournalView: React.FC = () => {
  // Main Journal Mode: 'daily' | 'hourly'
  const [journalTab, setJournalTab] = useState<'daily' | 'hourly'>('daily');

  // Daily Journal State
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [photoCaption, setPhotoCaption] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [videoCaption, setVideoCaption] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoMode, setVideoMode] = useState<'upload' | 'url'>('upload');
  const [mood, setMood] = useState<'verimli' | 'motive' | 'yorgun' | 'odakli' | 'normal'>('verimli');
  const [tagsInput, setTagsInput] = useState('');

  // Hourly Log State
  const [hourlyLogs, setHourlyLogs] = useState<HourlyLogEntry[]>([]);
  const [hourlyDate, setHourlyDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [hourlyHour, setHourlyHour] = useState(() => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const nextH = ((now.getHours() + 1) % 24).toString().padStart(2, '0');
    return `${h}:00 - ${nextH}:00`;
  });
  const [hourlyText, setHourlyText] = useState('');
  const [hourlyAudioUrl, setHourlyAudioUrl] = useState<string | undefined>(undefined);
  const [hourlyImageUrl, setHourlyImageUrl] = useState<string | undefined>(undefined);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // UI States
  const [showForm, setShowForm] = useState(false);
  const [activeZoomImage, setActiveZoomImage] = useState<string | null>(null);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  // Camera Modal State
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'daily' | 'hourly'>('daily');

  const handleOpenCamera = (target: 'daily' | 'hourly') => {
    setCameraTarget(target);
    setShowCameraModal(true);
  };

  const handleCameraCapture = (imageDataUrl: string) => {
    if (cameraTarget === 'daily') {
      setPhotoUrl(imageDataUrl);
    } else {
      setHourlyImageUrl(imageDataUrl);
    }
  };

  useEffect(() => {
    setEntries(loadJournalEntries());
    setHourlyLogs(loadHourlyLogs());
  }, []);

  // Recording Timer Effect
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Audio Recording Handlers
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setHourlyAudioUrl(reader.result as string);
        };
        reader.readAsDataURL(blob);

        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      alert('Microphone access denied or unavailable. You can also upload an audio file directly.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert('Audio file size is too large (Maximum size is 15 MB).');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setHourlyAudioUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleHourlyImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Photo file size is too large (Maximum size is 8 MB).');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setHourlyImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Photo file size is too large (Maximum size is 8 MB).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert('Video file size is too large (Maximum size is 25 MB).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddVideoUrl = () => {
    if (!videoUrlInput.trim()) return;
    setVideoUrl(videoUrlInput.trim());
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(undefined);
    setPhotoCaption('');
  };

  const handleRemoveVideo = () => {
    setVideoUrl(undefined);
    setVideoCaption('');
    setVideoUrlInput('');
  };

  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill in the journal entry title and study notes.');
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const updated = addJournalEntry({
      title: title.trim(),
      date,
      content: content.trim(),
      photoUrl,
      photoCaption: photoCaption.trim() || undefined,
      videoUrl,
      videoCaption: videoCaption.trim() || undefined,
      mood,
      tags: parsedTags.length > 0 ? parsedTags : undefined
    });

    setEntries(updated);

    // Reset form
    setTitle('');
    setContent('');
    setPhotoUrl(undefined);
    setPhotoCaption('');
    setVideoUrl(undefined);
    setVideoCaption('');
    setVideoUrlInput('');
    setTagsInput('');
    setMood('verimli');
    setShowForm(false);

    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  const handleSubmitHourlyLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hourlyText.trim() && !hourlyAudioUrl && !hourlyImageUrl) {
      alert('Please enter a note, record voice audio, or attach an image.');
      return;
    }

    const updated = addHourlyLog({
      date: hourlyDate,
      hour: hourlyHour.trim() || 'Hourly Record',
      text: hourlyText.trim(),
      audioUrl: hourlyAudioUrl,
      imageUrl: hourlyImageUrl
    });

    setHourlyLogs(updated);

    // Reset hourly form
    setHourlyText('');
    setHourlyAudioUrl(undefined);
    setHourlyImageUrl(undefined);
    setShowForm(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      const updated = deleteJournalEntry(id);
      setEntries(updated);
    }
  };

  const handleDeleteHourlyLog = (id: string) => {
    if (window.confirm('Are you sure you want to delete this hourly record?')) {
      const updated = deleteHourlyLog(id);
      setHourlyLogs(updated);
    }
  };

  const formatRecTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const filteredEntries = entries.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.content || '').toLowerCase().includes(q) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );
  });

  const filteredHourlyLogs = hourlyLogs.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.text.toLowerCase().includes(q) ||
      item.hour.toLowerCase().includes(q) ||
      item.date.toLowerCase().includes(q)
    );
  });

  const getMoodBadge = (m?: string) => {
    switch (m) {
      case 'verimli':
        return <span className="journal-mood-badge mood-green">🎯 Productive Day</span>;
      case 'motive':
        return <span className="journal-mood-badge mood-purple">🔥 High Motivation</span>;
      case 'odakli':
        return <span className="journal-mood-badge mood-blue">💡 Focused Session</span>;
      case 'yorgun':
        return <span className="journal-mood-badge mood-amber">😴 Tired Pace</span>;
      default:
        return <span className="journal-mood-badge mood-gray">⚡ Normal Day</span>;
    }
  };

  return (
    <div className="daily-journal-container">
      {/* Toast Notification */}
      {saveSuccessToast && (
        <div className="save-toast-banner">
          <Check className="toast-icon" />
          <span>{journalTab === 'daily' ? 'Journal entry saved successfully!' : 'Hourly study record saved!'}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="journal-header-card">
        <div className="journal-title-box">
          <div className="journal-icon-bg">
            <BookOpenCheck className="journal-header-icon" />
          </div>
          <div>
            <h2>📓 Study Journal & Hourly Records</h2>
            <p className="journal-header-sub">
              Track daily study notes, hourly voice recordings, photos, and video logs.
            </p>
          </div>
        </div>

        <button 
          className="journal-new-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X className="btn-icon" /> : <Plus className="btn-icon" />}
          <span>{showForm ? 'Close Form' : journalTab === 'daily' ? 'Add Daily Note' : 'Add Hourly Log'}</span>
        </button>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="journal-subtab-bar">
        <button
          className={`journal-subtab-btn ${journalTab === 'daily' ? 'active' : ''}`}
          onClick={() => { setJournalTab('daily'); setShowForm(false); }}
        >
          <BookOpenCheck className="subtab-icon" />
          <span>📖 Daily Entries</span>
        </button>
        <button
          className={`journal-subtab-btn ${journalTab === 'hourly' ? 'active' : ''}`}
          onClick={() => { setJournalTab('hourly'); setShowForm(false); }}
        >
          <Clock className="subtab-icon" />
          <span>⏱️ Hourly Records (Saatlik Kayıt)</span>
        </button>
      </div>

      {/* ===================================================================
         SECTION 1: DAILY JOURNAL FORM & LIST
         =================================================================== */}
      {journalTab === 'daily' && (
        <>
          {showForm && (
            <form onSubmit={handleSubmitEntry} className="journal-entry-form-card">
              <div className="form-card-header">
                <Sparkles className="sparkle-icon" />
                <h3>Add Daily Study Note, Photo & Video</h3>
              </div>

              <div className="form-grid">
                {/* Title & Date */}
                <div className="form-row">
                  <div className="form-group flex-2">
                    <label className="form-label">Entry Title *</label>
                    <input
                      type="text"
                      className="journal-input"
                      placeholder="e.g., Sep 9 AYT Math 250 Questions Solved & Practice Net Score"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label">Date</label>
                    <div className="input-with-icon">
                      <Calendar className="field-icon" />
                      <input
                        type="date"
                        className="journal-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Mood Selector */}
                <div className="form-group">
                  <label className="form-label">Daily Study Mood / Efficiency</label>
                  <div className="mood-selection-grid">
                    {[
                      { key: 'verimli', label: '🎯 Productive', color: 'green' },
                      { key: 'motive', label: '🔥 High Motivation', color: 'purple' },
                      { key: 'odakli', label: '💡 Focused', color: 'blue' },
                      { key: 'yorgun', label: '😴 Tired', color: 'amber' },
                      { key: 'normal', label: '⚡ Normal', color: 'gray' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        className={`mood-select-btn ${mood === item.key ? `active-${item.color}` : ''}`}
                        onClick={() => setMood(item.key as any)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="form-group">
                  <label className="form-label">Study Notes, Practice Questions & Goals *</label>
                  <textarea
                    className="journal-textarea"
                    rows={5}
                    placeholder="What subjects did you practice today? How many questions were solved? Key takeaways learned?..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>

                {/* Photo Upload Section */}
                <div className="form-group photo-upload-group">
                  <label className="form-label">📷 Attach Photo (Fotoğraf Çek veya Yükle)</label>
                  
                  {!photoUrl ? (
                    <div className="photo-dropzone-box">
                      <div className="camera-trigger-bar">
                        <button
                          type="button"
                          className="take-photo-btn"
                          onClick={() => handleOpenCamera('daily')}
                        >
                          <Camera className="btn-icon" />
                          <span>📸 Canlı Kamera İle Fotoğraf Çek</span>
                        </button>
                      </div>

                      <div className="photo-dropzone margin-top-sm">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          id="journal-photo-input"
                          className="hidden-file-input"
                          onChange={handleImageUpload}
                        />
                        <label htmlFor="journal-photo-input" className="photo-upload-label">
                          <ImageIcon className="upload-icon" />
                          <span className="upload-title">Galeriden veya Cihazdan Fotoğraf Seç</span>
                          <span className="upload-hint">PNG, JPG veya WEBP (Maksimum 8 MB)</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="photo-preview-container">
                      <div className="photo-preview-wrapper">
                        <img src={photoUrl} alt="Journal Attachment" className="preview-img" />
                        <button
                          type="button"
                          className="remove-photo-btn"
                          onClick={handleRemovePhoto}
                          title="Remove Photo"
                        >
                          <X />
                        </button>
                      </div>
                      <input
                        type="text"
                        className="journal-input caption-input"
                        placeholder="Photo caption (e.g. Tough permutation question solution)..."
                        value={photoCaption}
                        onChange={(e) => setPhotoCaption(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Video Attachment Section */}
                <div className="form-group photo-upload-group">
                  <label className="form-label">🎥 Attach Video (File Upload or YouTube / MP4 Link)</label>

                  {!videoUrl ? (
                    <div className="video-attachment-card">
                      <div className="video-mode-switcher">
                        <button
                          type="button"
                          className={`video-mode-btn ${videoMode === 'upload' ? 'active' : ''}`}
                          onClick={() => setVideoMode('upload')}
                        >
                          <Video className="btn-icon-sm" />
                          <span>Upload Video File</span>
                        </button>
                        <button
                          type="button"
                          className={`video-mode-btn ${videoMode === 'url' ? 'active' : ''}`}
                          onClick={() => setVideoMode('url')}
                        >
                          <Link className="btn-icon-sm" />
                          <span>Paste Video Link</span>
                        </button>
                      </div>

                      {videoMode === 'upload' ? (
                        <div className="photo-dropzone">
                          <input
                            type="file"
                            accept="video/*"
                            id="journal-video-input"
                            className="hidden-file-input"
                            onChange={handleVideoFileUpload}
                          />
                          <label htmlFor="journal-video-input" className="photo-upload-label">
                            <Video className="upload-icon text-indigo" />
                            <span className="upload-title">Select Video File</span>
                            <span className="upload-hint">MP4, WebM or MOV (Max 25 MB)</span>
                          </label>
                        </div>
                      ) : (
                        <div className="video-url-input-group">
                          <div className="input-with-icon">
                            <Link className="field-icon" />
                            <input
                              type="url"
                              className="journal-input"
                              placeholder="Paste YouTube or video link (e.g. https://www.youtube.com/watch?v=...)"
                              value={videoUrlInput}
                              onChange={(e) => setVideoUrlInput(e.target.value)}
                            />
                          </div>
                          <button
                            type="button"
                            className="attach-url-btn"
                            onClick={handleAddVideoUrl}
                          >
                            Attach Video
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="video-preview-container">
                      <div className="video-preview-wrapper">
                        {getEmbedVideoUrl(videoUrl) ? (
                          <iframe
                            src={getEmbedVideoUrl(videoUrl)!}
                            title="Video Preview"
                            className="preview-iframe"
                            allowFullScreen
                          />
                        ) : (
                          <video controls src={videoUrl} className="preview-video" />
                        )}
                        <button
                          type="button"
                          className="remove-photo-btn"
                          onClick={handleRemoveVideo}
                          title="Remove Video"
                        >
                          <X />
                        </button>
                      </div>
                      <input
                        type="text"
                        className="journal-input caption-input"
                        placeholder="Video caption (e.g. Solution walkthrough video)..."
                        value={videoCaption}
                        onChange={(e) => setVideoCaption(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Tags Input */}
                <div className="form-group">
                  <label className="form-label">Tags (Separate with commas)</label>
                  <div className="input-with-icon">
                    <Tag className="field-icon" />
                    <input
                      type="text"
                      className="journal-input"
                      placeholder="e.g. AYTMath, Practice, MedSchoolTarget, 250Questions"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                  <button type="submit" className="save-entry-btn">
                    <BookOpenCheck className="btn-icon" />
                    <span>Save Journal Entry</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Daily Journal Entries List */}
          <div className="journal-list-section">
            <div className="journal-list-bar">
              <h3>📖 My Daily Entries ({entries.length})</h3>
              
              <div className="journal-search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredEntries.length === 0 ? (
              <div className="journal-empty-box">
                <BookOpenCheck className="empty-icon" />
                <h4>No Daily Journal Entries Found</h4>
                <p>
                  {searchQuery
                    ? 'No journal entries match your search query.'
                    : 'Click "Add Daily Note" above to record your first study journal with photos and videos!'}
                </p>
              </div>
            ) : (
              <div className="journal-grid">
                {filteredEntries.map((item) => (
                  <div key={item.id} className="journal-card">
                    <div className="journal-card-header">
                      <div className="journal-card-meta">
                        <span className="journal-date">
                          <Calendar className="date-icon" />
                          {item.date}
                        </span>
                        {getMoodBadge(item.mood)}
                      </div>
                      <button
                        className="delete-entry-btn"
                        onClick={() => handleDelete(item.id)}
                        title="Delete Entry"
                      >
                        <Trash2 />
                      </button>
                    </div>

                    <h4 className="journal-card-title">{item.title}</h4>

                    <p className="journal-card-body">{item.content}</p>

                    {/* Attached Photo */}
                    {item.photoUrl && (
                      <div className="journal-photo-box">
                        <div 
                          className="photo-img-wrapper"
                          onClick={() => setActiveZoomImage(item.photoUrl!)}
                        >
                          <img src={item.photoUrl} alt={item.title} className="journal-card-img" />
                          <div className="zoom-overlay">
                            <ZoomIn className="zoom-icon" />
                            <span>Zoom</span>
                          </div>
                        </div>
                        {item.photoCaption && (
                          <p className="journal-photo-caption">📷 {item.photoCaption}</p>
                        )}
                      </div>
                    )}

                    {/* Attached Video */}
                    {item.videoUrl && (
                      <div className="journal-video-box">
                        {getEmbedVideoUrl(item.videoUrl) ? (
                          <iframe
                            src={getEmbedVideoUrl(item.videoUrl)!}
                            title={item.title}
                            className="journal-card-iframe"
                            allowFullScreen
                          />
                        ) : (
                          <video controls src={item.videoUrl} className="journal-card-video" />
                        )}
                        {item.videoCaption && (
                          <p className="journal-video-caption">🎥 {item.videoCaption}</p>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="journal-tags-list">
                        {item.tags.map((tag, i) => (
                          <span key={i} className="journal-tag-pill">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ===================================================================
         SECTION 2: HOURLY STUDY LOGS (SAATLİK KAYITLAR - SES, YAZI, GÖRÜNTÜ)
         =================================================================== */}
      {journalTab === 'hourly' && (
        <>
          {showForm && (
            <form onSubmit={handleSubmitHourlyLog} className="journal-entry-form-card hourly-form-card">
              <div className="form-card-header">
                <Clock className="sparkle-icon text-indigo" />
                <h3>Add Hourly Record (Saatlik Kayıt: Ses, Yazı & Görsel)</h3>
              </div>

              <div className="form-grid">
                {/* Date & Hour Slot */}
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">Date</label>
                    <div className="input-with-icon">
                      <Calendar className="field-icon" />
                      <input
                        type="date"
                        className="journal-input"
                        value={hourlyDate}
                        onChange={(e) => setHourlyDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label">Hour Interval *</label>
                    <div className="input-with-icon">
                      <Clock className="field-icon" />
                      <input
                        type="text"
                        className="journal-input"
                        placeholder="e.g. 14:00 - 15:00"
                        value={hourlyHour}
                        onChange={(e) => setHourlyHour(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Hourly Notes Text */}
                <div className="form-group">
                  <label className="form-label">✍️ Hourly Notes & Solved Questions</label>
                  <textarea
                    className="journal-textarea"
                    rows={3}
                    placeholder="What did you study during this hour? Solved 30 AYT math questions, reviewed physics notes..."
                    value={hourlyText}
                    onChange={(e) => setHourlyText(e.target.value)}
                  />
                </div>

                {/* Voice Audio Recording Section */}
                <div className="form-group audio-recorder-group">
                  <label className="form-label">🎙️ Voice Note / Audio Recording (Ses Kaydı)</label>
                  
                  <div className="audio-recording-card">
                    {!isRecording ? (
                      <div className="audio-actions-row">
                        <button
                          type="button"
                          className="start-mic-btn"
                          onClick={startAudioRecording}
                        >
                          <Mic className="btn-icon" />
                          <span>Start Voice Recording</span>
                        </button>

                        <div className="audio-file-upload-box">
                          <input
                            type="file"
                            accept="audio/*"
                            id="hourly-audio-file"
                            className="hidden-file-input"
                            onChange={handleAudioFileUpload}
                          />
                          <label htmlFor="hourly-audio-file" className="audio-upload-label">
                            <Volume2 className="upload-icon-sm" />
                            <span>Upload Audio File</span>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="active-recording-box">
                        <div className="recording-status">
                          <span className="pulse-dot"></span>
                          <span className="rec-text">Recording Live Audio...</span>
                          <span className="rec-timer">{formatRecTime(recordingTime)}</span>
                        </div>

                        <button
                          type="button"
                          className="stop-mic-btn"
                          onClick={stopAudioRecording}
                        >
                          <Square className="btn-icon-sm fill-current" />
                          <span>Stop Recording</span>
                        </button>
                      </div>
                    )}

                    {/* Audio Preview Player */}
                    {hourlyAudioUrl && (
                      <div className="audio-player-preview">
                        <div className="audio-player-meta">
                          <Volume2 className="text-indigo" />
                          <span>Audio Note Preview</span>
                          <button
                            type="button"
                            className="remove-photo-btn"
                            onClick={() => setHourlyAudioUrl(undefined)}
                            title="Remove Voice Note"
                          >
                            <X />
                          </button>
                        </div>
                        <audio controls src={hourlyAudioUrl} className="hourly-audio-element" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Photo / Image Attachment Section */}
                <div className="form-group photo-upload-group">
                  <label className="form-label">📷 Attach Hourly Photo (Saatlik Görsel veya Fotoğraf Çek)</label>
                  
                  {!hourlyImageUrl ? (
                    <div className="photo-dropzone-box">
                      <div className="camera-trigger-bar">
                        <button
                          type="button"
                          className="take-photo-btn"
                          onClick={() => handleOpenCamera('hourly')}
                        >
                          <Camera className="btn-icon" />
                          <span>📸 Canlı Kamera İle Fotoğraf Çek</span>
                        </button>
                      </div>

                      <div className="photo-dropzone margin-top-sm">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          id="hourly-photo-input"
                          className="hidden-file-input"
                          onChange={handleHourlyImageUpload}
                        />
                        <label htmlFor="hourly-photo-input" className="photo-upload-label">
                          <ImageIcon className="upload-icon text-indigo" />
                          <span className="upload-title">Galeriden Saatlik Görsel Seç</span>
                          <span className="upload-hint">PNG, JPG veya WEBP (Maksimum 8 MB)</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="photo-preview-container">
                      <div className="photo-preview-wrapper">
                        <img src={hourlyImageUrl} alt="Hourly Attachment" className="preview-img" />
                        <button
                          type="button"
                          className="remove-photo-btn"
                          onClick={() => setHourlyImageUrl(undefined)}
                          title="Remove Photo"
                        >
                          <X />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                  <button type="submit" className="save-entry-btn">
                    <Clock className="btn-icon" />
                    <span>Save Hourly Record</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Hourly Records Timeline List */}
          <div className="journal-list-section">
            <div className="journal-list-bar">
              <h3>⏱️ Hourly Study Records ({hourlyLogs.length})</h3>

              <div className="journal-search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search hourly logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredHourlyLogs.length === 0 ? (
              <div className="journal-empty-box">
                <Clock className="empty-icon" />
                <h4>No Hourly Study Records Found</h4>
                <p>
                  {searchQuery
                    ? 'No hourly records match your search.'
                    : 'Click "Add Hourly Log" above to record your hourly voice notes, study text, and photos!'}
                </p>
              </div>
            ) : (
              <div className="hourly-timeline-grid">
                {filteredHourlyLogs.map((log) => (
                  <div key={log.id} className="hourly-log-card">
                    <div className="hourly-card-header">
                      <div className="hourly-badge-group">
                        <span className="hourly-slot-badge">
                          <Clock className="slot-icon" />
                          {log.hour}
                        </span>
                        <span className="hourly-date-badge">
                          <Calendar className="date-icon" />
                          {log.date}
                        </span>
                      </div>
                      <button
                        className="delete-entry-btn"
                        onClick={() => handleDeleteHourlyLog(log.id)}
                        title="Delete Hourly Record"
                      >
                        <Trash2 />
                      </button>
                    </div>

                    {/* Hourly Notes Text */}
                    {log.text && (
                      <p className="hourly-card-text">{log.text}</p>
                    )}

                    {/* Voice Audio Note Player */}
                    {log.audioUrl && (
                      <div className="hourly-audio-player-box">
                        <div className="audio-player-label">
                          <Volume2 className="audio-icon text-indigo" />
                          <span>Voice Recording</span>
                        </div>
                        <audio controls src={log.audioUrl} className="hourly-audio-element" />
                      </div>
                    )}

                    {/* Hourly Image Preview */}
                    {log.imageUrl && (
                      <div className="journal-photo-box">
                        <div 
                          className="photo-img-wrapper"
                          onClick={() => setActiveZoomImage(log.imageUrl!)}
                        >
                          <img src={log.imageUrl} alt="Hourly Work" className="journal-card-img" />
                          <div className="zoom-overlay">
                            <ZoomIn className="zoom-icon" />
                            <span>Zoom</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Fullscreen Image Zoom Modal */}
      {activeZoomImage && (
        <div className="image-zoom-modal-backdrop" onClick={() => setActiveZoomImage(null)}>
          <div className="image-zoom-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-zoom-btn" onClick={() => setActiveZoomImage(null)}>
              <X />
            </button>
            <img src={activeZoomImage} alt="Full Zoom Preview" className="full-zoomed-img" />
          </div>
        </div>
      )}

      {/* Live Web Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};

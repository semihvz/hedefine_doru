import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { AskAiModal } from './AskAiModal';

export const AskAiSelectionTooltip: React.FC = () => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionCheck = () => {
      // Small timeout to allow browser selection coordinates to calculate
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          setTooltipPos(null);
          return;
        }

        const text = selection.toString().trim();
        // Ignore very short selections or numbers
        if (text.length <= 2) {
          setTooltipPos(null);
          return;
        }

        // Ignore selections inside inputs, textareas, or active modal dialogs
        const anchorNode = selection.anchorNode;
        if (anchorNode && anchorNode.parentElement) {
          const parent = anchorNode.parentElement;
          if (
            parent.closest('input') ||
            parent.closest('textarea') ||
            parent.closest('[contenteditable="true"]') ||
            parent.closest('.ask-ai-modal-container')
          ) {
            setTooltipPos(null);
            return;
          }
        }

        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) {
            setTooltipPos(null);
            return;
          }

          // Calculate top/left position above selection center
          const top = Math.max(10, rect.top + window.scrollY - 44);
          const left = Math.max(10, Math.min(window.innerWidth - 130, rect.left + window.scrollX + rect.width / 2 - 55));

          setSelectedText(text);
          setTooltipPos({ top, left });
        } catch (e) {
          setTooltipPos(null);
        }
      }, 50);
    };

    const handleDocumentMouseDown = (e: MouseEvent) => {
      // If clicking outside the tooltip itself, close tooltip
      if (tooltipRef.current && tooltipRef.current.contains(e.target as Node)) {
        return;
      }
      // If modal is open, preserve
      if (isModalOpen) return;
    };

    document.addEventListener('mouseup', handleSelectionCheck);
    document.addEventListener('keyup', handleSelectionCheck);
    document.addEventListener('mousedown', handleDocumentMouseDown);

    return () => {
      document.removeEventListener('mouseup', handleSelectionCheck);
      document.removeEventListener('keyup', handleSelectionCheck);
      document.removeEventListener('mousedown', handleDocumentMouseDown);
    };
  }, [isModalOpen]);

  const handleOpenAiModal = () => {
    if (!selectedText) return;
    setIsModalOpen(true);
    setTooltipPos(null);
  };

  return (
    <>
      {/* Floating Selection Tooltip Badge */}
      {tooltipPos && !isModalOpen && (
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            top: `${tooltipPos.top}px`,
            left: `${tooltipPos.left}px`,
            zIndex: 9999,
          }}
          className="animate-bounce-short"
        >
          <button
            onClick={handleOpenAiModal}
            onMouseDown={(e) => e.preventDefault()} // Prevent losing selection on click
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-zinc-100 hover:bg-white text-black font-bold text-xs uppercase tracking-wider shadow-2xl border border-zinc-300 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>AI'ya Sor</span>
          </button>
        </div>
      )}

      {/* AI Explanation Modal */}
      <AskAiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedText={selectedText}
      />
    </>
  );
};

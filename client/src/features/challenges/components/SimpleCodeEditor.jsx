import React, { useRef, useEffect } from 'react';

/**
 * Lightweight, robust fallback code editor for mobile devices or environments
 * where external Monaco Editor CDN is blocked or unavailable.
 * Features:
 * - Line numbers gutter synced to scroll
 * - Tab & Shift+Tab indentation (2 spaces or 4 for Python)
 * - Auto-indent on Enter (retains indent & increases for blocks)
 * - Mobile soft-keyboard friendly
 * - Fast native performance
 */
export default function SimpleCodeEditor({
  value = '',
  onChange,
  fontSize = 14,
  language = 'javascript',
  theme = 'dark',
  textareaRef: externalRef,
  placeholder,
}) {
  const localRef = useRef(null);
  const textareaRef = externalRef || localRef;
  const gutterRef = useRef(null);

  const lines = (value || '').split('\n');
  const lineCount = Math.max(1, lines.length);

  // Sync line numbers scroll with textarea
  const handleScroll = (e) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const handleKeyDown = (e) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value: currentVal } = textarea;
    const tabSize = language === 'python' ? 4 : 2;
    const tabSpaces = ' '.repeat(tabSize);

    // ── Tab & Shift+Tab (Indentation) ──────────────────────────────────
    if (e.key === 'Tab') {
      e.preventDefault();

      if (e.shiftKey) {
        // Dedent current line
        const before = currentVal.substring(0, selectionStart);
        const lineStart = before.lastIndexOf('\n') + 1;
        const linePrefix = currentVal.substring(lineStart, lineStart + tabSize);

        if (linePrefix === tabSpaces) {
          const updated = currentVal.substring(0, lineStart) + currentVal.substring(lineStart + tabSize);
          onChange(updated);
          const newPos = Math.max(lineStart, selectionStart - tabSize);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = newPos;
          }, 0);
        }
      } else {
        // Indent at cursor or selection
        const updated = currentVal.substring(0, selectionStart) + tabSpaces + currentVal.substring(selectionEnd);
        onChange(updated);
        const newPos = selectionStart + tabSize;
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = newPos;
        }, 0);
      }
      return;
    }

    // ── Enter (Smart Auto-Indent) ──────────────────────────────────────
    if (e.key === 'Enter') {
      const before = currentVal.substring(0, selectionStart);
      const lastLine = before.split('\n').pop() || '';
      const matchIndent = lastLine.match(/^(\s*)/);
      let indent = matchIndent ? matchIndent[1] : '';

      const trimmed = lastLine.trim();
      // Increase indent if line ends in opening braces or python colon
      if (
        trimmed.endsWith('{') ||
        trimmed.endsWith(':') ||
        trimmed.endsWith('(') ||
        trimmed.endsWith('[')
      ) {
        indent += tabSpaces;
      }

      if (indent.length > 0) {
        e.preventDefault();
        const updated =
          currentVal.substring(0, selectionStart) +
          '\n' +
          indent +
          currentVal.substring(selectionEnd);
        onChange(updated);
        const newPos = selectionStart + 1 + indent.length;
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = newPos;
        }, 0);
      }
    }
  };

  return (
    <div
      className={`simple-editor-container theme-${theme}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      <div ref={gutterRef} className="simple-editor-gutter" aria-hidden="true">
        {Array.from({ length: lineCount }).map((_, i) => (
          <div key={i} className="simple-editor-line-number">
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        className="simple-editor-textarea"
        spellCheck="false"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        placeholder={placeholder || `// Write your ${language} solution here...`}
      />
    </div>
  );
}

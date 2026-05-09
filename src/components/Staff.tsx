import type { JSX } from 'react';

import type { Note } from '@/lib/pitch.types';

import { hasSharp, ledgerLinesFor, noteToStaffPosition } from './staffGeometry';

export type StaffProps = {
  note: Note;
  /** Treble or bass clef. Defaults to treble. Bass support is glyph-only — geometry stays treble. */
  clef?: 'treble' | 'bass';
  /** Optional caption rendered below the staff (e.g. word from NOTE_CARD). */
  label?: string;
  /** SVG height in px. Width scales proportionally via viewBox. */
  height?: number;
  className?: string;
};

// viewBox geometry, in unitless SVG coordinates.
const VIEWBOX_W = 80;
const VIEWBOX_H = 100;
const STAFF_LEFT = 4;
const STAFF_RIGHT = 76;

// One position step = one diatonic step = HALF the inter-line distance.
const POSITION_STEP_Y = 2;

// Position 4 (B4 — middle staff line) anchors the vertical center.
const STAFF_CENTER_Y = 50;
const STAFF_CENTER_POSITION = 4;

const NOTE_X = 50;
const SHARP_X = 41;
const CLEF_X = 6;
const NOTEHEAD_RX = 2.6;
const NOTEHEAD_RY = 1.9;
const STEM_LENGTH = 14;
const STEM_OFFSET = NOTEHEAD_RX;
const LEDGER_HALF_WIDTH = 4.5;

// NOTE: clef and sharp use Unicode glyphs (U+1D11E, U+1D122, U+266F). On every
// platform we target (recent macOS/iOS/Android/Win/Chromium) the system font
// chain has them via Apple Symbols / Segoe UI Symbol / Noto Music. SVG path
// equivalents would be more reliable but ~50× more code; we accept the trade.
const TREBLE_CLEF = '𝄞';
const BASS_CLEF = '𝄢';
const SHARP = '♯';
const MUSIC_FONT_STACK = "'Bravura', 'Noto Music', 'Apple Symbols', 'Segoe UI Symbol', serif";

function positionToY(position: number): number {
  return STAFF_CENTER_Y + (STAFF_CENTER_POSITION - position) * POSITION_STEP_Y;
}

const STAFF_LINE_POSITIONS = [0, 2, 4, 6, 8] as const;

export function Staff({
  note,
  clef = 'treble',
  label,
  height = 200,
  className,
}: StaffProps): JSX.Element {
  const position = noteToStaffPosition(note);
  const noteY = positionToY(position);
  const ledgers = ledgerLinesFor(position);
  const showSharp = hasSharp(note);

  // Stem direction: notes at or above the middle line render with stem DOWN
  // on the LEFT side; notes below render with stem UP on the RIGHT.
  const stemDown = position >= STAFF_CENTER_POSITION;
  const stemX = stemDown ? NOTE_X - STEM_OFFSET : NOTE_X + STEM_OFFSET;
  const stemY1 = noteY;
  const stemY2 = stemDown ? noteY + STEM_LENGTH : noteY - STEM_LENGTH;

  const clefGlyph = clef === 'treble' ? TREBLE_CLEF : BASS_CLEF;
  // Treble clef wraps around G4 (position 2); bass wraps around F3 — but we
  // keep treble geometry. The glyph baseline sits below its center, so we
  // anchor visually around line 2 with a small downward nudge.
  const clefY = clef === 'treble' ? positionToY(2) + 6 : positionToY(6) + 4;
  const clefFontSize = 28;

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      style={{ height: `${height}px`, width: 'auto' }}
      className={className}
      role="img"
      aria-label={label ? `${label} (${note})` : note}
    >
      {/* Staff lines */}
      {STAFF_LINE_POSITIONS.map((pos) => (
        <line
          key={pos}
          x1={STAFF_LEFT}
          x2={STAFF_RIGHT}
          y1={positionToY(pos)}
          y2={positionToY(pos)}
          stroke="currentColor"
          strokeWidth={0.4}
          strokeLinecap="square"
        />
      ))}

      {/* Clef */}
      <text
        x={CLEF_X}
        y={clefY}
        fontSize={clefFontSize}
        fontFamily={MUSIC_FONT_STACK}
        fill="currentColor"
        stroke="none"
      >
        {clefGlyph}
      </text>

      {/* Ledger lines */}
      {ledgers.map((pos) => (
        <line
          key={pos}
          x1={NOTE_X - LEDGER_HALF_WIDTH}
          x2={NOTE_X + LEDGER_HALF_WIDTH}
          y1={positionToY(pos)}
          y2={positionToY(pos)}
          stroke="currentColor"
          strokeWidth={0.5}
          strokeLinecap="square"
        />
      ))}

      {/* Sharp accidental */}
      {showSharp && (
        <text
          x={SHARP_X}
          y={noteY + 2}
          fontSize={9}
          fontFamily={MUSIC_FONT_STACK}
          fill="currentColor"
          stroke="none"
          textAnchor="middle"
        >
          {SHARP}
        </text>
      )}

      {/* Stem */}
      <line
        x1={stemX}
        x2={stemX}
        y1={stemY1}
        y2={stemY2}
        stroke="currentColor"
        strokeWidth={0.6}
        strokeLinecap="square"
      />

      {/* Notehead — slightly tilted ellipse, classic engraving look. */}
      <ellipse
        cx={NOTE_X}
        cy={noteY}
        rx={NOTEHEAD_RX}
        ry={NOTEHEAD_RY}
        fill="currentColor"
        stroke="none"
        transform={`rotate(-22 ${String(NOTE_X)} ${String(noteY)})`}
      />

      {/* Label */}
      {label && (
        <text
          x={VIEWBOX_W / 2}
          y={VIEWBOX_H - 6}
          fontSize={6.5}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fill="currentColor"
          stroke="none"
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </svg>
  );
}

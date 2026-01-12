# CELPIP Exam UI Implementation Plan (UPDATED)

## Overview
Build realistic exam simulation UI components matching the actual CELPIP exam interface for all 4 sections: Listening, Reading, Writing, and Speaking.

## Key UI Patterns (From Screenshots)

### Common Layout Structure
- **Background**: Dark grey/black background
- **Content Area**: White/light grey card with rounded corners, centered on dark background
- **Header Bar**: Light grey bar at top with:
  - Left: Test identifier (e.g., "Practice Test 25 [New] - [Section] Task [N]")
  - Center-Right: Timer in dark blue text (format: MM:SS)
  - Top-Right: "Next" button (dark gray/black with white text)
- **Footer Bar**: Light grey bar at bottom with:
  - Bottom-Right: "Back" button (dark gray/black with white text) - visible but functionality may be limited
- **Button Style**: Custom dark gray/black buttons with white text, rectangular shape

### Navigation Rules
- **NO going back** to previous questions once shown
- Questions shown **one at a time**
- Questions **grouped by section** (e.g., "Listening Task 1", "Writing Task 1")
- No question sidebar/navigation menu
- Only "Next" and "Back" buttons (Back may be disabled/limited)

---

## 1. LISTENING SECTION

### UI Layout (From Screenshot)
```
┌────────────────────────────────────────────────────────┐
│ [Test Name]                    [Timer MM:SS]  [Next]   │  ← Header Bar (light grey)
├────────────────────────────────────────────────────────┤
│                                                         │
│              Listen to the conversation.                │  ← Instructions (blue text)
│       You will hear the conversation only once.         │
│          It is about 1 to 1.5 minutes long.             │
│                                                         │
│                    [Audio Player]                       │  ← Centered audio player
│              ▶ 0:00 / 0:00 [progress bar] 🔊 ⋮         │
│                                                         │
├────────────────────────────────────────────────────────┤
│                                              [Back]     │  ← Footer Bar (light grey)
└────────────────────────────────────────────────────────┘
```

### Components Needed

#### 1.1 Listening Exam Component (`components/exam/listening-exam.tsx`)
**Layout:**
- Dark background (full screen)
- White/light grey content card (centered, rounded corners)
- Header bar (light grey) with test name, timer (MM:SS), Next button
- White content area with:
  - Instructions (blue text, centered)
  - Audio player (centered)
  - Questions (shown one at a time, below audio)
- Footer bar (light grey) with Back button (bottom-right)

**Features:**
- Timer in top-right (MM:SS format)
- Audio plays once (simulate real exam)
- Questions displayed one at a time after audio
- Next button advances to next question/task
- Back button (visible but may be disabled)

#### 1.2 Audio Player Component (`components/exam/audio-player.tsx`)
**UI Elements:**
- Play button (triangle icon)
- Time display: "current / total" (e.g., "0:00 / 0:00")
- Progress bar (empty initially)
- Volume icon (speaker icon)
- Menu icon (three dots)

**Functionality:**
- Play/pause controls
- Time tracking (current time / total duration)
- Progress bar visualization
- Volume control (on click)
- Audio plays once (disable replay after completion)
- Format: MM:SS for time display

#### 1.3 Question Display
- Questions shown one at a time after audio
- Multiple choice options (radio buttons or styled buttons)
- Selected state highlighting
- No question navigation sidebar

---

## 2. READING SECTION

### UI Layout (Expected - Split Screen)
```
┌────────────────────────────────────────────────────────┐
│ [Test Name]                    [Timer MM:SS]  [Next]   │  ← Header Bar
├──────────────────────┬─────────────────────────────────┤
│                      │                                 │
│   Reading Passage    │      Question [Number]          │
│   (Scrollable)       │      [Question Text]            │
│                      │                                 │
│   [Text content]     │      [ ] Option A               │
│   [Text content]     │      [ ] Option B               │
│   [Text content]     │      [ ] Option C               │
│   [Text content]     │      [ ] Option D               │
│                      │                                 │
└──────────────────────┴─────────────────────────────────┘
│                                              [Back]     │  ← Footer Bar
└────────────────────────────────────────────────────────┘
```

### Components Needed

#### 2.1 Reading Exam Component (`components/exam/reading-exam.tsx`)
**Layout:**
- Split-screen: Passage (left), Questions (right)
- Both panels scrollable independently
- Header bar with timer and Next button
- Footer bar with Back button

**Features:**
- Passage display (left side, scrollable)
- Questions shown one at a time (right side, scrollable)
- Timer in top-right
- Next/Back navigation
- Questions grouped by part/task

---

## 3. WRITING SECTION

### UI Layout (From Screenshot)
```
┌────────────────────────────────────────────────────────┐
│ [Test Name]          [Time remaining: MM:SS]  [Next]   │  ← Header Bar
├──────────────────────┬─────────────────────────────────┤
│ Read the following   │ Write an email to...            │
│ information.         │ Your email should do:           │
│                      │ • Explain your interest...      │
│ [Context text]       │ • Ask for more details...       │
│                      │ • Inquire about cost...         │
│                      │                                 │
│                      │ Word Count: [N]                 │
│                      │                                 │
│                      │ ┌─────────────────────────┐     │
│                      │ │ [Text Input Area]       │     │
│                      │ │                         │     │
│                      │ │                         │     │
│                      │ └─────────────────────────┘     │
│                      │                                 │
├──────────────────────┴─────────────────────────────────┤
│                                              [Back]     │  ← Footer Bar
└────────────────────────────────────────────────────────┘
```

### Components Needed

#### 3.1 Writing Exam Component (`components/exam/writing-exam.tsx`)
**Layout:**
- **Split-screen**: Left panel (context/instructions), Right panel (task instructions + editor)
- Header bar with timer ("Time remaining: MM:SS") and Next button
- Footer bar with Back button

**Left Panel:**
- Heading: "Read the following information." (bold, dark blue)
- Context text (black text)

**Right Panel:**
- Heading: "Write an email to..." (bold, dark blue)
- Instructions with bullet points (black text)
- Word count display: "Word Count: [N]"
- Text input area (textarea with blue border)
- Scrollable text area

**Features:**
- Timer in top-right (format: "Time remaining: MM:SS")
- Real-time word count
- Two tasks: Task 1 (Email) and Task 2 (Essay)
- Text editor (plain textarea or rich text)
- Character limit display (if applicable)
- Auto-save (optional)

---

## 4. SPEAKING SECTION

### UI Layout (From Screenshot)
```
┌────────────────────────────────────────────────────────┐
│ [Test Name]  [Prep: 30s Rec: 60s]           [Next]     │  ← Header Bar
├────────────────────────────────────────────────────────┤
│                                                         │
│   Describe some things that are happening in the        │
│   picture below as well as you can. The person with     │
│   whom you are speaking cannot see the picture.         │
│                                                         │
│   ┌───────────────────────┐  ┌──────────┐             │
│   │                       │  │ Prep Time│             │
│   │    [Image/Picture]    │  │          │             │
│   │                       │  │    27    │  ← Countdown│
│   │                       │  │          │             │
│   └───────────────────────┘  └──────────┘             │
│                                                         │
│                                                         │
├────────────────────────────────────────────────────────┤
│                                              [Back]     │  ← Footer Bar
└────────────────────────────────────────────────────────┘
```

### Components Needed

#### 4.1 Speaking Exam Component (`components/exam/speaking-exam.tsx`)
**Layout:**
- Header bar with test name, time limits ("Preparation: 30s Recording: 60s"), Next button
- Main content area:
  - Instructions (bold black text)
  - Large image/picture (left/center)
  - Preparation Time panel (right side, light grey)
    - Title: "Preparation Time:"
    - Countdown: Large blue number (e.g., "27")
- Footer bar with Back button

**Features:**
- Preparation timer (30 seconds, countdown in panel)
- Recording timer (varies: 30-90 seconds)
- Image display for scene description tasks
- Recording controls (Start/Stop/Re-record)
- Playback controls
- Visual recording indicator

#### 4.2 Recording Component (`components/exam/recording-controls.tsx`)
**Functionality:**
- Preparation phase countdown (30 seconds)
- Recording phase with timer
- MediaRecorder API integration
- Audio playback
- Visual feedback (pulsing indicator when recording)

---

## SHARED COMPONENTS

### 1. Exam Header (`components/exam/exam-header.tsx`)
**Structure:**
- Light grey bar spanning full width
- Left: Test identifier text
- Center-Right: Timer (dark blue text, MM:SS format)
- Right: Next button (dark gray/black, white text)

**Props:**
```typescript
interface ExamHeaderProps {
  testName: string
  taskName: string
  timeRemaining: number // in seconds
  onNext: () => void
}
```

### 2. Exam Footer (`components/exam/exam-footer.tsx`)
**Structure:**
- Light grey bar at bottom
- Back button (bottom-right, dark gray/black, white text)
- Button may be disabled based on section/question

**Props:**
```typescript
interface ExamFooterProps {
  onBack: () => void
  disabled?: boolean
}
```

### 3. Timer Component (`components/exam/exam-timer.tsx`)
**Display:**
- Format: MM:SS (e.g., "26:56")
- Dark blue text color
- Countdown functionality
- Position: Top-right of header

### 4. Exam Layout Wrapper (`components/exam/exam-layout.tsx`)
**Structure:**
- Dark background (full viewport)
- White/light grey content card (centered, rounded corners)
- Header (ExamHeader)
- Main content area (section-specific)
- Footer (ExamFooter)

---

## IMPLEMENTATION PHASES

### Phase 1: Foundation & Layout (Priority 1)
1. **Exam Layout Component** (`components/exam/exam-layout.tsx`)
   - Dark background wrapper
   - White content card structure
   - Header and Footer integration

2. **Header Component** (`components/exam/exam-header.tsx`)
   - Test name display
   - Timer integration
   - Next button styling

3. **Footer Component** (`components/exam/exam-footer.tsx`)
   - Back button styling
   - Positioning

4. **Timer Component** (`components/exam/exam-timer.tsx`)
   - MM:SS format
   - Countdown logic
   - Dark blue styling

5. **Update Route** (`app/(main)/practice/[section]/page.tsx`)
   - Replace ComingSoon with exam components
   - Route integration

### Phase 2: Writing Section (Priority 2 - Has Screenshot Reference)
1. **Writing Exam Component** (`components/exam/writing-exam.tsx`)
   - Split-screen layout
   - Left panel (context)
   - Right panel (instructions + editor)
   - Word count functionality

2. **Writing Task Component** (`components/exam/writing-task.tsx`)
   - Textarea/editor
   - Word count real-time calculation
   - Task instructions display

### Phase 3: Listening Section (Priority 3 - Has Screenshot Reference)
1. **Audio Player Component** (`components/exam/audio-player.tsx`)
   - Play/pause controls
   - Time display (MM:SS format)
   - Progress bar
   - Volume icon
   - Menu icon

2. **Listening Exam Component** (`components/exam/listening-exam.tsx`)
   - Single question display
   - Instructions (blue text)
   - Audio player integration
   - Question display

### Phase 4: Speaking Section (Priority 4 - Has Screenshot Reference)
1. **Recording Controls** (`components/exam/recording-controls.tsx`)
   - Preparation timer panel
   - Recording functionality
   - Playback controls

2. **Speaking Exam Component** (`components/exam/speaking-exam.tsx`)
   - Image display
   - Preparation time panel
   - Instructions layout
   - Recording integration

### Phase 5: Reading Section (Priority 5 - No Screenshot, Based on Pattern)
1. **Reading Passage Component** (`components/exam/reading-passage.tsx`)
   - Text display
   - Scrollable area

2. **Reading Exam Component** (`components/exam/reading-exam.tsx`)
   - Split-screen layout
   - Passage (left)
   - Questions (right)

### Phase 6: Question Types (All Phases)
1. **Multiple Choice Component** (`components/exam/question-types/multiple-choice.tsx`)
2. **Other question types as needed**

---

## STYLING SPECIFICATIONS

### Colors
- **Background**: Dark grey/black (`hsl(240 6% 10%)` or similar)
- **Content Card**: White (`hsl(0 0% 100%)`)
- **Header/Footer Bars**: Light grey (`hsl(240 4% 96%)` or similar)
- **Text**: Black (`hsl(240 8% 8%)`)
- **Instructions**: Dark blue (e.g., `hsl(217 88% 45%)`)
- **Timer**: Dark blue (matching instructions)
- **Buttons**: Dark gray/black background (`hsl(240 5% 20%)`), white text

### Typography
- **Test Name/Task**: Standard weight, readable size
- **Instructions**: Blue text, centered (for listening)
- **Timer**: Dark blue, readable size
- **Body Text**: Black, standard line height

### Button Styles
- **Next/Back Buttons**:
  - Background: Dark gray/black (`bg-slate-800` or `bg-gray-900`)
  - Text: White
  - Border: None or subtle
  - Padding: Adequate for clickability
  - Rounded corners: Minimal (rectangular preferred)

### Layout
- **Content Card**: 
  - Rounded corners (`rounded-lg` or `rounded-xl`)
  - Centered on dark background
  - Max width constraint
  - Shadow: Subtle elevation

---

## DATA STRUCTURE

### Question/Task Data Model
```typescript
interface ListeningTask {
  id: string
  taskNumber: number
  audioSource: string
  instructions: string
  questions: Question[]
}

interface WritingTask {
  id: string
  taskNumber: number
  type: 'email' | 'essay'
  context: string // Left panel text
  instructions: string // Right panel heading
  requirements: string[] // Bullet points
  wordLimit: { min: number; max: number }
}

interface SpeakingTask {
  id: string
  taskNumber: number
  instructions: string
  imageSource?: string
  preparationTime: number // seconds
  recordingTime: number // seconds
}
```

---

## TECHNICAL IMPLEMENTATION NOTES

### State Management
- Use React Context or local state for exam session
- Timer state (countdown)
- Current question/task index
- Answers/responses storage
- Audio playback state
- Recording state

### Audio Handling
- HTML5 `<audio>` element for playback
- Support MP3/WAV formats
- Handle "plays once" behavior
- Time tracking for display

### Recording
- MediaRecorder API
- Handle microphone permissions
- Store as Blob (local storage)
- Playback functionality

### Responsive Design
- Desktop-first (exam is desktop-based)
- Mobile: Stack split-screens vertically
- Maintain usability on tablets

---

## QUESTIONS RESOLVED

✅ **Split screen layouts**: Confirmed for Writing and Reading; Speaking uses different layout
✅ **Match images**: Exact UI matching required
✅ **Navigation**: No going back; questions one at a time
✅ **Timer**: Top-right, MM:SS format
✅ **Buttons**: Custom styled (dark gray/black, white text)
✅ **Question grouping**: By section/task

---

## NEXT STEPS

1. ✅ Plan approved based on screenshots
2. ⏭️ Start Phase 1: Foundation & Layout Components
3. ⏭️ Implement Writing Section (has clear screenshot reference)
4. ⏭️ Implement Listening Section (has screenshot reference)
5. ⏭️ Implement Speaking Section (has screenshot reference)
6. ⏭️ Implement Reading Section (inferred from patterns)

---

*This plan is based on actual CELPIP exam UI screenshots and user clarifications. Implementation will closely match the provided reference images.*

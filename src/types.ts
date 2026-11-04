/**
 * Javaneh Classroom Garden - Type Definitions
 * Following the non-punitive, emotional-care classroom paradigm.
 */

export type Mood = 'thriving' | 'content' | 'longing' | 'alert';
export type Stage = 1 | 2 | 3 | 4 | 5;

export type PotStyle = 'terracotta' | 'strawberry' | 'crystal' | 'cosmic' | 'sage' | 'sand' | 'clay';

export interface Plant {
  id: string;
  plantName: string;       // e.g. «پیچک»، «سبزه»، «نارنج»، «یاس»
  childName: string;       // e.g. «علی»، «سارا» — Only revealed inside the Drawer
  gen: number;             // 1, 2, 3...
  mood: Mood;
  stage: Stage;
  growthDays: number;      // 5-25 days
  lastSeenDays: number;    // 0 = today, 1 = yesterday, 2 = 2 days ago, etc.
  activeDream: string | null;
  memoriesCount: number;   // 0-10 recorded moments
  archived: boolean;       // Completed generation in seed bank
  accessory?: 'ladybug' | 'dewdrop' | 'ribbon' | 'flower' | 'strawhat' | 'none';
  potStyle?: PotStyle;
  randomOffset?: number;   // 0-16px vertical organic offset in garden
  lastHabitCompleted?: string; // e.g. «بیدارباش پیش از طلوع»، «تکلیف ریاضی»
  teacherNudgeSent?: boolean;  // Teacher clicked gentle reminder today
  completedHabitsToday?: string[]; // e.g. ['wake', 'brush']
}

export interface RadarData {
  overall: 'good' | 'mixed' | 'needs_care';
  overallMessage: string;
  needsAttentionCount: number;
  needsAttention: Array<{
    plantId: string;
    childName: string;
    plantName: string;
    mood: 'longing' | 'alert';
    lastSeenDays: number;
    hint: string;
  }>;
  goodNews: Array<{
    type: 'comeback' | 'stage' | 'seed' | 'dream';
    text: string;
  }>;
  healthPercentage: number; // 0-100 for subtle gradient bar (no stressful number displayed)
}

export interface ClassData {
  className: string;
  schoolName: string;
  totalPlants: number;
  radar: RadarData;
  plants: Plant[];
  seedBank: Plant[];
  isShelterMode?: boolean; // War/crisis hibernation mode: absence decay paused or decelerated
}

export interface ConversationSuggestion {
  id: string;
  moodContext: string;
  prompt: string;
  pedagogyNote: string;
}

export type AppRole = 'owner' | 'school' | 'teacher' | 'student';

// Platform Module Entitlement IDs
export type PlatformModuleId = 'javaneh_garden' | 'teacher_assistant' | 'math_game' | 'rosha_v1' | 'teacher_widgets';

export interface PlatformModule {
  id: PlatformModuleId;
  title: string;
  subtitle: string;
  icon: string;
  category: 'emotional_rhythm' | 'pedagogy_math' | 'virtual_classroom';
  description: string;
  pricePerSeatMonthly: number; // in Tomans or standard unit
  color: string;
}

export interface School {
  id: string;
  name: string;
  username: string;
  type?: 'school' | 'solo_teacher';
  startDate: string;
  endDate: string;
  seatsTotal: number;
  seatsUsed: number;
  status: 'active' | 'suspended' | 'expired';
  enabledModules: PlatformModuleId[];
}

export interface ClassroomInfo {
  id: string;
  name: string;
  teacherName: string;
  studentCount: number;
  activeModules: PlatformModuleId[];
}

export interface TeacherInfo {
  id: string;
  name: string;
  username: string;
  assignedClasses: string[];
  status: 'active' | 'inactive';
}

// Teacher Assistant and Math Game Types
export type DescriptiveGrade = 'خیلی خوب' | 'خوب' | 'قابل قبول' | 'نیازمند تلاش و آموزش بیشتر';

export interface StudentDescriptiveEval {
  studentId: string;
  childName: string;
  mathSkill: string;
  grade: DescriptiveGrade;
  teacherNote: string;
  date: string;
}

export interface MathChallengeQuestion {
  id: string;
  question: string;
  options: number[];
  correctAnswer: number;
  hint: string;
  topic: string;
}

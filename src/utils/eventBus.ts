/**
 * Decoupled Event Bus for the Unified EdTech Platform
 * Allows Layer 5 Widgets (Javaneh, Math Arena, Wheel of Fortune, Leaderboard)
 * to communicate seamlessly without direct coupling or database dependencies.
 */

export type PlatformEventType =
  | 'HABIT_COMPLETED'           // e.g. wake, brush, homework, sleep
  | 'MATH_CHALLENGE_SOLVED'     // e.g. student solved a fact
  | 'BOTTLENECK_IDENTIFIED'     // e.g. CEAP error diagnosed
  | 'SPIN_REWARD_AWARDED'       // e.g. unlocked cosmetic accessory or stars
  | 'SHELTER_MODE_CHANGED'      // e.g. crisis mode enabled/disabled
  | 'STUDENT_LEVEL_UP';         // e.g. new plant stage or station unlocked

export interface PlatformEventPayload {
  studentId: string;
  studentName?: string;
  classId?: string;
  timestamp: number;
  data: Record<string, any>;
}

type EventListener = (payload: PlatformEventPayload) => void;

class PlatformEventBus {
  private listeners: Map<PlatformEventType, Set<EventListener>> = new Map();

  public subscribe(eventType: PlatformEventType, listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  public on(eventType: PlatformEventType, listener: EventListener): () => void {
    return this.subscribe(eventType, listener);
  }

  public emit(eventType: PlatformEventType, payload: PlatformEventPayload): void {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.forEach((fn) => {
        try {
          fn(payload);
        } catch (err) {
          console.error(`[EventBus] Error in handler for ${eventType}:`, err);
        }
      });
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}

export const eventBus = new PlatformEventBus();

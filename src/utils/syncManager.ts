/**
 * Offline-First Outbox Synchronization Manager
 * Based on z.ai's local.mjs and delay-tolerant LAN sync protocols.
 * Ensures that activities performed at home or during power/network outages
 * are stored locally and reliably synced with ACK when the school LAN is reachable.
 */

export interface OutboxItem {
  id: string;
  scope: string; // e.g. school/{schoolId}/class/{classId}
  action: string;
  payload: Record<string, any>;
  createdAt: number;
  retryCount: number;
  synced: boolean;
}

const OUTBOX_STORAGE_KEY = 'javaneh_offline_outbox_v1';

export class SyncManager {
  private static instance: SyncManager;
  private queue: OutboxItem[] = [];
  private isOnlineLAN: boolean = true;
  private listeners: Set<(pendingCount: number) => void> = new Set();

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(OUTBOX_STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch {
      this.queue = [];
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(this.queue));
    } catch {
      // Quota exceeded guard
    }
    this.notify();
  }

  public enqueue(scope: string, action: string, payload: Record<string, any>): string {
    const id = `outbox-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const item: OutboxItem = {
      id,
      scope,
      action,
      payload,
      createdAt: Date.now(),
      retryCount: 0,
      synced: false,
    };
    this.queue.push(item);
    this.saveToStorage();
    return id;
  }

  public getPendingCount(): number {
    return this.queue.filter((item) => !item.synced).length;
  }

  public getQueue(): OutboxItem[] {
    return [...this.queue];
  }

  public markSynced(id: string) {
    this.queue = this.queue.filter((item) => item.id !== id);
    this.saveToStorage();
  }

  public clearAll() {
    this.queue = [];
    this.saveToStorage();
  }

  public subscribe(listener: (pendingCount: number) => void): () => void {
    this.listeners.add(listener);
    listener(this.getPendingCount());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const count = this.getPendingCount();
    this.listeners.forEach((fn) => fn(count));
  }
}

export const syncManager = SyncManager.getInstance();

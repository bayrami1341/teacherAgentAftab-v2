import test from 'node:test';
import assert from 'node:assert/strict';
import { eventBus } from './eventBus';
import { SyncManager } from './syncManager';

test('eventBus emits and receives decoupled events correctly', () => {
  let receivedPayload: any = null;
  const unsubscribe = eventBus.on('HABIT_COMPLETED', (event) => {
    receivedPayload = event;
  });

  const sampleEvent = {
    studentId: 'p-15',
    studentName: 'علی',
    timestamp: Date.now(),
    data: { habitKey: 'wake', habitTitle: 'بیدارباش سحرگاه' },
  };

  eventBus.emit('HABIT_COMPLETED', sampleEvent);

  assert.ok(receivedPayload !== null);
  assert.equal(receivedPayload.studentId, 'p-15');
  assert.equal(receivedPayload.data.habitKey, 'wake');

  // Test unsubscribe
  unsubscribe();
  receivedPayload = null;
  eventBus.emit('HABIT_COMPLETED', sampleEvent);
  assert.equal(receivedPayload, null, 'Unsubscribed listener must not be called');
});

test('SyncManager enqueues items and reports pending count', () => {
  const sync = SyncManager.getInstance();
  sync.clearAll();
  assert.equal(sync.getPendingCount(), 0);

  const id1 = sync.enqueue('school/sch-1/class/c-1', 'SUBMIT_HABIT', { habit: 'wake' });
  const id2 = sync.enqueue('school/sch-1/class/c-1', 'SOLVE_CHALLENGE', { fact: '5x4', ans: 20 });

  assert.equal(sync.getPendingCount(), 2);
  const queue = sync.getQueue();
  assert.equal(queue.length, 2);
  assert.equal(queue[0].id, id1);
  assert.equal(queue[1].id, id2);

  // Mark first item as synced
  sync.markSynced(id1);
  assert.equal(sync.getPendingCount(), 1);

  // Clear all
  sync.clearAll();
  assert.equal(sync.getPendingCount(), 0);
});

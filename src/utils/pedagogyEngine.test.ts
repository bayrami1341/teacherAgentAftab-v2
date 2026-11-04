import test from 'node:test';
import assert from 'node:assert/strict';
import {
  diagnoseMultiplicationError,
  getCpaPrescription,
  calculateAbsenceMood,
  generateConsultantSnapshot,
} from './pedagogyEngine';

test('diagnoseMultiplicationError identifies Zero and Identity Property slip (KH-G2)', () => {
  // 5 * 0 answered as 5
  assert.equal(diagnoseMultiplicationError(5, 0, 5), 'KH-G2');
  // 7 * 1 answered as 8 (adding instead of multiplying)
  assert.equal(diagnoseMultiplicationError(7, 1, 8), 'KH-G2');
});

test('diagnoseMultiplicationError identifies Skip-Counting Drift (KH-G1)', () => {
  // 6 * 4 = 24, student answered 20 (off by 4, exactly one count)
  assert.equal(diagnoseMultiplicationError(6, 4, 20), 'KH-G1');
  // 6 * 4 = 24, student answered 28 (off by 4)
  assert.equal(diagnoseMultiplicationError(6, 4, 28), 'KH-G1');
});

test('diagnoseMultiplicationError identifies Near-Fact Slip (KH-G3)', () => {
  // 7 * 8 = 56, student answered 54 (rhyme / adjacent confusion)
  assert.equal(diagnoseMultiplicationError(7, 8, 54), 'KH-G3');
});

test('getCpaPrescription returns 3-stage clinical steps', () => {
  const rx = getCpaPrescription('KH-G1');
  assert.equal(rx.code, 'KH-G1');
  assert.ok(rx.concreteStep.length > 10, 'Concrete step should be descriptive');
  assert.ok(rx.pictorialStep.length > 10, 'Pictorial step should be descriptive');
  assert.ok(rx.abstractStep.length > 10, 'Abstract step should be descriptive');
});

test('calculateAbsenceMood respects normal non-punitive degradation', () => {
  assert.equal(calculateAbsenceMood(0, false), 'thriving');
  assert.equal(calculateAbsenceMood(1, false), 'thriving');
  assert.equal(calculateAbsenceMood(2, false), 'content');
  assert.equal(calculateAbsenceMood(3, false), 'longing');
  assert.equal(calculateAbsenceMood(6, false), 'alert');
});

test('calculateAbsenceMood respects war/crisis shelter mode (4x decelerated)', () => {
  // In shelter mode, 3 or 4 days of power outage leaves plant in thriving state
  assert.equal(calculateAbsenceMood(3, true), 'thriving');
  assert.equal(calculateAbsenceMood(4, true), 'thriving');
  assert.equal(calculateAbsenceMood(7, true), 'content');
  assert.equal(calculateAbsenceMood(12, true), 'longing');
  assert.equal(calculateAbsenceMood(18, true), 'alert');
});

test('generateConsultantSnapshot produces HMAC-signed export without student PII', () => {
  const school = {
    id: 'sch-test-1',
    name: 'دبستان آزمایشی شهید بهشتی',
    username: 'test_sch',
    seatsTotal: 150,
    seatsUsed: 120,
  };

  const snapshot = generateConsultantSnapshot(school, 5, 8);
  assert.equal(snapshot.schoolId, 'sch-test-1');
  assert.equal(snapshot.capacity.activeClasses, 5);
  assert.equal(snapshot.capacity.activeTeachers, 8);
  assert.equal(snapshot.privacyGuarantee, 'ZERO_STUDENT_PII_STRICT_COMPLIANCE');
  assert.ok(snapshot.hmacSignature.startsWith('sig_'));
  assert.equal((snapshot as any).students, undefined, 'Must not expose student records');
});

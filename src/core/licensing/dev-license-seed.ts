import { featureManager } from './feature-manager';
import { SignedLicenseLease } from '../security/crypto-verifier';

export function initDevLicenseSeed(): void {
  if (!import.meta.env.DEV) return;
  const activeLease = featureManager.getActiveLease();
  if (activeLease) return;

  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const mockDevLease: SignedLicenseLease = {
    payload: {
      tenantId: 'sch-demo-aftab',
      schoolName: 'دبستان هوشمند نمونه آفتاب (محیط توسعه)',
      licensedTools: ['tool-garden', 'tool-math-39', 'tool-circadian-rosha'],
      maxSeats: 150,
      issuedAt: now,
      validUntil: now + oneYearMs,
      graceUntil: now + oneYearMs + tenDaysMs,
      nonce: 'dev-environment-local-nonce'
    },
    signature: 'DEV_LOCAL_EPHEMERAL_SIGNATURE'
  };

  featureManager.setLeaseForTesting(mockDevLease);
  console.info('🌱 [Aftab Core] لایسنس توسعه با موفقیت بارگذاری شد (Sandbox Active).');
}

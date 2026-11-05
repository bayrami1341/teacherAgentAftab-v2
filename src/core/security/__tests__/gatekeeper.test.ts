import { describe, it, expect, beforeEach } from 'vitest';
import { SecurityGatekeeper, SecurityContext } from '../security-gatekeeper';
import { featureManager } from '../../licensing/feature-manager';

describe('Aftab SaaS Core Security Gatekeeper', () => {
  let gatekeeper: SecurityGatekeeper;

  beforeEach(() => {
    gatekeeper = SecurityGatekeeper.getInstance();
    featureManager.setLeaseForTesting({
      payload: {
        tenantId: 'sch-demo-aftab', schoolName: 'Test', licensedTools: ['tool-garden'],
        maxSeats: 100, issuedAt: Date.now(), validUntil: Date.now() + 100000, graceUntil: Date.now() + 200000, nonce: 'test'
      },
      signature: 'TEST_SIG'
    });
  });

  it('سناریو ۱: رد دسترسی به ابزار خریداری‌نشده', async () => {
    const context: SecurityContext = { userId: 't1', role: 'TEACHER', tenantId: 'sch-demo-aftab', sessionToken: 'tk' };
    const result = await gatekeeper.authorizeAction(context, { type: 'INITIALIZE_TOOL', targetTenantId: 'sch-demo-aftab', targetToolId: 'tool-vr', payload: null });
    expect(result.authorized).toBe(false);
    expect(result.errorCode).toBe('FEATURE_ACCESS_DENIED');
  });

  it('سناریو ۲: ممانعت از ارتقای دسترسی دانش‌آموز', async () => {
    const context: SecurityContext = { userId: 's1', role: 'STUDENT', tenantId: 'sch-demo-aftab', sessionToken: 'tk' };
    const result = await gatekeeper.authorizeAction(context, { type: 'UPDATE_SEAT_LIMIT', targetTenantId: 'sch-demo-aftab', payload: { limit: 500 } });
    expect(result.authorized).toBe(false);
    expect(result.errorCode).toBe('ROLE_HIERARCHY_VIOLATION');
  });

  it('سناریو ۳: انسداد نشت داده میان‌مستأجری', async () => {
    const context: SecurityContext = { userId: 'm1', role: 'SCHOOL_MANAGER', tenantId: 'sch-a', sessionToken: 'tk' };
    const result = await gatekeeper.authorizeAction(context, { type: 'PROCESS_PAYMENT', targetTenantId: 'sch-b', payload: {} });
    expect(result.authorized).toBe(false);
    expect(result.errorCode).toBe('CROSS_TENANT_ACCESS_DENIED');
  });

  it('سناریو ۴: ممانعت از ویرایش مالی توسط معلم', async () => {
    const context: SecurityContext = { userId: 't1', role: 'TEACHER', tenantId: 'sch-demo-aftab', sessionToken: 'tk' };
    const result = await gatekeeper.authorizeAction(context, { type: 'PROCESS_PAYMENT', targetTenantId: 'sch-demo-aftab', payload: {} });
    expect(result.authorized).toBe(false);
    expect(result.errorCode).toBe('ROLE_HIERARCHY_VIOLATION');
  });
});

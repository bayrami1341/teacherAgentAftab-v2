import { SignedLicenseLease, CryptoVerifier } from '../security/crypto-verifier';

export class FeatureManager {
  private static instance: FeatureManager;
  private readonly storageKey = 'aftab_signed_lease_v1';
  private currentLease: SignedLicenseLease | null = null;

  private constructor() { this.loadLease(); }

  public static getInstance(): FeatureManager {
    if (!FeatureManager.instance) FeatureManager.instance = new FeatureManager();
    return FeatureManager.instance;
  }

  private loadLease(): void {
    this.currentLease = null;
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed: SignedLicenseLease = JSON.parse(stored);
        if (parsed.payload && parsed.signature) this.currentLease = parsed;
      }
    } catch {
      this.currentLease = null;
      localStorage.removeItem(this.storageKey);
    }
  }

  public async updateLeaseFromVoucher(lease: SignedLicenseLease): Promise<{ success: boolean; error?: string }> {
    const isValid = await CryptoVerifier.verifyLicenseLease(lease);
    if (!isValid) {
      return { success: false, error: 'امضای دیجیتال لایسنس نامعتبر است.' };
    }
    this.currentLease = lease;
    localStorage.setItem(this.storageKey, JSON.stringify(lease));
    return { success: true };
  }

  public isToolAllowed(tenantId: string, toolId: string): { allowed: boolean; reason?: string } {
    if (!this.currentLease) return { allowed: false, reason: 'لایسنس فعالی ثبت نشده است.' };
    if (this.currentLease.payload.tenantId !== tenantId) return { allowed: false, reason: 'شناسه مدرسه مطابقت ندارد.' };
    
    const status = CryptoVerifier.isLeaseActive(this.currentLease.payload);
    if (!status.active) return { allowed: false, reason: 'اعتبار لایسنس به پایان رسیده است.' };
    
    if (!this.currentLease.payload.licensedTools.includes(toolId)) {
      return { allowed: false, reason: `ابزار ${toolId} خریداری نشده است.` };
    }
    return { allowed: true };
  }

  public getActiveLease(): SignedLicenseLease | null { return this.currentLease; }
  public setLeaseForTesting(lease: SignedLicenseLease | null): void { this.currentLease = lease; }
}

export const featureManager = FeatureManager.getInstance();

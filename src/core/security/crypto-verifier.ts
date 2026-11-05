export interface LicensePayload {
  tenantId: string;
  schoolName: string;
  licensedTools: string[];
  maxSeats: number;
  issuedAt: number;
  validUntil: number;
  graceUntil: number;
  nonce: string;
}

export interface SignedLicenseLease {
  payload: LicensePayload;
  signature: string;
}

export class CryptoVerifier {
  private static readonly AFTAB_PUBLIC_KEY_BASE64 = 
    "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE7n7qT+gM1fQx0w9p8k9L/8lM7Qd6j1V4r8b9N2Z8x" +
    "1wM3qX7Y6y0Z9w1V4r8b9N2Z8x1wM3qX7Y6y0Z9w==";

  private static cryptoKeyCache: CryptoKey | null = null;

  private static async getPublicKey(): Promise<CryptoKey> {
    if (this.cryptoKeyCache) return this.cryptoKeyCache;
    if (!window?.crypto?.subtle) {
      throw new Error("WebCrypto API در این محیط در دسترس نیست.");
    }
    const binaryDer = Uint8Array.from(atob(this.AFTAB_PUBLIC_KEY_BASE64), c => c.charCodeAt(0));
    this.cryptoKeyCache = await window.crypto.subtle.importKey(
      "spki", binaryDer.buffer, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]
    );
    return this.cryptoKeyCache;
  }

  public static async verifyLicenseLease(lease: SignedLicenseLease): Promise<boolean> {
    if (!lease || !lease.payload || !lease.signature) return false;
    try {
      const pubKey = await this.getPublicKey();
      const encoder = new TextEncoder();
      const serializedData = JSON.stringify(lease.payload, Object.keys(lease.payload).sort());
      const data = encoder.encode(serializedData);
      const signatureBin = Uint8Array.from(atob(lease.signature), c => c.charCodeAt(0));

      return await window.crypto.subtle.verify(
        { name: "ECDSA", hash: { name: "SHA-256" } }, pubKey, signatureBin, data
      );
    } catch {
      return false;
    }
  }

  public static isLeaseActive(payload: LicensePayload): { active: boolean; inGrace: boolean } {
    const now = Date.now();
    if (now <= payload.validUntil) return { active: true, inGrace: false };
    if (now <= payload.graceUntil) return { active: true, inGrace: true };
    return { active: false, inGrace: false };
  }
}

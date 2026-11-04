/**
 * Audit Logger Service
 * FERPA & Caliper compliant triple-tier audit logging system for AI Studio Aftab Platform.
 */

export type AuditCategory = 'CLINICAL_AUDIT' | 'SECURITY_LICENSE' | 'SYSTEM_ERROR';

export interface AuditLogEntry {
  id: string;
  category: AuditCategory;
  timestamp: string; // ISO-8601 UTC string
  userId?: string;
  deskCode?: string;
  operation?: 'READ' | 'WRITE' | 'UPDATE' | 'DELETE' | 'EXECUTE';
  event: string;
  details: Record<string, any>;
  ipAddress?: string;
  complianceTags: Array<'FERPA' | 'Caliper_v1.2' | 'ISO27001' | 'Student_Privacy'>;
}

class AuditLoggerService {
  private logBuffer: AuditLogEntry[] = [];
  private maxBufferSize: number = 1000;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('aftab_audit_logs');
      if (stored) {
        this.logBuffer = JSON.parse(stored);
      }
    } catch {
      this.logBuffer = [];
    }
  }

  private saveToStorage(): void {
    try {
      if (this.logBuffer.length > this.maxBufferSize) {
        this.logBuffer = this.logBuffer.slice(-this.maxBufferSize);
      }
      localStorage.setItem('aftab_audit_logs', JSON.stringify(this.logBuffer));
    } catch (e) {
      console.warn('Failed to save audit logs to localStorage:', e);
    }
  }

  private createEntry(
    category: AuditCategory,
    event: string,
    details: Record<string, any> = {},
    options: {
      userId?: string;
      deskCode?: string;
      operation?: 'READ' | 'WRITE' | 'UPDATE' | 'DELETE' | 'EXECUTE';
      complianceTags?: Array<'FERPA' | 'Caliper_v1.2' | 'ISO27001' | 'Student_Privacy'>;
    } = {}
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category,
      timestamp: new Date().toISOString(),
      event,
      details,
      userId: options.userId || 'system_operator',
      deskCode: options.deskCode,
      operation: options.operation || 'READ',
      complianceTags: options.complianceTags || ['FERPA', 'Student_Privacy'],
    };

    this.logBuffer.unshift(entry);
    this.saveToStorage();

    // Console output formatted as ISO-8601 JSON for secure inspection
    console.info(`[AUDIT::${category}]`, JSON.stringify(entry));
    return entry;
  }

  /**
   * 1. CLINICAL_AUDIT: Student clinical record access
   */
  public logClinicalAccess(
    userId: string,
    deskCode: string,
    operation: 'READ' | 'WRITE' | 'UPDATE' | 'DELETE',
    details: Record<string, any> = {}
  ): AuditLogEntry {
    return this.createEntry(
      'CLINICAL_AUDIT',
      `Access to clinical record at desk ${deskCode}`,
      details,
      {
        userId,
        deskCode,
        operation,
        complianceTags: ['FERPA', 'Caliper_v1.2', 'Student_Privacy'],
      }
    );
  }

  /**
   * 2. SECURITY_LICENSE: License modifications, grace period, payments, time tampering
   */
  public logSecurityLicense(
    event: string,
    details: Record<string, any> = {},
    userId: string = 'admin'
  ): AuditLogEntry {
    return this.createEntry('SECURITY_LICENSE', event, details, {
      userId,
      operation: 'UPDATE',
      complianceTags: ['ISO27001', 'FERPA'],
    });
  }

  /**
   * 3. SYSTEM_ERROR: Software errors, telemetry disconnections
   */
  public logSystemError(
    error: string | Error,
    context: Record<string, any> = {}
  ): AuditLogEntry {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    return this.createEntry(
      'SYSTEM_ERROR',
      `System Error: ${errorMessage}`,
      { ...context, stack },
      {
        userId: 'system',
        operation: 'EXECUTE',
        complianceTags: ['ISO27001'],
      }
    );
  }

  /**
   * getAuditHistory: Extract logs for inspector and school manager
   */
  public getAuditHistory(
    category?: AuditCategory,
    limit: number = 100
  ): AuditLogEntry[] {
    let filtered = this.logBuffer;
    if (category) {
      filtered = filtered.filter((log) => log.category === category);
    }
    return filtered.slice(0, limit);
  }

  public clearLogs(): void {
    this.logBuffer = [];
    localStorage.removeItem('aftab_audit_logs');
  }

  public exportLogsJSON(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }
}

export const auditLogger = new AuditLoggerService();

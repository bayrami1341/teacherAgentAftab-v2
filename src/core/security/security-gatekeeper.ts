import { featureManager } from '../licensing/feature-manager';

export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_MANAGER' | 'TEACHER' | 'STUDENT';

export interface SecurityContext {
  userId: string;
  role: UserRole;
  tenantId: string;
  classId?: string;
  seatCode?: string;
  sessionToken: string;
}

export type CoreActionType = 'INITIALIZE_TOOL' | 'DISPATCH_TELEMETRY' | 'RECORD_INTERVENTION' | 'UPDATE_SEAT_LIMIT' | 'PROCESS_PAYMENT';

export interface CoreAction<T = unknown> {
  type: CoreActionType;
  payload: T;
  targetTenantId: string;
  targetToolId?: string;
}

export class SecurityGatekeeper {
  private static instance: SecurityGatekeeper;
  private constructor() {}
  public static getInstance(): SecurityGatekeeper {
    if (!SecurityGatekeeper.instance) SecurityGatekeeper.instance = new SecurityGatekeeper();
    return SecurityGatekeeper.instance;
  }

  public async authorizeAction<T>(context: SecurityContext, action: CoreAction<T>): Promise<{ authorized: boolean; errorCode?: string; message?: string }> {
    if (context.role !== 'SUPER_ADMIN' && context.tenantId !== action.targetTenantId) {
      return { authorized: false, errorCode: 'CROSS_TENANT_ACCESS_DENIED', message: 'دسترسی به سایر مدارس مجاز نیست.' };
    }

    const roleCheck = this.checkRolePermissions(context.role, action.type);
    if (!roleCheck.allowed) {
      return { authorized: false, errorCode: 'ROLE_HIERARCHY_VIOLATION', message: roleCheck.reason };
    }

    if (action.targetToolId) {
      const toolCheck = featureManager.isToolAllowed(action.targetTenantId, action.targetToolId);
      if (!toolCheck.allowed) {
        return { authorized: false, errorCode: 'FEATURE_ACCESS_DENIED', message: toolCheck.reason };
      }
    }
    return { authorized: true };
  }

  private checkRolePermissions(role: UserRole, actionType: CoreActionType): { allowed: boolean; reason?: string } {
    switch (actionType) {
      case 'UPDATE_SEAT_LIMIT':
      case 'PROCESS_PAYMENT':
        if (role !== 'SUPER_ADMIN' && role !== 'SCHOOL_MANAGER') return { allowed: false, reason: 'فقط مدیر مدرسه یا سیستم.' };
        break;
      case 'RECORD_INTERVENTION':
        if (role !== 'TEACHER' && role !== 'SUPER_ADMIN') return { allowed: false, reason: 'فقط معلم مجاز است.' };
        break;
      case 'DISPATCH_TELEMETRY':
        if (role !== 'STUDENT' && role !== 'TEACHER') return { allowed: false, reason: 'فقط دانش‌آموز یا معلم.' };
        break;
    }
    return { allowed: true };
  }
}

export const securityGatekeeper = SecurityGatekeeper.getInstance();

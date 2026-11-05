import { IAftabPluginTool, ToolMetadata, ToolExecutionResponse } from '../base-tool.interface';
import { SecurityContext, securityGatekeeper } from '../../../core/security/security-gatekeeper';
export class GardenRoshaTool implements IAftabPluginTool {
  public readonly metadata: ToolMetadata = {
    id: 'tool-garden', name: 'باغچه یادگیری جوانه', description: 'شبیه‌ساز رشد گیاه میز کلاسی بر پایه تثبیت مفاهیم شناختی و لنگر ۳۹ روشا', iconName: 'Sprout',
    category: 'PEDAGOGY', version: '2.4.0', roshaAnchorsCovered: [1, 2, 8, 14, 39], minGrade: 1, maxGrade: 3, requiredLicenseFlag: 'tool-garden'
  };
  private isInitialized = false;
  public async initialize(context: SecurityContext): Promise<boolean> {
    const auth = await securityGatekeeper.authorizeAction(context, { type: 'INITIALIZE_TOOL', targetTenantId: context.tenantId, targetToolId: this.metadata.id, payload: null });
    if (!auth.authorized) throw new Error(auth.message || 'عدم دسترسی به ابزار باغچه جوانه');
    this.isInitialized = true; return true;
  }
  public async executeChallenge(context: SecurityContext, payload: any): Promise<ToolExecutionResponse> {
    if (!this.isInitialized) return { success: false, error: 'ابزار ابتدا باید توسط آموزگار مقداردهی اولیه شود.' };
    const auth = await securityGatekeeper.authorizeAction(context, { type: 'DISPATCH_TELEMETRY', targetTenantId: context.tenantId, targetToolId: this.metadata.id, payload });
    if (!auth.authorized) return { success: false, error: auth.message };
    const fatigue = (payload.durationSeconds > 180 || payload.attempts > 3) ? 2 : 0;
    return { success: true, data: { stage: payload.isCorrect ? 'شکوفایی گیاه میز' : 'نیازمند شبنم بازخورد', growthPoints: payload.isCorrect ? 20 : 5, seatCode: context.seatCode || 'میز ناشناس' }, fatigueIndex: fatigue };
  }
  public terminate(): void { this.isInitialized = false; }
}

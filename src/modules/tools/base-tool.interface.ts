import { SecurityContext } from '../../core/security/security-gatekeeper';
export interface ToolMetadata {
  id: string; name: string; description: string; iconName: string;
  category: 'PEDAGOGY' | 'COGNITIVE_RHYTHM' | 'ASSESSMENT' | 'MATH_GAMES';
  version: string; roshaAnchorsCovered: number[]; minGrade: number; maxGrade: number; requiredLicenseFlag: string;
}
export interface ToolExecutionResponse<T = unknown> { success: boolean; data?: T; error?: string; fatigueIndex?: number; }
export interface IAftabPluginTool {
  readonly metadata: ToolMetadata;
  initialize(context: SecurityContext): Promise<boolean>;
  executeChallenge(context: SecurityContext, payload: unknown): Promise<ToolExecutionResponse>;
  terminate(): void;
}

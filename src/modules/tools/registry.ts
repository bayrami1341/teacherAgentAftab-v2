import { IAftabPluginTool, ToolMetadata } from './base-tool.interface';
import { GardenRoshaTool } from './garden/garden-tool';
import { MathCartridgeTool } from './math/math-cartridge-tool';
import { featureManager } from '../../core/licensing/feature-manager';

export class ToolRegistry {
  private static factories: Map<string, () => IAftabPluginTool> = new Map();
  private static metadataList: ToolMetadata[] = [];

  public static init(): void {
    if (this.factories.size > 0) return;
    this.register('tool-garden', () => new GardenRoshaTool());
    this.register('tool-math-39', () => new MathCartridgeTool());
  }

  public static register(toolId: string, factory: () => IAftabPluginTool): void {
    this.factories.set(toolId, factory);
    const instance = factory();
    this.metadataList.push(instance.metadata);
  }

  public static createToolInstance(toolId: string): IAftabPluginTool | null {
    this.init();
    const factory = this.factories.get(toolId);
    return factory ? factory() : null;
  }

  public static getAllMetadata(): ToolMetadata[] {
    this.init();
    return [...this.metadataList];
  }

  public static getLicensedToolsForTenant(tenantId: string): {
    licensed: ToolMetadata[];
    unlicensed: ToolMetadata[];
  } {
    this.init();
    const licensed: ToolMetadata[] = [];
    const unlicensed: ToolMetadata[] = [];
    for (const meta of this.metadataList) {
      const check = featureManager.isToolAllowed(tenantId, meta.id);
      if (check.allowed) licensed.push(meta);
      else unlicensed.push(meta);
    }
    return { licensed, unlicensed };
  }
}
ToolRegistry.init();

import React, { useState } from 'react';
import { Lock, Play, AlertCircle, Sparkles } from 'lucide-react';
import { ToolRegistry } from '../../modules/tools/registry';
import { ToolMetadata } from '../../modules/tools/base-tool.interface';
import { GardenWorkspace } from './workspaces/GardenWorkspace';
import { MathWorkspace } from './workspaces/MathWorkspace';

interface ToolsCatalogProps {
  tenantId: string;
  userRole: 'SUPER_ADMIN' | 'SCHOOL_MANAGER' | 'TEACHER' | 'STUDENT';
  onLaunchTool?: (toolId: string) => void;
}

export const ToolsCatalog: React.FC<ToolsCatalogProps> = ({ tenantId, userRole, onLaunchTool }) => {
  const { licensed, unlicensed } = ToolRegistry.getLicensedToolsForTenant(tenantId);
  const [selectedToolStatus, setSelectedToolStatus] = useState<string | null>(null);
  const [activeToolWorkspace, setActiveToolWorkspace] = useState<string | null>(null);

  const handleLaunch = (tool: ToolMetadata) => {
    setActiveToolWorkspace(tool.id);
    if (onLaunchTool) onLaunchTool(tool.id);
  };

  if (activeToolWorkspace === 'tool-garden') {
    return <GardenWorkspace tenantId={tenantId} userRole={userRole} onClose={() => setActiveToolWorkspace(null)} />;
  }

  if (activeToolWorkspace === 'tool-math-39') {
    return <MathWorkspace tenantId={tenantId} userRole={userRole} onClose={() => setActiveToolWorkspace(null)} />;
  }

  return (
    <div className="space-y-6" dir="rtl">
      {selectedToolStatus && (
        <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl text-xs text-indigo-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-indigo-400" /><span>{selectedToolStatus}</span>
        </div>
      )}
      <div>
        <h3 className="text-base font-bold text-slate-200 mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-emerald-400" /> ابزارهای فعال مدرسه شما:</h3>
        {licensed.length === 0 ? (
          <p className="text-xs text-slate-500">هیچ ابزاری فعال نیست.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {licensed.map((tool) => (
              <div key={tool.id} className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-emerald-400 text-sm">{tool.name}</h4>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">لایسنس معتبر</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{tool.description}</p>
                </div>
                <button onClick={() => handleLaunch(tool)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current" /> راه‌اندازی ابزار
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {unlicensed.length > 0 && (
        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2"><Lock className="w-4 h-4 text-slate-500" /> ماژول‌های قفل‌شده (نیاز به ارتقا):</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlicensed.map((tool) => (
              <div key={tool.id} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 opacity-75">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-400 text-sm">{tool.name}</h4>
                  <Lock className="w-4 h-4 text-amber-500/80" />
                </div>
                <p className="text-xs text-slate-500 mb-3">{tool.description}</p>
                <div className="text-[11px] text-amber-500/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">این ابزار خریداری نشده است.</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

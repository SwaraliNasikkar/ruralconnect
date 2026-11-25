import React, { useState } from 'react';
import { 
  Layers, 
  Server, 
  Cpu, 
  FolderTree, 
  Network, 
  Info, 
  CheckCircle, 
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { ThemeMode } from '../types';
import { umlArchitectureData } from '../data/mockData';
import { sounds } from '../utils/audio';

interface ArchitectureViewProps {
  themeMode: ThemeMode;
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ themeMode }) => {
  const isPrimary = themeMode === 'primary';
  const [activeDiagram, setActiveDiagram] = useState<'deployment' | 'package' | 'component' | 'composite'>('deployment');
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);

  const diagrams = [
    { id: 'deployment', label: '1. Deployment Diagram', icon: Server },
    { id: 'package', label: '2. Package Diagram', icon: FolderTree },
    { id: 'component', label: '3. Component Diagram', icon: Cpu },
    { id: 'composite', label: '4. Composite Structure', icon: Network },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-black tracking-tight ${
              isPrimary ? 'text-amber-950 font-outfit' : 'text-white'
            }`}
          >
            {isPrimary ? '🗺️ How RuralConnect Works Inside' : 'RuralConnect UML System Architecture'}
          </h1>
          <p
            className={`text-xs sm:text-sm font-medium ${
              isPrimary ? 'text-amber-800' : 'text-slate-400'
            }`}
          >
            Interactive explorer based on the complete RuralConnect architecture assignment context.
          </p>
        </div>

        {/* Diagram Selector Tabs */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-2xl overflow-x-auto max-w-full ${
            isPrimary ? 'bg-amber-100/80 border border-amber-200' : 'bg-slate-800/80 border border-slate-700'
          }`}
        >
          {diagrams.map((d) => {
            const Icon = d.icon;
            const isSelected = activeDiagram === d.id;
            return (
              <button
                key={d.id}
                onClick={() => {
                  sounds.playSubtleClick();
                  setActiveDiagram(d.id as 'deployment' | 'package' | 'component' | 'composite');
                  setSelectedNodeIndex(0);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  isSelected
                    ? isPrimary
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-teal-600 text-white shadow-xs'
                    : isPrimary
                    ? 'text-amber-900 hover:bg-amber-200/50'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Diagram Canvas & Details Split */}
      {activeDiagram === 'deployment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Visual Deployment Map (7 cols) */}
          <div
            className={`lg:col-span-7 rounded-3xl p-6 border-2 space-y-6 ${
              isPrimary
                ? 'border-amber-300 bg-white shadow-[0_5px_0_0_#d97706]'
                : 'border-slate-800 bg-[#0F172A] text-slate-100'
            }`}
          >
            <div className="border-b border-dashed border-amber-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
                UML 2.5 Deployment Nodes & Artifacts
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any runtime node to inspect its local cache and deployed artifacts.
              </p>
            </div>

            {/* Nodes Grid */}
            <div className="space-y-4">
              {umlArchitectureData.deployment.nodes.map((node, idx) => {
                const isSelected = selectedNodeIndex === idx;
                return (
                  <div
                    key={node.name}
                    onClick={() => {
                      sounds.playSubtleClick();
                      setSelectedNodeIndex(idx);
                    }}
                    className={`p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                      isSelected
                        ? isPrimary
                          ? 'border-amber-500 bg-amber-50/80 shadow-md scale-101'
                          : 'border-teal-400 bg-teal-950/40 shadow-md scale-101'
                        : isPrimary
                        ? 'border-amber-200 bg-white hover:bg-amber-50/40'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-500">
                          {node.type}
                        </span>
                        <span className="text-sm font-black">{node.name}</span>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-400">
                          Active Selection
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{node.description}</p>

                    {/* Artifacts badges */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {node.artifacts.map((art) => (
                        <span
                          key={art}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                        >
                          «artifact» {art}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Specification Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div
              className={`p-6 rounded-3xl border-2 space-y-4 ${
                isPrimary
                  ? 'border-amber-300 bg-amber-50/80 shadow-[0_4px_0_0_#d97706]'
                  : 'border-slate-800 bg-[#0F172A] text-slate-100'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
                <Info className="w-4 h-4" />
                <span>Node Specification Details</span>
              </div>

              {umlArchitectureData.deployment.nodes[selectedNodeIndex] && (
                <div className="space-y-3">
                  <div>
                    <div className="text-lg font-black">
                      {umlArchitectureData.deployment.nodes[selectedNodeIndex].name}
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      Stereotype: {umlArchitectureData.deployment.nodes[selectedNodeIndex].type}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {umlArchitectureData.deployment.nodes[selectedNodeIndex].description}
                  </p>

                  <div className="pt-2 border-t border-amber-200 dark:border-slate-800">
                    <span className="text-xs font-black uppercase text-slate-500 block mb-2">
                      Deployed Artifacts:
                    </span>
                    <ul className="space-y-1.5">
                      {umlArchitectureData.deployment.nodes[selectedNodeIndex].artifacts.map((a) => (
                        <li key={a} className="text-xs flex items-center gap-2 font-mono">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Offline Flow Note from Assignment */}
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                isPrimary
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                  : 'border-slate-800 bg-slate-900 text-slate-300'
              }`}
            >
              <div className="font-black mb-1">Assignment Sync Flow:</div>
              Student devices write quiz attempts to local IndexedDB storage. When entering the school perimeter, the background sync queue negotiates with the Rural School Hub without needing 4G/cellular internet.
            </div>
          </div>
        </div>
      )}

      {/* Package Diagram View */}
      {activeDiagram === 'package' && (
        <div
          className={`rounded-3xl p-6 sm:p-8 border-2 space-y-6 ${
            isPrimary
              ? 'border-amber-300 bg-white shadow-[0_5px_0_0_#d97706]'
              : 'border-slate-800 bg-[#0F172A] text-slate-100'
          }`}
        >
          <div>
            <h2 className="text-xl font-black">The 8 Logical Subsystem Packages</h2>
            <p className="text-xs text-slate-500">
              UML Package notation grouping model elements and high-cohesion functional modules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {umlArchitectureData.package.packages.map((pkg) => (
              <div
                key={pkg.name}
                className="p-4 rounded-2xl border border-amber-200 dark:border-slate-800 bg-amber-50/30 dark:bg-slate-900/40 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-amber-500 dark:text-teal-400" />
                  <span className="text-sm font-bold text-amber-950 dark:text-white">
                    {pkg.name}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {pkg.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Component Diagram View */}
      {activeDiagram === 'component' && (
        <div
          className={`rounded-3xl p-6 sm:p-8 border-2 space-y-6 ${
            isPrimary
              ? 'border-amber-300 bg-white shadow-[0_5px_0_0_#d97706]'
              : 'border-slate-800 bg-[#0F172A] text-slate-100'
          }`}
        >
          <div>
            <h2 className="text-xl font-black">Modular Software Components & Dependencies</h2>
            <p className="text-xs text-slate-500">
              Clean interfaces between the adaptive frontend clients, API Gateway, and backend microservices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {umlArchitectureData.component.components.map((c) => (
              <div
                key={c.name}
                className="p-4 rounded-2xl border border-amber-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{c.name}</span>
                  {c.interface && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-500 border border-teal-500/20">
                      {c.interface}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{c.role}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Composite Structure Diagram View */}
      {activeDiagram === 'composite' && (
        <div
          className={`rounded-3xl p-6 sm:p-8 border-2 space-y-6 ${
            isPrimary
              ? 'border-amber-300 bg-white shadow-[0_5px_0_0_#d97706]'
              : 'border-slate-800 bg-[#0F172A] text-slate-100'
          }`}
        >
          <div>
            <h2 className="text-xl font-black">
              Composite Structure: «RuralConnectPlatform»
            </h2>
            <p className="text-xs text-slate-500">
              Boundary enclosing internal structured parts with ports attached to the outer classifier.
            </p>
          </div>

          {/* Enclosed Platform Boundary Box */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-teal-500/50 bg-teal-950/10 space-y-6">
            {/* Attached External Ports */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-teal-400">Attached Boundary Ports:</span>
              {umlArchitectureData.compositeStructure.ports.map((p) => (
                <span
                  key={p}
                  className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-teal-600 text-white shadow-xs"
                >
                  [{p}]
                </span>
              ))}
            </div>

            {/* Internal Parts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {umlArchitectureData.compositeStructure.parts.map((part) => (
                <div
                  key={part.name}
                  className="p-3.5 rounded-xl border border-slate-700 bg-slate-900/80 text-center space-y-1"
                >
                  <div className="text-xs font-mono font-bold text-slate-200 truncate">
                    :{part.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Multiplicity: {part.multiplicity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

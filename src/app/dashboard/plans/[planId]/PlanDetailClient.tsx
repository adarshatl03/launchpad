"use client";

import { useState } from "react";
import { ProductBrief } from "@/components/wizard/ProductBrief";
import { Button } from "@/components/ui/Button";
import {
  History,
  RotateCcw,
  Save,
  ChevronRight,
  Clock,
  Download,
  Share2,
  FileText,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import {
  createSnapshot,
  restoreVersion,
  getPlanVersions,
} from "@/lib/actions/planActions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { generatePlanPDF } from "@/lib/utils/pdfExport";
import { generatePlanDOCX } from "@/lib/utils/docxExport";
import { FadeIn, ScaleIn } from "@/components/ui/Motion";
import { CommentSection } from "@/components/dashboard/comments/CommentSection";

export default function PlanDetailClient({
  plan: initialPlan,
  initialVersions,
  initialComments,
  currentUserId,
}: {
  plan: any;
  initialVersions: any[];
  initialComments: any[];
  currentUserId: string | null;
}) {
  const [plan, setPlan] = useState(initialPlan);
  const [versions, setVersions] = useState(initialVersions);
  const [showHistory, setShowHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleSaveVersion = async () => {
    const name = window.prompt(
      "Enter a name for this version (optional):",
      `Snapshot ${new Date().toLocaleDateString()}`,
    );
    if (name === null) return;

    setIsSaving(true);
    const res = await createSnapshot(plan.id, name);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Version snapshot saved!");
      const updatedVersions = await getPlanVersions(plan.id);
      setVersions(updatedVersions);
    }
    setIsSaving(false);
  };

  const handleRestore = async (version: any) => {
    if (
      !window.confirm(
        `Are you sure you want to restore "${version.name || "this version"}"? Current changes will be auto-saved as a snapshot.`,
      )
    ) {
      return;
    }

    const res = await restoreVersion(plan.id, version.id);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Plan restored successfully!");
      // Reload page state
      window.location.reload();
    }
  };

  const handleExportPDF = async () => {
    setIsExporting("pdf");
    try {
      generatePlanPDF({
        title: plan.title,
        inputs: plan.inputs,
        createdAt: plan.created_at,
      });
      toast.success("PDF exported!");
    } catch {
      toast.error("Export failed");
    }
    setIsExporting(null);
  };

  const handleExportDOCX = async () => {
    setIsExporting("docx");
    try {
      await generatePlanDOCX({
        title: plan.title,
        inputs: plan.inputs,
        createdAt: plan.created_at,
      });
      toast.success("DOCX exported!");
    } catch {
      toast.error("Export failed");
    }
    setIsExporting(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard/plans"
              className="inline-flex items-center text-sm text-neutral-500 hover:text-white mb-2 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Plans
            </Link>
            <h1 className="text-3xl font-bold text-white">{plan.title}</h1>
            <p className="text-neutral-400">
              View and manage your product strategy.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="border-neutral-800 text-neutral-400 hover:text-white"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="mr-2 h-4 w-4" />
              History
            </Button>
            <Button
              variant="outline"
              className="border-neutral-800 text-neutral-400 hover:text-white"
              onClick={handleSaveVersion}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Snapshot
            </Button>
            <div className="h-10 w-px bg-neutral-800 mx-1 hidden sm:block" />
            <Button
              variant="outline"
              className="border-neutral-800 text-neutral-400 hover:text-white"
              onClick={handleExportPDF}
              disabled={!!isExporting}
            >
              {isExporting === "pdf" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              className="border-neutral-800 text-neutral-400 hover:text-white"
              onClick={handleExportDOCX}
              disabled={!!isExporting}
            >
              {isExporting === "docx" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <ScaleIn>
          <ProductBrief data={plan.inputs} />
        </ScaleIn>

        <div className="pt-8 border-t border-neutral-800">
          <CommentSection
            planId={plan.id}
            initialComments={initialComments}
            currentUserId={currentUserId}
          />
        </div>
      </div>

      {/* History Sidebar */}
      {showHistory && (
        <FadeIn direction="left" className="w-full lg:w-80 shrink-0">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Version History
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-neutral-500 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {versions.length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-8 italic">
                  No versions saved yet.
                </p>
              ) : (
                versions.map((v) => (
                  <div
                    key={v.id}
                    className="group relative rounded-xl border border-neutral-800 bg-neutral-950 p-4 transition-all hover:border-neutral-700"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                        V{v.version_number}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {v.name || "Untitled Version"}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {new Date(v.created_at).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRestore(v)}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-800 py-2 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Restore
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-800">
              <p className="text-[10px] text-neutral-500 text-center tracking-tight">
                Snapshots capture all plan fields at a point in time.
              </p>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}

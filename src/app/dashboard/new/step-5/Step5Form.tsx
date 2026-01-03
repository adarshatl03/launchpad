"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  CheckCircle,
  Download,
  Share2,
  Loader2,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { finishPlan, createShareToken } from "@/lib/actions/planActions";
import { PlanInputs } from "@/types/plan";
import { generatePlanPDF } from "@/lib/utils/pdfExport";
import { generatePlanDOCX } from "@/lib/utils/docxExport";
import { ProductBrief } from "@/components/wizard/ProductBrief";
import { toast } from "sonner";
import { useState } from "react";

interface Step5FormProps {
  planId?: string;
  initialData?: PlanInputs;
  shareToken?: string;
}

export default function Step5Form({
  planId,
  initialData,
  shareToken: initialShareToken,
}: Step5FormProps) {
  const router = useRouter();

  const handleFinish = async () => {
    if (!planId) return;
    const result = await finishPlan(planId);
    if (result && "success" in result && result.success) {
      router.push("/dashboard");
    }
    return result;
  };

  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingDOCX, setIsExportingDOCX] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [currentShareToken, setCurrentShareToken] = useState(initialShareToken);

  const handleShare = async () => {
    if (!planId) return;

    // If we already have a token, just copy it
    if (currentShareToken) {
      const shareUrl = `${window.location.origin}/share/${currentShareToken}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard!");
      return;
    }

    setIsSharing(true);
    try {
      const result = await createShareToken(planId);
      if ("error" in result) {
        toast.error(result.error ?? "Error generating share link");
      } else {
        setCurrentShareToken(result.token);
        const shareUrl = `${window.location.origin}/share/${result.token}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link generated and copied!");
      }
    } catch (error) {
      toast.error("Failed to generate share link");
      console.error(error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleExportPDF = async () => {
    if (!initialData) return;
    setIsExportingPDF(true);

    try {
      generatePlanPDF({
        title:
          initialData.problemStatement?.slice(0, 50) + "..." || "Product Brief",
        inputs: initialData,
        createdAt: new Date().toISOString(),
      });
      toast.success("PDF exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF");
      console.error(error);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportDOCX = async () => {
    if (!initialData) return;
    setIsExportingDOCX(true);

    try {
      await generatePlanDOCX({
        title:
          initialData.problemStatement?.slice(0, 50) + "..." || "Product Brief",
        inputs: initialData,
        createdAt: new Date().toISOString(),
      });
      toast.success("DOCX exported successfully!");
    } catch (error) {
      toast.error("Failed to export DOCX");
      console.error(error);
    } finally {
      setIsExportingDOCX(false);
    }
  };

  const [_state, action, isPending] = useActionState(handleFinish, null);
  const backHref = planId
    ? `/dashboard/new/step-4?planId=${planId}`
    : "/dashboard/new/step-4";

  const data = initialData || {};

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Review & Export</h2>
        <p className="text-sm text-neutral-400">
          Your Product Brief is ready. Review your plan and export it.
        </p>
      </div>

      {/* Product Brief Paper UI */}
      <ProductBrief data={data} />

      <form
        action={action}
        className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-neutral-800"
      >
        <Button
          variant="ghost"
          asChild
          className="w-full sm:w-auto order-2 sm:order-1"
          type="button"
        >
          <Link href={backHref}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="flex gap-3 w-full sm:w-auto order-1 sm:order-2">
          <Button
            variant="outline"
            type="button"
            onClick={handleShare}
            disabled={isSharing}
            className="flex-1 sm:flex-none border-neutral-700 text-neutral-300 hover:text-white"
          >
            {isSharing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Share2 className="mr-2 h-4 w-4" />
            )}
            {currentShareToken ? "Copy Link" : "Share"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={handleExportPDF}
            disabled={isExportingPDF || isExportingDOCX}
            className="flex-1 sm:flex-none border-neutral-700 text-neutral-300 hover:text-white"
          >
            {isExportingPDF ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            PDF
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={handleExportDOCX}
            disabled={isExportingPDF || isExportingDOCX}
            className="flex-1 sm:flex-none border-neutral-700 text-neutral-300 hover:text-white"
          >
            {isExportingDOCX ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4 text-blue-400" />
            )}
            DOCX
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 sm:flex-none bg-green-600 text-white hover:bg-green-700 border-none"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Finish & Save
          </Button>
        </div>
      </form>
    </div>
  );
}

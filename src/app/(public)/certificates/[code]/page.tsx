import { verifyCertificate } from "@/lib/certificate-actions";
import { Sparkles, ShieldCheck, Globe, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/certificates/print-button";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

interface CertificatePageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function CertificateVerificationPage({
  params,
}: CertificatePageProps) {
  const { code } = await params;
  const result = await verifyCertificate(code);

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
          <Trophy className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-foreground mb-2">
            Invalid Certificate
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            The verification code{" "}
            <strong className="text-foreground">{code}</strong> could not be
            found or has been revoked by our registry.
          </p>
          <Button
            asChild
            className="w-full bg-primary text-white rounded-xl shadow-md"
          >
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const certificate = result.data;
  const formattedDate = format(new Date(certificate.issueDate), "MMMM d, yyyy");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 flex flex-col items-center justify-center">
      {/* Dynamic Header Actions - Hidden on Print */}
      <div className="w-full max-w-5xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-500 animate-pulse" />
          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">
            Verified Academy Achievement
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl font-bold flex items-center gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            asChild
          >
            <Link href="/dashboard">
              <Globe className="w-4 h-4" />
              My Portal
            </Link>
          </Button>
          <PrintButton />
        </div>
      </div>

      {/* Main Calligraphic Certificate Frame */}
      <div className="relative w-full max-w-5xl aspect-[1.414/1] bg-amber-50/20 dark:bg-slate-900 border-[16px] border-emerald-950 dark:border-slate-950 rounded-lg p-8 md:p-14 shadow-2xl relative flex flex-col justify-between overflow-hidden print:border-emerald-950 print:bg-white print:shadow-none print:my-0">
        {/* Calligraphic Corner Ornaments */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500/60 dark:border-amber-500/30" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500/60 dark:border-amber-500/30" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500/60 dark:border-amber-500/30" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500/60 dark:border-amber-500/30" />

        {/* Dynamic Background Watermarks */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/[0.02] via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-10 border border-amber-500/20 dark:border-amber-500/10 pointer-events-none rounded" />

        {/* Certificate Header */}
        <div className="text-center space-y-3.5 z-10">
          <div className="flex justify-center mb-1">
            <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
              <Trophy className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-amber-500 dark:text-amber-400 font-extrabold uppercase tracking-widest text-xs md:text-sm font-serif">
            Philosophical Academy for Geniuses
          </h2>
          <h1 className="text-4xl md:text-5xl font-black text-emerald-950 dark:text-slate-100 font-serif tracking-wide leading-none">
            Certificate of Completion
          </h1>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider pt-1.5">
            This credential is officially registered under verification code:{" "}
            {code}
          </p>
        </div>

        {/* Certificate Recipient Content */}
        <div className="text-center my-6 md:my-10 space-y-4 z-10">
          <p className="text-muted-foreground text-sm md:text-base font-serif italic">
            This is to officially recognize and certify that
          </p>
          <h3 className="text-3xl md:text-4xl font-extrabold text-foreground font-serif tracking-tight py-1 border-b border-amber-500/20 max-w-lg mx-auto leading-tight">
            {certificate.user.name}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base font-serif italic max-w-xl mx-auto leading-relaxed">
            has successfully completed all scientific research, critical
            discourse, and philosophical curriculum requirements for the academy
            course
          </p>
          <h4 className="text-xl md:text-2xl font-bold text-emerald-900 dark:text-indigo-400 font-serif leading-tight">
            {certificate.course.title}
          </h4>
        </div>

        {/* Certificate Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-4 md:mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 z-10">
          {/* Signatures */}
          <div className="text-center sm:text-left">
            <p className="font-serif italic text-foreground/80 text-sm md:text-base leading-none">
              Marcus Aurelius
            </p>
            <div className="h-0.5 w-32 bg-amber-500/30 my-1 mx-auto sm:mx-0" />
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">
              Dean of Philosophy & Science
            </p>
          </div>

          {/* Verification Gold Seal with Metallic Hover Effect */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 bg-gradient-to-tr from-amber-300 via-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-900 select-none relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Sparkles className="w-9 h-9 text-white animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -left-4 -right-4 text-center">
              <span className="bg-emerald-950 text-white dark:bg-slate-950 text-[8px] font-extrabold py-0.5 px-2 rounded-full border border-amber-500/40 uppercase tracking-widest">
                OFFICIAL SEAL
              </span>
            </div>
          </div>

          {/* Issue Date */}
          <div className="text-center sm:text-right">
            <p className="font-serif text-foreground/80 text-sm md:text-base leading-none">
              {formattedDate}
            </p>
            <div className="h-0.5 w-32 bg-amber-500/30 my-1 mx-auto sm:mx-0" />
            <p className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground">
              Platform Registry Issue Date
            </p>
          </div>
        </div>
      </div>

      {/* Verification footer detail */}
      <div className="mt-8 text-center text-xs text-muted-foreground/80 font-semibold tracking-wide max-w-md print:hidden">
        <p>
          This credential can be publicly verified at any time at
          your-domain.com/certificates/{code} using the cryptographic tracking
          registry.
        </p>
      </div>
    </div>
  );
}

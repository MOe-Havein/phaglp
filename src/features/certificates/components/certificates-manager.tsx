"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  ExternalLink,
  Award,
  UserPlus,
  ShieldAlert,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { issueCertificate, revokeCertificate } from "@/features/certificates/actions/certificate-actions";

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Course {
  id: string;
  title: string;
}

interface Certificate {
  id: string;
  certificateCode: string;
  grade: string;
  issueDate: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  course: {
    id: string;
    title: string;
  };
}

interface CertificatesManagerProps {
  users: User[];
  courses: Course[];
  initialCertificates: Certificate[];
}

export function CertificatesManager({
  users,
  courses,
  initialCertificates,
}: CertificatesManagerProps) {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [grade, setGrade] = useState("Completed with Distinction (A)");

  const [isIssuing, setIsIssuing] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  // Handle manual issuance
  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error("Please select a scholar");
      return;
    }
    if (!selectedCourseId) {
      toast.error("Please select a course");
      return;
    }

    setIsIssuing(true);
    try {
      const result = await issueCertificate(
        selectedUserId,
        selectedCourseId,
        grade,
      );
      if (result.success && result.certificateCode) {
        toast.success(
          `Certificate ${result.certificateCode} issued successfully!`,
        );
        // Reset form
        setSelectedUserId("");
        setSelectedCourseId("");
        setGrade("Completed with Distinction (A)");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to issue certificate");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsIssuing(false);
    }
  };

  // Handle certificate revocation
  const handleRevoke = async (id: string, code: string) => {
    if (
      !confirm(
        `Are you absolutely sure you want to revoke and delete certificate ${code}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setRevokingId(id);
    try {
      const result = await revokeCertificate(id);
      if (result.success) {
        toast.success(`Certificate ${code} has been successfully revoked.`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to revoke certificate");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-500 animate-pulse" />
            Scholar Certificates Manager
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manually issue, audit, and revoke calligraphic platform
            certifications.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Side: Issuance Console */}
        <Card className="lg:col-span-1 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm rounded-2xl h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Manual Issuance
            </CardTitle>
            <CardDescription>
              Directly award a calligraphic completion credential to a verified
              scholar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleIssue} className="space-y-5">
              {/* Select Scholar */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  1. Select Scholar
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-250 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 dark:text-gray-150"
                  required
                >
                  <option value="">-- Choose Scholar Account --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || "Unnamed"} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Course */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  2. Select Academy Course
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-255 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 dark:text-gray-150"
                  required
                >
                  <option value="">-- Choose Academic Course --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade / Distinction */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  3. Performance Grade / Note
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="E.g., Completed with Distinction (A)"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-255 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all text-gray-900 dark:text-gray-150"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isIssuing}
                className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-md transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 mt-4"
              >
                {isIssuing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Issuing Credential...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4.5 h-4.5" />
                    Issue Certificate
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Side: Certificates Table Audit */}
        <Card className="lg:col-span-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Registry Log & Audit Audit
            </CardTitle>
            <CardDescription>
              Audit all {initialCertificates.length} active certificates
              registered on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/40 border-b border-gray-250 dark:border-gray-700">
                    <th className="px-5 py-3 text-left font-bold text-gray-550 dark:text-gray-400 uppercase tracking-widest text-[9px]">
                      Scholar Recipient
                    </th>
                    <th className="px-5 py-3 text-left font-bold text-gray-550 dark:text-gray-400 uppercase tracking-widest text-[9px]">
                      Academy Course
                    </th>
                    <th className="px-5 py-3 text-left font-bold text-gray-550 dark:text-gray-400 uppercase tracking-widest text-[9px]">
                      Seal Code / Grade
                    </th>
                    <th className="px-5 py-3 text-right font-bold text-gray-550 dark:text-gray-400 uppercase tracking-widest text-[9px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {initialCertificates.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-20 text-center text-gray-400"
                      >
                        <Award className="w-12 h-12 mx-auto mb-3 opacity-25" />
                        <p className="font-bold text-sm">
                          No registered certificates found
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Issue a manual certificate above to start the
                          registry.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    initialCertificates.map((cert) => (
                      <tr
                        key={cert.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                      >
                        {/* Recipient */}
                        <td className="px-5 py-4">
                          <p className="font-bold text-gray-900 dark:text-white">
                            {cert.user.name || "Unnamed"}
                          </p>
                          <p className="text-xs text-gray-500 font-semibold">
                            {cert.user.email}
                          </p>
                        </td>

                        {/* Course */}
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                            {cert.course.title}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            Issued:{" "}
                            {new Date(cert.issueDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </td>

                        {/* Code & Grade */}
                        <td className="px-5 py-4">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs font-bold border-amber-500/25 bg-amber-500/[0.03] text-amber-600 dark:text-amber-400"
                          >
                            {cert.certificateCode}
                          </Badge>
                          <p className="text-xs text-gray-500 font-semibold mt-1 italic">
                            Grade: {cert.grade}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            {/* View link */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-500"
                              asChild
                              title="Verify Certificate in New Tab"
                            >
                              <a
                                href={`/certificates/${cert.certificateCode}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4.5 h-4.5" />
                              </a>
                            </Button>

                            {/* Revoke button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={revokingId === cert.id}
                              onClick={() =>
                                handleRevoke(cert.id, cert.certificateCode)
                              }
                              className="rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500"
                              title="Revoke Certificate"
                            >
                              {revokingId === cert.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4.5 h-4.5" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Search,
  RefreshCw,
  ExternalLink,
  GitBranch,
  GitCommit,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Ban,
  XCircle,
  Copy,
  Check,
  ChevronRight,
  SlidersHorizontal,
  Activity,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getVercelProjects,
  getVercelDeployments,
  type VercelProject,
  type VercelDeployment,
} from "@/actions/vercel";

export function DeploymentsDashboard() {
  const [projects, setProjects] = useState<VercelProject[]>([]);
  const [deployments, setDeployments] = useState<VercelDeployment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedTarget, setSelectedTarget] = useState<string>("all");
  const [limit, setLimit] = useState<number>(20);
  const [searchQuery, setSearchQuery] = useState("");

  // UI Detail Modal State
  const [selectedDeployment, setSelectedDeployment] =
    useState<VercelDeployment | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  // Fetch Projects and Deployments
  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        // 1. Fetch Projects
        const projectsRes = await getVercelProjects();
        if (projectsRes.success && projectsRes.projects) {
          setProjects(projectsRes.projects);

          // Find default project: "testa-phaglp2"
          const defaultProj = projectsRes.projects.find(
            (p) => p.name === "testa-phaglp2",
          );
          if (defaultProj && selectedProjectId === "all") {
            setSelectedProjectId(defaultProj.id);
          }
        }

        // 2. Fetch Deployments based on parameters
        const queryParams: {
          projectId?: string;
          state?: string;
          target?: string;
          limit?: number;
        } = { limit };

        if (selectedProjectId !== "all") {
          queryParams.projectId = selectedProjectId;
        }
        if (selectedState !== "all") {
          queryParams.state = selectedState;
        }
        if (selectedTarget !== "all") {
          queryParams.target = selectedTarget;
        }

        const deploymentsRes = await getVercelDeployments(queryParams);

        if (deploymentsRes.success) {
          setDeployments(deploymentsRes.deployments);
        } else {
          setError(deploymentsRes.error || "Failed to load deployments");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [selectedProjectId, selectedState, selectedTarget, limit],
  );

  useEffect(() => {
    fetchData();
  }, [selectedProjectId, selectedState, selectedTarget, limit, fetchData]);

  // Handle URL Copy
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
      setCopiedText("");
    }, 2000);
  };

  // Filter deployments in-memory for immediate query search responses
  const filteredDeployments = deployments.filter((d) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const commitMsg = d.meta?.githubCommitMessage?.toLowerCase() || "";
    const branch = d.meta?.githubCommitRef?.toLowerCase() || "";
    const author = d.meta?.githubCommitAuthorName?.toLowerCase() || "";
    const url = d.url.toLowerCase();
    const id = d.uid.toLowerCase();
    const name = d.name.toLowerCase();

    return (
      commitMsg.includes(query) ||
      branch.includes(query) ||
      author.includes(query) ||
      url.includes(query) ||
      id.includes(query) ||
      name.includes(query)
    );
  });

  // Helper: Status badge
  const getStatusBadge = (state: string) => {
    switch (state) {
      case "READY":
        return (
          <Badge className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Ready</span>
          </Badge>
        );
      case "BUILDING":
        return (
          <Badge className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1 w-fit animate-pulse">
            <Activity className="w-3.5 h-3.5 animate-spin" />
            <span>Building</span>
          </Badge>
        );
      case "ERROR":
        return (
          <Badge className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1 w-fit">
            <XCircle className="w-3.5 h-3.5" />
            <span>Error</span>
          </Badge>
        );
      case "CANCELED":
        return (
          <Badge className="bg-gray-500/10 hover:bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/20 flex items-center gap-1 w-fit">
            <Ban className="w-3.5 h-3.5" />
            <span>Canceled</span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1 w-fit">
            <Clock className="w-3.5 h-3.5" />
            <span>{state}</span>
          </Badge>
        );
    }
  };

  // Count stats
  const totalCount = deployments.length;
  const readyCount = deployments.filter((d) => d.state === "READY").length;
  const errorCount = deployments.filter((d) => d.state === "ERROR").length;
  const buildingCount = deployments.filter((d) =>
    ["BUILDING", "INITIALIZING", "QUEUED"].includes(d.state),
  ).length;

  return (
    <div className="space-y-6">
      {/* Header section with Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Rocket className="w-4 h-4 text-blue-500" />
            <span>Vercel Deployments Control</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Deployments
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitor and filter active production and preview deployments.
          </p>
        </div>
        <div>
          <Button
            onClick={() => fetchData(true)}
            disabled={isLoading || isRefreshing}
            variant="outline"
            className="flex items-center gap-2 shadow-sm"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Deployments aggregate statistics cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Fetch",
            value: totalCount,
            icon: Layers,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Ready",
            value: readyCount,
            icon: CheckCircle,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Errored",
            value: errorCount,
            icon: XCircle,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
          },
          {
            label: "Building",
            value: buildingCount,
            icon: Activity,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {isLoading ? (
                  <div className="w-8 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                ) : (
                  stat.value
                )}
              </h3>
            </div>
            <div className={`p-2.5 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filter and search controls panel */}
      <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/80 pb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <SlidersHorizontal className="w-4 h-4 text-blue-500" />
            <span>Filter Deployments</span>
          </div>
          {(selectedProjectId !== "all" ||
            selectedState !== "all" ||
            selectedTarget !== "all" ||
            searchQuery !== "") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedProjectId("all");
                setSelectedState("all");
                setSelectedTarget("all");
                setSearchQuery("");
              }}
              className="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Project select filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Vercel Project
            </label>
            <Select
              value={selectedProjectId}
              onValueChange={setSelectedProjectId}
            >
              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((proj) => (
                  <SelectItem key={proj.id} value={proj.id}>
                    {proj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* State select filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Status State
            </label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="READY">Ready</SelectItem>
                <SelectItem value="BUILDING">Building</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
                <SelectItem value="CANCELED">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Target / Target Environment select filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Target Environment
            </label>
            <Select value={selectedTarget} onValueChange={setSelectedTarget}>
              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800">
                <SelectValue placeholder="Select Target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Environments</SelectItem>
                <SelectItem value="production">Production Only</SelectItem>
                <SelectItem value="preview">Preview Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Limit select filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Max Results Limit
            </label>
            <Select
              value={String(limit)}
              onValueChange={(val) => setLimit(Number(val))}
            >
              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800">
                <SelectValue placeholder="Select Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 results</SelectItem>
                <SelectItem value="20">20 results</SelectItem>
                <SelectItem value="50">50 results</SelectItem>
                <SelectItem value="100">100 results</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Live Search Text Box */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deployments in-memory by commit message, url, SHA, branch, creator..."
            className="pl-9 bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 focus-visible:ring-blue-500"
          />
        </div>
      </div>

      {/* Deployment lists and detail modals */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Loading Error</h4>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-900/30 flex items-center justify-between"
            >
              <div className="space-y-2 flex-1">
                <div className="w-1/4 h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="w-1/2 h-4 bg-gray-100 dark:bg-gray-800/80 rounded animate-pulse" />
              </div>
              <div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      ) : filteredDeployments.length === 0 ? (
        <div className="py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900/20 flex flex-col items-center justify-center text-center">
          <Rocket className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white text-base">
            No deployments found
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            Try adjusting your filters or query string.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredDeployments.map((deployment) => {
              const commitMsg =
                deployment.meta?.githubCommitMessage || "Manual Deployment";
              const branch = deployment.meta?.githubCommitRef || "";
              const sha = deployment.meta?.githubCommitSha
                ? deployment.meta.githubCommitSha.substring(0, 7)
                : "";
              const author =
                deployment.meta?.githubCommitAuthorName ||
                deployment.creator?.username ||
                "Unknown";
              const createdDate = new Date(
                deployment.created || deployment.createdAt,
              ).toLocaleString();

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  key={deployment.uid}
                  onClick={() => setSelectedDeployment(deployment)}
                  className="p-5 rounded-xl border border-gray-200 dark:border-gray-800/80 bg-white dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors shadow-sm cursor-pointer group relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {deployment.name}
                      </span>
                      {deployment.target === "production" && (
                        <Badge className="bg-blue-500 text-white border-transparent text-[10px] py-0 px-2 font-bold uppercase tracking-wider">
                          Production
                        </Badge>
                      )}
                      {deployment.target !== "production" && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] py-0 px-2 font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300"
                        >
                          Preview
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400 font-mono">
                        {deployment.uid.substring(0, 12)}...
                      </span>
                    </div>

                    {/* Commit info or description */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium line-clamp-1">
                      {commitMsg}
                    </p>

                    {/* Meta info row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                      {branch && (
                        <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 py-0.5 px-2 rounded-md font-mono text-[11px]">
                          <GitBranch className="w-3 h-3 text-blue-500" />
                          {branch}
                        </span>
                      )}
                      {sha && (
                        <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 py-0.5 px-2 rounded-md font-mono text-[11px]">
                          <GitCommit className="w-3 h-3 text-blue-500" />
                          {sha}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        {author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {createdDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-800/80">
                    <div className="shrink-0">
                      {getStatusBadge(deployment.state)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {deployment.state === "READY" && (
                        <a
                          href={`https://${deployment.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:text-blue-500 dark:hover:text-blue-400 transition-colors shadow-xs"
                          title="Visit Deployed Url"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <div className="p-1.5 rounded-lg border border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-800 group-hover:bg-white dark:group-hover:bg-gray-900 transition-all text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Details dialog modal */}
      <Dialog
        open={selectedDeployment !== null}
        onOpenChange={(open) => !open && setSelectedDeployment(null)}
      >
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 max-h-[85vh] overflow-y-auto shadow-2xl rounded-2xl">
          <DialogTitle className="sr-only">Deployment Details</DialogTitle>
          <DialogDescription className="sr-only">
            Detailed view of the selected deployment.
          </DialogDescription>
          {selectedDeployment && (
            <>
              <DialogHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="flex items-center justify-between pr-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Deployment Details
                      </h2>
                      {getStatusBadge(selectedDeployment.state)}
                    </div>
                    <DialogDescription className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Full metadata response fetched from Vercel API.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-4 space-y-6">
                {/* Basic Deployment details grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-800/80">
                    <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Project Name
                    </span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                      {selectedDeployment.name}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-800/80">
                    <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Environment
                    </span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5 capitalize">
                      {selectedDeployment.target === "production"
                        ? "Production 🚀"
                        : "Preview 🧪"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-100 dark:border-gray-800/80 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Deployment Hostname URL
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleCopy(`https://${selectedDeployment.url}`)
                        }
                        className="h-6 px-2 text-xs text-blue-500"
                      >
                        {isCopied &&
                        copiedText === `https://${selectedDeployment.url}` ? (
                          <span className="flex items-center gap-1 text-emerald-500">
                            <Check className="w-3 h-3" /> Copied
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Copy className="w-3 h-3" /> Copy URL
                          </span>
                        )}
                      </Button>
                    </div>
                    <a
                      href={`https://${selectedDeployment.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1.5 mt-0.5 truncate"
                    >
                      {selectedDeployment.url}
                      <ExternalLink className="w-3.5 h-3.5 inline shrink-0" />
                    </a>
                  </div>
                </div>

                {/* Git Metadata Block */}
                {selectedDeployment.meta?.githubCommitRepo && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <GitBranch className="w-3.5 h-3.5 text-blue-500" />
                      <span>Git Reference Metadata</span>
                    </h4>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-850 space-y-3">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-semibold">
                          Repository
                        </span>
                        <p className="text-sm font-medium text-gray-850 dark:text-gray-300">
                          {selectedDeployment.meta.githubCommitOrg}/
                          {selectedDeployment.meta.githubCommitRepo}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-semibold">
                          Commit Message
                        </span>
                        <p className="text-sm font-medium text-gray-850 dark:text-gray-200 bg-white dark:bg-gray-900/60 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800 mt-0.5 leading-relaxed">
                          {selectedDeployment.meta.githubCommitMessage}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-semibold">
                            Branch
                          </span>
                          <span className="flex items-center gap-1 text-xs font-medium text-gray-800 dark:text-gray-300 mt-0.5">
                            <GitBranch className="w-3 h-3 text-blue-500" />
                            {selectedDeployment.meta.githubCommitRef}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-semibold">
                            Commit SHA
                          </span>
                          {selectedDeployment.meta.githubCommitSha ? (
                            <a
                              href={`https://github.com/${selectedDeployment.meta.githubCommitOrg}/${selectedDeployment.meta.githubCommitRepo}/commit/${selectedDeployment.meta.githubCommitSha}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs font-semibold text-blue-500 dark:text-blue-400 hover:underline mt-0.5 font-mono"
                            >
                              <GitCommit className="w-3 h-3 text-blue-500" />
                              {selectedDeployment.meta.githubCommitSha.substring(
                                0,
                                7,
                              )}
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-semibold">
                            Author
                          </span>
                          <span className="flex items-center gap-1 text-xs font-medium text-gray-850 dark:text-gray-300 mt-0.5">
                            <User className="w-3 h-3 text-gray-450" />
                            {selectedDeployment.meta.githubCommitAuthorName ||
                              "Unknown"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-semibold">
                            Deployment Trigger Actor
                          </span>
                          <span className="text-xs font-medium text-gray-850 dark:text-gray-300 mt-0.5 capitalize flex items-center gap-1">
                            <Activity className="w-3 h-3 text-blue-500" />
                            {selectedDeployment.meta.actor || "GitHub hook"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Technical Deployment Identifiers */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
                    <span>Technical Identifiers & Links</span>
                  </h4>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-xl border border-gray-150 dark:border-gray-850 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-450 font-medium">
                        Deployment UID:
                      </span>
                      <span className="font-mono font-semibold text-gray-800 dark:text-gray-300">
                        {selectedDeployment.uid}
                      </span>
                    </div>
                    {selectedDeployment.inspectorUrl && (
                      <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-2 mt-2">
                        <span className="text-gray-450 font-medium">
                          Vercel Inspector:
                        </span>
                        <a
                          href={selectedDeployment.inspectorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          View in Vercel Dashboard
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Collapsible raw JSON response */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Raw JSON Metadata Payload
                  </span>
                  <div className="p-4 bg-gray-900 dark:bg-black rounded-xl border border-gray-850 max-h-60 overflow-y-auto font-mono text-[11px] text-gray-300 leading-normal scrollbar-thin">
                    <pre>{JSON.stringify(selectedDeployment, null, 2)}</pre>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button
                  onClick={() => setSelectedDeployment(null)}
                  variant="outline"
                  className="rounded-xl"
                >
                  Close Details
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

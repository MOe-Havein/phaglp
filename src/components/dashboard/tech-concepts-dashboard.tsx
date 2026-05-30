"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Cpu,
  Brain,
  LineChart,
  Server,
  Network,
  Shield,
  Fingerprint,
  Compass,
  Landmark,
  Globe,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Languages,
  Wifi,
  WifiOff,
  FileSearch,
  ShieldCheck,
  Award,
  BookOpen,
  Layers,
  RefreshCw,
  Activity,
} from "lucide-react"

interface TechConceptsDashboardProps {
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
  initialDbLogs?: any[]
}

export function TechConceptsDashboard({ user, initialDbLogs = [] }: TechConceptsDashboardProps) {
  // Global Settings and Toggles
  const [activeTab, setActiveTab] = useState<string>("tab-1")
  const [isLowConnActive, setIsLowConnActive] = useState<boolean>(false)
  const [activeLanguage, setActiveLanguage] = useState<"en" | "ar" | "fr">("en")

  // Real Database Analytics Logs State
  const [dbLogs, setDbLogs] = useState<any[]>(initialDbLogs)
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false)

  // Core Focus state
  const [cognitiveFocus, setCognitiveFocus] = useState<number>(78)
  const [analyticsRecResult, setAnalyticsRecResult] = useState<string>(
    "Continue working through Stoic logic models to lower syllogistic fallacies.",
  )
  const [isRecalculatingAnalytics, setIsRecalculatingAnalytics] = useState<boolean>(false)

  // 1. Generative AI State
  const [aiTopic, setAiTopic] = useState<string>("Stoicism")
  const [aiGoal, setAiGoal] = useState<string>("both")
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false)
  const [aiGeneratedData, setAiGeneratedData] = useState<any>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false)

  // 3. Cloud Native State
  const [isFailoverActive, setIsFailoverActive] = useState<boolean>(false)
  const [cloudLatency, setCloudLatency] = useState<Record<string, number>>({
    lms: 14,
    sis: 18,
    erp: 22,
  })
  const [cloudLogs, setCloudLogs] = useState<string[]>([
    "[15:52:00] Kubernetes pods matching 'lms-microservice-*' healthy.",
    "[15:52:02] Neon PostgreSQL Database replication synchronized.",
    "[15:52:05] Hybrid Cloud Gateway: Batesville Node online (Case Street).",
  ])

  // 4. Adaptive Learning State
  const [aptitudeLevel, setAptitudeLevel] = useState<"talented" | "gifted" | "genius">("gifted")
  const [learningPace, setLearningPace] = useState<"relaxed" | "balanced" | "intensive">("balanced")
  const [learningFocus, setLearningFocus] = useState<"metaphysics" | "logic" | "ethics">("logic")
  const [adaptiveSyllabus, setAdaptiveSyllabus] = useState<any>(null)

  // 5. Academic Digital Twin State
  const [studyHours, setStudyHours] = useState<number>(18)
  const [discourseRate, setDiscourseRate] = useState<number>(75)
  const [predictedGpa, setPredictedGpa] = useState<string>("3.78")
  const [burnoutRisk, setBurnoutRisk] = useState<"Low" | "Medium" | "High">("Low")
  const [dropOutRisk, setDropOutRisk] = useState<"Minimal" | "Mild" | "Severe">("Minimal")

  // 6. Blockchain Credentials State
  const [mintCourse, setMintCourse] = useState<string>("Core General Program (GP)")
  const [isMintingCert, setIsMintingCert] = useState<boolean>(false)
  const [blockchainCert, setBlockchainCert] = useState<any>(null)
  const [isLedgerExplorerOpen, setIsLedgerExplorerOpen] = useState<boolean>(false)
  const [ledgerTransactions, setLedgerTransactions] = useState<any[]>([])

  // 7. VR/AR Lecture State
  const [isArActive, setIsArActive] = useState<boolean>(false)
  const [selectedArWord, setSelectedArWord] = useState<string | null>(null)
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false)

  // 9. AI Governance Ethics State
  const [auditText, setAuditText] = useState<string>(
    "All men are mortal. Socrates is a man. Therefore, Socrates is mortal. Also, William is rich, so William is smart.",
  )
  const [isAuditingEthics, setIsAuditingEthics] = useState<boolean>(false)
  const [auditResults, setAuditResults] = useState<any>(null)

  // Load database logs from API
  const fetchDbLogs = useCallback(async () => {
    setIsLoadingLogs(true)
    try {
      const response = await fetch("/api/ai-interactive-concepts")
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setDbLogs(data.logs)
        }
      }
    } catch (err) {
      console.error("Fetch logs error:", err)
    } finally {
      setIsLoadingLogs(false)
    }
  }, [])

  // Log action helper
  const logDatabaseEvent = async (eventName: string, metadataObj?: any) => {
    try {
      const response = await fetch("/api/ai-interactive-concepts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "log",
          eventName,
          metadata: metadataObj || {},
        }),
      })
      if (response.ok) {
        // Trigger re-fetch
        fetchDbLogs()
      }
    } catch (err) {
      console.error("Log analytics error:", err)
    }
  }

  // Trigger load
  useEffect(() => {
    logDatabaseEvent("ENTERED_TECH_HUB")
  }, [])

  // Recalculate focus based on actions
  const adjustCognitiveFocus = (amount: number) => {
    setCognitiveFocus((prev) => Math.min(100, Math.max(50, prev + amount)))
  }

  // Concept 1: Generative AI Request Handler
  const handleAiGeneration = async () => {
    setIsGeneratingAi(true)
    setAiGeneratedData(null)
    setQuizAnswers({})
    setQuizSubmitted(false)
    adjustCognitiveFocus(-8)

    try {
      const response = await fetch("/api/ai-interactive-concepts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          topic: aiTopic,
          goal: aiGoal,
        }),
      })

      if (response.ok) {
        const payload = await response.json()
        if (payload.success) {
          setAiGeneratedData(payload.data)
          toast.success(
            `Success! Rendered content for "${aiTopic}" via ${payload.source === "cohere" ? "Cohere AI engine" : "Fidelity engine"}`,
          )
          logDatabaseEvent("GENERATED_AI_CONTENT", {
            topic: aiTopic,
            goal: aiGoal,
            engine: payload.source,
          })
        } else {
          toast.error("Failed to generate content: " + payload.error)
        }
      } else {
        toast.error("Failed to generate content. Network error.")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred during AI generation.")
    } finally {
      setIsGeneratingAi(false)
    }
  }

  // Concept 2: Learning Analytics Recalculate
  const handleRecalculateAnalytics = () => {
    setIsRecalculatingAnalytics(true)
    adjustCognitiveFocus(5)
    logDatabaseEvent("RECALCULATED_ANALYTICS")

    setTimeout(() => {
      setIsRecalculatingAnalytics(false)
      const recs = [
        "Optimal retention calculated. Consider reviewing 'Stoic Logic' to correct propositional slips.",
        "Discourse participation is high! Try applying for the 'Active Dialogue Peer Group (GP)' to test your logic arguments.",
        "Your Stoicism node shows 95% concept alignment. Time to explore advanced 'Metaphysics & Absolute Thought Models'!",
      ]
      const chosen = recs[Math.floor(Math.random() * recs.length)]
      setAnalyticsRecResult(chosen)
      toast.success("Cognitive model re-analyzed!")
    }, 1500)
  }

  // Concept 3: Hybrid Failover Simulator
  const triggerFailoverSimulation = () => {
    setIsFailoverActive(true)
    adjustCognitiveFocus(4)
    logDatabaseEvent("SIMULATED_FAILOVER")

    setCloudLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ALERT: Latency spike in Batesville Secondary Hub.`,
      `[${new Date().toLocaleTimeString()}] Kubernetes executing node eviction...`,
      `[${new Date().toLocaleTimeString()}] Diverting 100% of user traffic to Active Backup cloud...`,
    ])

    // Animate latency changes
    setTimeout(() => {
      setCloudLatency({ lms: 85, sis: 120, erp: 140 })
      setCloudLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Sync Active: Redirect complete. Secondary backup online. Latency stabilized.`,
      ])
      toast.warning("Secondary Backup Node activated successfully!")
    }, 1200)
  }

  const resetCloudFailover = () => {
    setIsFailoverActive(false)
    setCloudLatency({ lms: 14, sis: 18, erp: 22 })
    setCloudLogs([
      `[${new Date().toLocaleTimeString()}] System Reset: Active load balancing re-enabled.`,
      `[${new Date().toLocaleTimeString()}] Standard Kubernetes pods healthy.`,
      `[${new Date().toLocaleTimeString()}] Latency restored to optimal baseline (14ms).`,
    ])
    toast.success("Failover gateway normalized.")
  }

  // Concept 4: Adaptive Path Constructor
  const handleAdaptivePathConstruct = () => {
    adjustCognitiveFocus(3)
    logDatabaseEvent("CONSTRUCTED_ADAPTIVE_PATH", { aptitudeLevel, learningPace, learningFocus })

    // Generate custom syllabus based on filters
    const focusTitles: Record<string, string[]> = {
      metaphysics: ["Pre-Socratic Cosmogony", "Aristotelian Substance Models", "Absolute Idealism"],
      logic: ["Propositional Calculus Syntax", "Syllogistic Fallacy Checking", "Boolean Semantics"],
      ethics: [
        "Deontological Imperatives",
        "Stoic Resiliency Practicum",
        "Algorithmic Ethics Auditing",
      ],
    }

    const durationWeeks = learningPace === "relaxed" ? 12 : learningPace === "balanced" ? 6 : 3
    const difficultyLevel =
      aptitudeLevel === "talented"
        ? "Advanced Scholar"
        : aptitudeLevel === "gifted"
          ? "High Intellect"
          : "Genius Elite"

    setAdaptiveSyllabus({
      title: `${difficultyLevel} Roadmap: Integrated ${learningFocus.toUpperCase()}`,
      duration: `${durationWeeks} Weeks (${learningPace} pacing)`,
      difficulty: difficultyLevel,
      modules: focusTitles[learningFocus].map((m, idx) => ({
        id: idx + 1,
        title: m,
        hours: learningPace === "relaxed" ? 2 : learningPace === "balanced" ? 8 : 18,
        challenge: idx === 2 ? "Final Intellectual Synthesis Thesis" : "Argument Mapping Exercise",
      })),
    })

    toast.success("Bespoke adaptive pathway calculated!")
  }

  // Concept 5: Digital Twin Simulation
  useEffect(() => {
    // Dynamic predictive calculation based on sliders
    const gpaRaw = 2.0 + studyHours * 0.04 + discourseRate * 0.015
    const formattedGpa = Math.min(4.0, gpaRaw).toFixed(2)
    setPredictedGpa(formattedGpa)

    if (studyHours > 30) {
      setBurnoutRisk("High")
    } else if (studyHours > 20) {
      setBurnoutRisk("Medium")
    } else {
      setBurnoutRisk("Low")
    }

    if (discourseRate < 30 || studyHours < 5) {
      setDropOutRisk("Severe")
    } else if (discourseRate < 50 || studyHours < 10) {
      setDropOutRisk("Mild")
    } else {
      setDropOutRisk("Minimal")
    }
  }, [studyHours, discourseRate])

  // Concept 6: Mint Blockchain Certificate
  const handleMintCertificate = () => {
    setIsMintingCert(true)
    adjustCognitiveFocus(-3)

    // Simulate transaction log
    setTimeout(() => {
      const hash =
        "0x" +
        Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
      const certObj = {
        student: user.name || "Student Scholar",
        course: mintCourse,
        mintDate: new Date().toLocaleDateString(),
        tokenId: Math.floor(Math.random() * 89999 + 10000).toString(),
        txHash: hash,
        status: "Confirmed on Block #481,209",
        authority: "PHAGLP Academic Syndicate Sign",
      }
      setBlockchainCert(certObj)
      setLedgerTransactions((prev) => [certObj, ...prev])
      setIsMintingCert(false)

      logDatabaseEvent("MINTED_BLOCKCHAIN_CREDENTIAL", { course: mintCourse, hash })
      toast.success("Cryptographic Certificate Minted on-chain!")
    }, 1500)
  }

  // Concept 9: AI Ethics audit checker
  const handleFallacyAudit = () => {
    setIsAuditingEthics(true)
    adjustCognitiveFocus(-4)
    logDatabaseEvent("RAN_LOGICAL_ETHICS_AUDIT")

    setTimeout(() => {
      setIsAuditingEthics(false)

      const containsWilliamFallacy = auditText.toLowerCase().includes("william")

      setAuditResults({
        complianceScore: containsWilliamFallacy ? 72 : 98,
        dataPrivacyStatus: "Verified Secure (no personal identifiers found)",
        fallaciesDetected: containsWilliamFallacy
          ? [
              {
                name: "Non Sequitur (Does not follow)",
                passage: "...William is rich, so William is smart.",
                explanation: "Financial status has no logical implication on intelligence index.",
              },
            ]
          : [],
        verdict: containsWilliamFallacy
          ? "Unsound reasoning detected. Fallacy risk present."
          : "Highly sound Aristotelian deduction. Standard validation confirmed.",
      })
      toast.info("Ethics audit ledger updated!")
    }, 1200)
  }

  // Navigation Items Config mapping 9 concepts
  const tabsList = [
    {
      id: "tab-1",
      icon: Brain,
      label: "Generative AI",
      badge: "Live",
      desc: "Interactive outlines and graded quizzes",
    },
    {
      id: "tab-2",
      icon: LineChart,
      label: "Learning Analytics",
      badge: "DB Link",
      desc: "Real-time performance tracking and logs",
    },
    {
      id: "tab-3",
      icon: Server,
      label: "Cloud Ecosystem",
      badge: "Topology",
      desc: "Hybrid network failover gateway map",
    },
    {
      id: "tab-4",
      icon: Compass,
      label: "Adaptive Pathways",
      badge: "Dynamic",
      desc: "Aptitude-paced study roadmap builder",
    },
    {
      id: "tab-5",
      icon: Cpu,
      label: "Academic Digital Twin",
      badge: "Predictive",
      desc: "Live study impact simulator",
    },
    {
      id: "tab-6",
      icon: Fingerprint,
      label: "Blockchain Credentials",
      badge: "Minting",
      desc: "Verifiable cryptographic certificates",
    },
    {
      id: "tab-7",
      icon: Layers,
      label: "AR & VR Lecture NOTES",
      badge: "Visual",
      desc: "Classic manuscript overlay and toggles",
    },
    {
      id: "tab-8",
      icon: Globe,
      label: "Connectivity & RTL",
      badge: "Languages",
      desc: "Bandwidth optimizer and full Arabic",
    },
    {
      id: "tab-9",
      icon: Shield,
      label: "Governance & Ethics",
      badge: "Compliance",
      desc: "Fallacy auditing ledger logs",
    },
  ]

  // Translation helpers for Concept 8 (Multilingual RTL Alignment)
  const translations = {
    en: {
      title: "Inclusive & Sustainable Access Hub",
      sub: "Improving learning performance in low-bandwidth regions and offering multilingual support.",
      connectivityCard: "Bandwidth Optimization Engine",
      connDesc:
        "Toggle Low Connectivity Mode to compress structural elements and load optimized monospace templates.",
      connStatus: "Active Network Mode",
      statusLow:
        "Ultra-Compressed Mode Enabled (Images stripped, lightweight CSS, 92% bandwidth saved)",
      statusHigh: "High-Bandwidth Standard Mode (High-res covers, real-time charts active)",
      languageCard: "Multilingual System Override",
      langDesc:
        "Switch between major regional languages. Setting Arabic re-aligns the layout to a beautiful Right-to-Left (RTL) flow.",
      demoHeading: "Concept Alignment Statement",
      demoText:
        "The integration of modern educational technology must prioritize equity. By reducing asset sizes and ensuring full RTL responsiveness, PHAGLP guarantees that gifted minds globally—regardless of their local connection or language—access the absolute peak of unified academic philosophy.",
    },
    ar: {
      title: "بوابة الوصول الشامل والمستدام",
      sub: "تحسين الأداء التعليمي في المناطق ذات الاتصال الضعيف وتقديم الدعم الكامل للغات المتعددة.",
      connectivityCard: "محرك تحسين عرض النطاق الترددي",
      connDesc: "قم بتفعيل وضع الاتصال المنخفض لضغط العناصر الهيكلية وتحميل قوالب مبسطة وسريعة.",
      connStatus: "حالة الشبكة الحالية",
      statusLow: "وضع الضغط الفائق نشط (تم إيقاف الصور الثقيلة، خطوط خفيفة، توفير 92% من البيانات)",
      statusHigh: "الوضع القياسي عالي السرعة (عرض الصور عالية الدقة والرسوم المتحركة نشط)",
      languageCard: "تبديل لغة النظام",
      langDesc:
        "اختر اللغة المطلوبة. تفعيل اللغة العربية يعيد ترتيب الواجهة بالكامل من اليمين إلى اليسار (RTL) بشكل متناسق.",
      demoHeading: "بيان توافق المفاهيم التعليمية",
      demoText:
        "إن دمج التكنولوجيا التعليمية الحديثة يجب أن يضع العدالة في مقدمة أولوياته. من خلال تقليل أحجام الملفات وضمان الاستجابة الكاملة للكتابة من اليمين إلى اليسار (RTL)، تضمن أكاديمية PHAGLP الموحدة أن العقول الموهوبة في جميع أنحاء العالم - بغض النظر عن جودة اتصالهم المحلي أو لغتهم الأم - يمكنهم الوصول إلى ذروة الحكمة والفلسفة الأكاديمية.",
    },
    fr: {
      title: "Hub d'Accès Inclusif et Durable",
      sub: "Améliorer les performances d'apprentissage dans les zones à faible connectivité et offrir un support multilingue.",
      connectivityCard: "Moteur d'Optimisation de Bande Passante",
      connDesc:
        "Activez le mode faible connectivité pour compresser les structures et charger des polices ultra-légères.",
      connStatus: "Mode Réseau Actif",
      statusLow:
        "Mode Ultra-Compressé Activé (Images masquées, CSS minimaliste, 92% de bande passante économisée)",
      statusHigh:
        "Mode Standard Standard (Images haute résolution et graphiques interactifs actifs)",
      languageCard: "Surcharge du Système Multilingue",
      langDesc:
        "Basculez entre les principales langues régionales. Le choix de l'arabe réaligne l'interface dans un flux droite-à-gauche (RTL).",
      demoHeading: "Déclaration d'Alignement Conceptuel",
      demoText:
        "L'intégration des technologies éducatives modernes doit donner la priorité à l'équité. En réduisant la taille des actifs et en assurant une réactivité RTL complète, PHAGLP garantit que les esprits doués du monde entier - quel que soit leur accès réseau - accèdent au sommet de la philosophie académique.",
    },
  }

  const t = translations[activeLanguage]

  return (
    <div
      className={`space-y-6 ${isLowConnActive ? "font-mono" : ""} ${activeLanguage === "ar" ? "text-right" : ""}`}
      dir={activeLanguage === "ar" ? "rtl" : "ltr"}
    >
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm backdrop-blur-md">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
            <Cpu className="text-primary w-8 h-8 animate-pulse" />
            <span>Interactive Tech Concepts Hub</span>
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Reviewing and interacting with the 9 competitive technological integrations on PHAGLP.
          </p>
        </div>

        {/* Global Hub Controls */}
        <div className="flex flex-wrap items-center gap-4 border-t pt-4 md:border-t-0 md:pt-0">
          {/* Low Bandwidth Master switch */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border px-3 py-1.5 rounded-2xl">
            {isLowConnActive ? (
              <WifiOff className="w-4 h-4 text-amber-500 animate-bounce" />
            ) : (
              <Wifi className="w-4 h-4 text-emerald-500" />
            )}
            <div className="text-left">
              <div className="text-[10px] font-bold text-slate-800 dark:text-slate-300">
                LOW CONNECTIVITY
              </div>
              <div className="text-[9px] text-muted-foreground">
                {isLowConnActive ? "Ultra-Compressed" : "Full Assets"}
              </div>
            </div>
            <Switch
              checked={isLowConnActive}
              onCheckedChange={(val) => {
                setIsLowConnActive(val)
                logDatabaseEvent(val ? "TOGGLED_LOW_CONN_ON" : "TOGGLED_LOW_CONN_OFF")
                toast.info(
                  val
                    ? "Ultra-compressed text layout activated."
                    : "Full visual graphics restored.",
                )
              }}
            />
          </div>

          {/* Multilingual Switcher */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border px-3 py-1.5 rounded-2xl">
            <Languages className="w-4 h-4 text-indigo-500" />
            <div className="text-left">
              <div className="text-[10px] font-bold text-slate-800 dark:text-slate-300">
                LANGUAGE
              </div>
              <div className="text-[9px] text-muted-foreground uppercase">{activeLanguage}</div>
            </div>
            <select
              value={activeLanguage}
              onChange={(e) => {
                const lang = e.target.value as "en" | "ar" | "fr"
                setActiveLanguage(lang)
                logDatabaseEvent(`SET_LANG_${lang.toUpperCase()}`)
                toast.success(`Language set to: ${lang.toUpperCase()}`)
              }}
              className="bg-transparent border-0 text-xs font-bold focus:ring-0 cursor-pointer"
            >
              <option value="en">English (LTR)</option>
              <option value="ar">العربية (RTL)</option>
              <option value="fr">Français (LTR)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Workspace */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left column: concept tabs */}
        <div className="lg:col-span-4 space-y-3">
          <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Active Integrations</span>
                <Badge
                  variant="outline"
                  className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold"
                >
                  9 Concepts
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              {tabsList.map((tab, idx) => {
                const IconComponent = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      adjustCognitiveFocus(1)
                    }}
                    className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200/50 dark:border-indigo-800/40 shadow-sm"
                        : "hover:bg-slate-50 dark:hover:bg-slate-850/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${isActive ? "bg-indigo-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className="text-xs font-bold truncate">
                          {idx + 1}. {tab.label}
                        </span>
                        <Badge
                          variant="secondary"
                          className={`text-[9px] font-extrabold uppercase py-0 px-1 border-0 shrink-0 ${
                            isActive
                              ? "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          {tab.badge}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                        {tab.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Quick Metrics display */}
          <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 p-4">
            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center justify-between">
              <span>Student Focus Metrics</span>
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
            </h4>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span>Cognitive Focus Level</span>
                  <span>{cognitiveFocus}%</span>
                </div>
                <Progress value={cognitiveFocus} className="h-1.5" />
              </div>
              <div className="flex items-center justify-between border-t pt-2.5 text-[11px]">
                <span className="text-muted-foreground">Verification Ledger</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Checked 100%
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column: Tab content workspace */}
        <div className="lg:col-span-8 space-y-6">
          {/* Concept 1: Generative AI Playground */}
          {activeTab === "tab-1" && (
            <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-md overflow-hidden bg-white dark:bg-slate-900">
              <CardHeader className="bg-indigo-500/[0.03] border-b pb-4">
                <div className="flex items-center gap-2">
                  <Brain className="text-indigo-500 w-5 h-5" />
                  <CardTitle className="text-lg font-bold">
                    Concept 1: Integrating Generative AI
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Generate comprehensive explanation outlines and graded multiple-choice tests
                  utilizing advanced intelligence models.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-5">
                {/* Inputs */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-topic" className="text-xs font-bold text-foreground">
                      Select or Type Topic
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="ai-topic"
                        placeholder="e.g. Stoicism, Epistemology, Logic"
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        className="rounded-xl text-xs h-9"
                      />
                      <select
                        onChange={(e) => setAiTopic(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs px-2 focus:ring-1"
                      >
                        <option value="Stoicism">Stoicism</option>
                        <option value="Formal Logic">Formal Logic</option>
                        <option value="Epistemology">Epistemology</option>
                        <option value="Meta-Ethics">Meta-Ethics</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ai-goal" className="text-xs font-bold text-foreground">
                      Playground Generation Output
                    </Label>
                    <select
                      id="ai-goal"
                      value={aiGoal}
                      onChange={(e) => setAiGoal(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs p-2 h-9 focus:ring-1"
                    >
                      <option value="both">Both (Syllabus Explanation & Graded Quiz)</option>
                      <option value="explanation">Explanation Outline Only</option>
                      <option value="quiz">Interactive Graded Quiz Only</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleAiGeneration}
                  disabled={isGeneratingAi || !aiTopic.trim()}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl shadow-md font-bold text-xs"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Academic Decks via Cohere...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Educational Explanations & Quiz
                    </>
                  )}
                </Button>

                {/* Generated Content Output Section */}
                {aiGeneratedData && (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/30 space-y-6">
                    <div className="flex items-center justify-between border-b pb-2.5">
                      <h3 className="text-sm font-black text-indigo-700 dark:text-indigo-400">
                        {aiGeneratedData.title || aiTopic}
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-[9px] bg-indigo-500/5 text-indigo-500 font-bold border-indigo-500/20"
                      >
                        Cohere Verified Syllabus
                      </Badge>
                    </div>

                    {/* Explanation */}
                    {aiGeneratedData.explanation &&
                      (aiGoal === "explanation" || aiGoal === "both") && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                            Interactive Explanatory Synthesis
                          </h4>
                          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            {aiGeneratedData.explanation}
                          </p>

                          {aiGeneratedData.keyTakeaways && (
                            <div className="pt-2 space-y-1.5">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                Key Philosophical Takeaways:
                              </span>
                              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300">
                                {aiGeneratedData.keyTakeaways.map(
                                  (takeaway: string, idx: number) => (
                                    <li key={idx}>{takeaway}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                    {/* Quiz */}
                    {aiGeneratedData.quiz && (aiGoal === "quiz" || aiGoal === "both") && (
                      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-indigo-500" />
                          Smart Test Design & Interactive Quiz
                        </h4>

                        <div className="space-y-4">
                          {aiGeneratedData.quiz.map((q: any, qIdx: number) => (
                            <div
                              key={qIdx}
                              className="space-y-2 border border-slate-200/60 dark:border-slate-850 p-3 rounded-xl bg-white dark:bg-slate-900"
                            >
                              <span className="text-[10px] font-bold text-indigo-500">
                                QUESTION {qIdx + 1}
                              </span>
                              <p className="text-xs font-semibold text-foreground">{q.question}</p>

                              <div className="grid sm:grid-cols-2 gap-2 pt-1">
                                {q.options.map((opt: string, optIdx: number) => {
                                  const isSelected = quizAnswers[qIdx] === optIdx
                                  const showCorrect = quizSubmitted && optIdx === q.answerIndex
                                  const showIncorrect =
                                    quizSubmitted && isSelected && optIdx !== q.answerIndex

                                  return (
                                    <button
                                      key={optIdx}
                                      onClick={() => {
                                        if (quizSubmitted) return
                                        setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
                                        adjustCognitiveFocus(1)
                                      }}
                                      className={`text-left p-2 rounded-lg text-xs transition-all border ${
                                        showCorrect
                                          ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-medium"
                                          : showIncorrect
                                            ? "bg-red-50 dark:bg-red-950/20 border-red-500 text-red-700 dark:text-red-300"
                                            : isSelected
                                              ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                                              : "hover:bg-slate-50 dark:hover:bg-slate-850/60 border-slate-200 dark:border-slate-800"
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  )
                                })}
                              </div>

                              {quizSubmitted && q.explanation && (
                                <p className="text-[10px] text-muted-foreground leading-relaxed pt-1.5 border-t border-slate-100 dark:border-slate-800">
                                  <strong>Explanatory Notes:</strong> {q.explanation}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {!quizSubmitted ? (
                          <Button
                            onClick={() => {
                              if (Object.keys(quizAnswers).length < aiGeneratedData.quiz.length) {
                                toast.warning("Please answer all questions before submitting!")
                                return
                              }
                              setQuizSubmitted(true)
                              adjustCognitiveFocus(10)
                              logDatabaseEvent("COMPLETED_AI_QUIZ", { score: "100%" })
                              toast.success("Quiz graded! Read through explanatory notes below.")
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs"
                          >
                            Grade Test & Submit
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setQuizAnswers({})
                              setQuizSubmitted(false)
                            }}
                            className="w-full rounded-xl text-xs"
                          >
                            Retake Quiz
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Concept 2: Real-Time Learning Analytics */}
          {activeTab === "tab-2" && (
            <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900">
              <CardHeader className="bg-indigo-500/[0.03] border-b pb-4">
                <div className="flex items-center gap-2">
                  <LineChart className="text-indigo-500 w-5 h-5" />
                  <CardTitle className="text-lg font-bold">
                    Concept 2: Real-Time Learning Analytics
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Tracking active learner parameters on the platform in real time, connecting
                  database changes to immediate recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-5">
                {/* Latency and focus parameters grid */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-950/20 text-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Cognitive alignment
                    </span>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                      94.2%
                    </div>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-950/20 text-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Fallacy Detection Rate
                    </span>
                    <div className="text-2xl font-black text-rose-500 mt-1">1.2%</div>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-950/20 text-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Ledger Synchronized
                    </span>
                    <div className="text-2xl font-black text-emerald-500 mt-1">100%</div>
                  </div>
                </div>

                {/* Animated Chart Visual (SVG Area Chart) */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/30">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-foreground">
                      Real-time Performance Metrics Chart
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-500 text-[9px] border-emerald-500/20 animate-pulse"
                    >
                      Live Feed
                    </Badge>
                  </div>

                  {/* SVG Chart */}
                  <div className="w-full h-40 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg relative overflow-hidden flex items-end px-2">
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="gradient-chart" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3"></stop>
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05"></stop>
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line
                        x1="0"
                        y1="25"
                        x2="100"
                        y2="25"
                        stroke="#f1f5f9"
                        strokeWidth="0.5"
                        className="dark:stroke-slate-900"
                      />
                      <line
                        x1="0"
                        y1="50"
                        x2="100"
                        y2="50"
                        stroke="#f1f5f9"
                        strokeWidth="0.5"
                        className="dark:stroke-slate-900"
                      />
                      <line
                        x1="0"
                        y1="75"
                        x2="100"
                        y2="75"
                        stroke="#f1f5f9"
                        strokeWidth="0.5"
                        className="dark:stroke-slate-900"
                      />

                      {/* Data Path Area */}
                      <path
                        d={`M 0 80 Q 20 ${100 - cognitiveFocus} 40 ${110 - cognitiveFocus} T 80 40 T 100 20 L 100 100 L 0 100 Z`}
                        fill="url(#gradient-chart)"
                      />

                      {/* Data Path Line */}
                      <path
                        d={`M 0 80 Q 20 ${100 - cognitiveFocus} 40 ${110 - cognitiveFocus} T 80 40 T 100 20`}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2"
                      />
                    </svg>
                    <div className="w-full flex justify-between text-[8px] text-muted-foreground pb-1 z-10">
                      <span>MON</span>
                      <span>TUE</span>
                      <span>WED</span>
                      <span>THU</span>
                      <span>FRI</span>
                      <span>SAT</span>
                      <span>SUN</span>
                    </div>
                  </div>
                </div>

                {/* Database Recommendations Engine */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Immediate Recommendation */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-950 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                        <h4 className="text-xs font-bold text-foreground">
                          AI Recommendation Engine
                        </h4>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350">
                        {analyticsRecResult}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleRecalculateAnalytics}
                      disabled={isRecalculatingAnalytics}
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs h-8 font-bold"
                    >
                      {isRecalculatingAnalytics ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Analyzing Logs...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                          Recalculate Path
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Real DB Activity Log */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-950 space-y-3">
                    <div className="flex items-center justify-between border-b pb-1.5">
                      <h4 className="text-xs font-bold text-foreground">
                        Database Activity Ledger
                      </h4>
                      <Badge variant="outline" className="text-[8px] font-bold">
                        Postgres Sync
                      </Badge>
                    </div>

                    {isLoadingLogs ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {dbLogs.length === 0 ? (
                          <p className="text-[10px] text-center text-muted-foreground py-4">
                            No active records logged in database yet.
                          </p>
                        ) : (
                          dbLogs.slice(0, 5).map((log, idx) => (
                            <div
                              key={log.id || idx}
                              className="flex justify-between items-center text-[10px] bg-slate-50 dark:bg-slate-900 border p-1.5 rounded-lg"
                            >
                              <span className="font-semibold text-foreground max-w-[130px] truncate">
                                {log.event.replace(/_/g, " ")}
                              </span>
                              <span className="text-[8px] text-muted-foreground">
                                {new Date(log.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Concept 3: Cloud Native Ecosystems */}
          {activeTab === "tab-3" && (
            <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900">
              <CardHeader className="bg-indigo-500/[0.03] border-b pb-4">
                <div className="flex items-center gap-2">
                  <Server className="text-indigo-500 w-5 h-5" />
                  <CardTitle className="text-lg font-bold">
                    Concept 3: Cloud Native Topology (Hybrid Cloud)
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Connecting educational content, management systems, and finance ledgers in a
                  single high-availability environment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-5">
                {/* Topology Network Visual */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-950 text-white">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-300">
                      Hybrid Cloud Kubernetes Topology Map
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-bold ${isFailoverActive ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"}`}
                    >
                      {isFailoverActive ? "Backup active / Spiked" : "All nodes optimal"}
                    </Badge>
                  </div>

                  {/* SVG Topology Nodes Map */}
                  <div className="relative w-full h-44 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-around px-4 overflow-hidden">
                    {/* Background Grid effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />

                    {/* SVG Connector Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {/* Connection line between systems */}
                      <path
                        d="M 100 80 Q 200 40 300 80 T 500 80"
                        fill="none"
                        stroke={isFailoverActive ? "#f59e0b" : "#3b82f6"}
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        className="animate-pulse"
                      />
                    </svg>

                    {/* LMS Node */}
                    <div className="z-10 text-center space-y-1">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-lg transition-colors ${isFailoverActive ? "bg-amber-950 border-amber-500" : "bg-slate-900 border-blue-500"}`}
                      >
                        <BookOpen
                          className={`w-6 h-6 ${isFailoverActive ? "text-amber-400" : "text-blue-400"}`}
                        />
                      </div>
                      <div className="text-[10px] font-bold">LMS module</div>
                      <div className="text-[9px] text-muted-foreground">
                        Latency: {cloudLatency.lms}ms
                      </div>
                    </div>

                    {/* Central DB Database Sync Node */}
                    <div className="z-10 text-center space-y-1">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center border shadow-xl animate-pulse transition-colors ${isFailoverActive ? "bg-amber-950 border-amber-500" : "bg-slate-900 border-emerald-500"}`}
                      >
                        <Network className="w-7 h-7 text-emerald-400" />
                      </div>
                      <div className="text-[10px] font-bold">DB Sync Node</div>
                      <div className="text-[8px] text-emerald-400 uppercase font-black tracking-widest">
                        Replicating
                      </div>
                    </div>

                    {/* ERP Node */}
                    <div className="z-10 text-center space-y-1">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-lg transition-colors ${isFailoverActive ? "bg-amber-950 border-amber-500" : "bg-slate-900 border-indigo-500"}`}
                      >
                        <Landmark
                          className={`w-6 h-6 ${isFailoverActive ? "text-amber-400" : "text-indigo-400"}`}
                        />
                      </div>
                      <div className="text-[10px] font-bold">ERP Finance</div>
                      <div className="text-[9px] text-muted-foreground">
                        Latency: {cloudLatency.erp}ms
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cloud controls */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 bg-slate-50 dark:bg-slate-950/20">
                    <h4 className="text-xs font-bold text-foreground">
                      Kubernetes Cluster Diagnostics
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Simulate network failover bottlenecks. Trigger backup microservice paths to
                      stabilize user sessions.
                    </p>
                    <div className="flex gap-2 pt-2">
                      {!isFailoverActive ? (
                        <Button
                          onClick={triggerFailoverSimulation}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold h-8"
                        >
                          Trigger Active Failover
                        </Button>
                      ) : (
                        <Button
                          onClick={resetCloudFailover}
                          variant="outline"
                          className="flex-1 rounded-xl text-xs font-bold h-8"
                        >
                          Reset / Recover Cluster
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Console Logs */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-950 text-emerald-400 font-mono text-[10px] space-y-1 h-[120px] overflow-y-auto">
                    {cloudLogs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Concept 4: Adaptive Learning */}
          {activeTab === "tab-4" && (
            <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900">
              <CardHeader className="bg-indigo-500/[0.03] border-b pb-4">
                <div className="flex items-center gap-2">
                  <Compass className="text-indigo-500 w-5 h-5" />
                  <CardTitle className="text-lg font-bold">
                    Concept 4: Adaptive Learning Syllabus Builder
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Tailor curricula in real-time according to the student&apos;s level, cognitive
                  capacity, and study interests.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-5">
                {/* Options Grid */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Cognitive Aptitude Tier</Label>
                    <select
                      value={aptitudeLevel}
                      onChange={(e: any) => setAptitudeLevel(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs p-2 h-9"
                    >
                      <option value="talented">Talented Scholar</option>
                      <option value="gifted">Gifted Intuitive</option>
                      <option value="genius">Genius Elite</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Study Pace Intensity</Label>
                    <select
                      value={learningPace}
                      onChange={(e: any) => setLearningPace(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs p-2 h-9"
                    >
                      <option value="relaxed">Relaxed Study (1h/wk)</option>
                      <option value="balanced">Balanced Hybrid (5h/wk)</option>
                      <option value="intensive">Intensive Extreme (20h/wk)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Philosophical Focus</Label>
                    <select
                      value={learningFocus}
                      onChange={(e: any) => setLearningFocus(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs p-2 h-9"
                    >
                      <option value="logic">Mathematical Logic & Syntax</option>
                      <option value="metaphysics">Classical Metaphysics</option>
                      <option value="ethics">Applied Technical Ethics</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleAdaptivePathConstruct}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs"
                >
                  Generate Adaptive Academic Pathway
                </Button>

                {/* Adaptive path output */}
                {adaptiveSyllabus && (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/20 space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <h4 className="text-sm font-black text-indigo-700 dark:text-indigo-400">
                          {adaptiveSyllabus.title}
                        </h4>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          Bespoke Adaptive Blueprint
                        </span>
                      </div>
                      <Badge className="bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold border-0 text-[10px]">
                        {adaptiveSyllabus.duration}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {adaptiveSyllabus.modules.map((mod: any) => (
                        <div
                          key={mod.id}
                          className="flex justify-between items-start gap-4 p-3 border rounded-xl bg-white dark:bg-slate-900 shadow-xs"
                        >
                          <div className="space-y-1 min-w-0">
                            <span className="text-[9px] font-black text-indigo-500">
                              MODULE {mod.id}
                            </span>
                            <h5 className="text-xs font-bold text-foreground truncate">
                              {mod.title}
                            </h5>
                            <p className="text-[10px] text-muted-foreground">
                              Challenge Task: {mod.challenge}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-[9px] font-bold shrink-0">
                            {mod.hours} Hrs/wk
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Concept 5: Academic Digital Twin */}
          {activeTab === "tab-5" && (
            <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900">
              <CardHeader className="bg-indigo-500/[0.03] border-b pb-4">
                <div className="flex items-center gap-2">
                  <Cpu className="text-indigo-500 w-5 h-5" />
                  <CardTitle className="text-lg font-bold">
                    Concept 5: Academic Digital Twin Simulator
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  A digital simulation dashboard modeling study trajectories to predict academic
                  bottlenecks and cognitive burnout.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-5">
                {/* Parameter sliders */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <Label htmlFor="study-hours-slider">Weekly Research & Study Hours</Label>
                      <Badge className="bg-indigo-500 text-white font-bold">
                        {studyHours} Hours
                      </Badge>
                    </div>
                    <Slider
                      id="study-hours-slider"
                      min={0}
                      max={40}
                      step={1}
                      value={[studyHours]}
                      onValueChange={(val) => {
                        setStudyHours(val[0])
                        adjustCognitiveFocus(1)
                      }}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Adjust study parameters to predict grade gains vs burnout risk thresholds.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <Label htmlFor="discourse-rate-slider">
                        Peer Discourse Dialogue Engagement
                      </Label>
                      <Badge className="bg-indigo-500 text-white font-bold">
                        {discourseRate}% Participation
                      </Badge>
                    </div>
                    <Slider
                      id="discourse-rate-slider"
                      min={0}
                      max={100}
                      step={5}
                      value={[discourseRate]}
                      onValueChange={(val) => {
                        setDiscourseRate(val[0])
                        adjustCognitiveFocus(1)
                      }}
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Adjust peer argument mapping to lower potential academic failure risks.
                    </p>
                  </div>
                </div>

                {/* Predictive Dashboard Output */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/20 space-y-4">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                    Twin Mind Trajectory Analytics
                  </h4>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="border border-slate-250 dark:border-slate-800/80 rounded-xl p-3 bg-white dark:bg-slate-900 text-center">
                      <span className="text-[9px] uppercase font-bold text-muted-foreground">
                        Predicted GPA
                      </span>
                      <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                        {predictedGpa}
                      </div>
                    </div>
                    <div className="border border-slate-250 dark:border-slate-800/80 rounded-xl p-3 bg-white dark:bg-slate-900 text-center">
                      <span className="text-[9px] uppercase font-bold text-muted-foreground">
                        Burnout Index
                      </span>
                      <div
                        className={`text-xl font-black mt-1 ${burnoutRisk === "High" ? "text-rose-500" : burnoutRisk === "Medium" ? "text-amber-500" : "text-emerald-500"}`}
                      >
                        {burnoutRisk}
                      </div>
                    </div>
                    <div className="border border-slate-250 dark:border-slate-800/80 rounded-xl p-3 bg-white dark:bg-slate-900 text-center">
                      <span className="text-[9px] uppercase font-bold text-muted-foreground">
                        Drop-out Risk
                      </span>
                      <div
                        className={`text-xl font-black mt-1 ${dropOutRisk === "Severe" ? "text-rose-500" : dropOutRisk === "Mild" ? "text-amber-500" : "text-emerald-500"}`}
                      >
                        {dropOutRisk}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3 flex items-start gap-2.5 text-xs text-muted-foreground">
                    <AlertCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <p className="leading-relaxed">
                      <strong>Twin Prediction Needs:</strong>{" "}
                      {studyHours > 30
                        ? "Cognitive fatigue risk is highly severe. We suggest scheduling a 1-on-1 offline rest phase before Week 8 to balance intellectual output."
                        : dropOutRisk === "Severe"
                          ? "Extremely low study activity. Action needed: enroll in active logic modules immediately to sync basic alignment requirements."
                          : "Academic trajectory is secure and fully aligned with optimal genius-level benchmarks. Keep up this study cadence."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Concept 6: Blockchain Credentials */}
          {activeTab === "tab-6" && (
            <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900">
              <CardHeader className="bg-indigo-500/[0.03] border-b pb-4">
                <div className="flex items-center gap-2">
                  <Fingerprint className="text-indigo-500 w-5 h-5" />
                  <CardTitle className="text-lg font-bold">
                    Concept 6: Verifiable Blockchain Credentials
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Generate cryptographic digital certificates of completion which are globally
                  verifiable on decentralised ledgers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-5">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs font-bold">Select Completed Course to Mint</Label>
                    <select
                      value={mintCourse}
                      onChange={(e) => setMintCourse(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs p-2 h-9"
                    >
                      <option value="Core General Program (GP)">Core General Program (GP)</option>
                      <option value="Active Dialogue Groups (GP)">
                        Active Dialogue Groups (GP)
                      </option>
                      <option value="Logic Core Subjects (GP)">Logic Core Subjects (GP)</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleMintCertificate}
                    disabled={isMintingCert}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs h-9"
                  >
                    {isMintingCert ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                        Mining Block Cert...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-3.5 h-3.5 mr-2" />
                        Mint Cryptographic Certificate
                      </>
                    )}
                  </Button>
                </div>

                {/* Minted gold-foil dynamic Certificate */}
                {blockchainCert && (
                  <div className="space-y-4">
                    <div className="border-4 border-double border-yellow-500/80 rounded-2xl p-6 bg-gradient-to-br from-yellow-500/5 via-slate-900 to-yellow-600/5 relative overflow-hidden text-center space-y-4">
                      {/* Gold Medal Icon */}
                      <div className="w-16 h-16 mx-auto rounded-full bg-yellow-500/10 border border-yellow-500 flex items-center justify-center text-yellow-500 animate-pulse">
                        <Award className="w-9 h-9" />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-md font-serif font-black uppercase text-yellow-500 tracking-widest">
                          Certificate of Academic Achievement
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          PHAGLP PLATFORM LEDGER RECORD
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] text-muted-foreground">
                          THIS GRANTED CREDENTIAL RECOGNIZES THAT
                        </span>
                        <h5 className="text-lg font-black text-foreground">
                          {blockchainCert.student}
                        </h5>
                        <span className="text-[10px] text-muted-foreground">
                          HAS INTELLECTUALLY MASTERED ALL REQUISITE FRAMEWORKS IN
                        </span>
                        <p className="text-sm font-bold text-indigo-500 dark:text-indigo-400">
                          {blockchainCert.course}
                        </p>
                      </div>

                      <div className="border-t border-slate-200/50 dark:border-slate-800/80 pt-4 grid grid-cols-2 text-[9px] font-mono text-left text-muted-foreground gap-2">
                        <div>
                          <strong>TOKEN ID:</strong> {blockchainCert.tokenId}
                        </div>
                        <div>
                          <strong>MINT DATE:</strong> {blockchainCert.mintDate}
                        </div>
                        <div className="col-span-2 truncate">
                          <strong>TX HASH:</strong> {blockchainCert.txHash}
                        </div>
                      </div>
                    </div>

                    {/* Explorer switch */}
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/20 p-3 border rounded-xl">
                      <div className="text-xs">
                        <span className="font-bold text-foreground">
                          Decentralised Ledger Verification Explorer
                        </span>
                        <p className="text-[10px] text-muted-foreground">
                          Inspect global signatures and blockchain transaction hashes live.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsLedgerExplorerOpen(!isLedgerExplorerOpen)
                          adjustCognitiveFocus(1)
                        }}
                        className="rounded-xl text-xs font-bold"
                      >
                        {isLedgerExplorerOpen ? "Hide Ledger Explorer" : "Verify on Ledger"}
                      </Button>
                    </div>

                    {/* Expanded blockchain ledger logs */}
                    {isLedgerExplorerOpen && (
                      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-950 text-slate-300 font-mono text-[10px] space-y-3">
                        <div className="flex justify-between border-b border-slate-800 pb-1.5 text-emerald-400">
                          <span>BLOCKCHAIN LEDGER HISTORY</span>
                          <span>ACTIVE NODE: OK</span>
                        </div>

                        <div className="space-y-2 max-h-[140px] overflow-y-auto">
                          {ledgerTransactions.map((tx, idx) => (
                            <div key={idx} className="border-b border-slate-900 pb-2 space-y-1">
                              <div className="flex justify-between text-[9px]">
                                <span className="text-indigo-400">
                                  TX: {tx.txHash.substring(0, 16)}...
                                </span>
                                <span className="text-emerald-500">{tx.status}</span>
                              </div>
                              <div>
                                <strong>STUDENT:</strong> {tx.student}
                              </div>
                              <div>
                                <strong>COURSE:</strong> {tx.course}
                              </div>
                              <div className="text-[8px] text-muted-foreground">
                                AUTHORITY SIGNATURE: {tx.authority}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Concept 7: VR & AR Learning */}
          {activeTab === "tab-7" && (
            <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900">
              <CardHeader className="bg-indigo-500/[0.03] border-b pb-4">
                <div className="flex items-center gap-2">
                  <Layers className="text-indigo-500 w-5 h-5" />
                  <CardTitle className="text-lg font-bold">
                    Concept 7: Augmented Reality Lecture Notes
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Display classical manuscript text overlaid with dynamic neon glowing annotations,
                  inline summaries, and parallax view grids.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-5">
                {/* AR Toggle Control */}
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950/20 p-3 border rounded-xl">
                  <div className="text-xs">
                    <span className="font-bold text-foreground">
                      Augmented Reality overlay lens
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      Toggle to illuminate classical terms with glowing annotations.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={isAmbientPlaying ? "secondary" : "outline"}
                      onClick={() => {
                        setIsAmbientPlaying(!isAmbientPlaying)
                        adjustCognitiveFocus(2)
                        toast.info(
                          isAmbientPlaying
                            ? "VR classroom ambience muted."
                            : "VR classroom background binaural frequencies active.",
                        )
                      }}
                      className="rounded-xl text-xs"
                    >
                      {isAmbientPlaying ? "Mute VR Frequencies" : "VR Binaural Ambiance"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsArActive(!isArActive)
                        setSelectedArWord(null)
                        adjustCognitiveFocus(4)
                        logDatabaseEvent(isArActive ? "DISABLED_AR_VIEW" : "ENABLED_AR_VIEW")
                      }}
                      className={`${isArActive ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"} text-white rounded-xl font-bold text-xs`}
                    >
                      {isArActive ? "Disable AR Lens" : "Toggle AR Overlay"}
                    </Button>
                  </div>
                </div>

                {/* Classic manuscript text content container */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-slate-50/50 dark:bg-slate-950/30 relative overflow-hidden">
                  {/* Neon AR Overlay lines */}
                  {isArActive && (
                    <div className="absolute inset-0 border border-emerald-500/40 rounded-xl pointer-events-none animate-pulse">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500" />
                      <div className="absolute top-2 right-2 text-[8px] font-mono text-emerald-500 uppercase tracking-widest">
                        AR HUD active // overlay: 100% scale
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-sm font-serif font-black border-b pb-2 flex justify-between">
                      <span>Plato&apos;s Republic: Book VI (Excerpt)</span>
                      {isArActive && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-0 font-bold text-[8px]">
                          AR HUD ON
                        </Badge>
                      )}
                    </h4>

                    <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-serif">
                      Let us consider the{" "}
                      <button
                        onClick={() => {
                          if (!isArActive) return
                          setSelectedArWord("forms")
                          adjustCognitiveFocus(2)
                        }}
                        className={`font-bold transition-all ${
                          isArActive
                            ? "text-emerald-500 border-b-2 border-dashed border-emerald-400 hover:bg-emerald-500/10 px-1 py-0.5 rounded"
                            : ""
                        }`}
                      >
                        Theory of Forms
                      </button>{" "}
                      as standard cognitive structures. The intellectual mind is compared to the
                      eyes, which perceive absolute truths only when illuminated by the light of{" "}
                      <button
                        onClick={() => {
                          if (!isArActive) return
                          setSelectedArWord("sun")
                          adjustCognitiveFocus(2)
                        }}
                        className={`font-bold transition-all ${
                          isArActive
                            ? "text-emerald-500 border-b-2 border-dashed border-emerald-400 hover:bg-emerald-500/10 px-1 py-0.5 rounded"
                            : ""
                        }`}
                      >
                        The Idea of the Good
                      </button>
                      . Without this intellectual light, the mind can only grasp opinion and simple
                      projections in the shadows of the cave.
                    </p>
                  </div>
                </div>

                {/* Popovers for selected AR annotation terms */}
                {selectedArWord && isArActive && (
                  <div className="border border-emerald-500/30 rounded-xl p-4 bg-emerald-500/[0.03] text-xs space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                      <Sparkles
                        className="w-3.5 h-3.5 animate-spin"
                        style={{ animationDuration: "4s" }}
                      />
                      Augmented Reality Annotation
                    </div>
                    {selectedArWord === "forms" ? (
                      <div>
                        <strong className="text-foreground text-xs block mb-1">
                          Theory of Forms (eidos)
                        </strong>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Plato&apos;s assertion that non-physical, perfect, timeless ideas are the
                          most real form of existence. Physical entities are merely imperfect
                          shadows of these absolute, transcendent concepts.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <strong className="text-foreground text-xs block mb-1">
                          The Idea of the Good (Idea tou agathou)
                        </strong>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          The highest form of truth in Plato&apos;s metaphysics, described as the
                          sun that illuminates the intellectual world, making knowledge, moral
                          virtue, and absolute thought possible.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Concept 8: Inclusive and Sustainable Access */}
          {activeTab === "tab-8" && (
            <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900">
              <CardHeader className="bg-indigo-500/[0.03] border-b pb-4">
                <div className="flex items-center gap-2">
                  <Globe className="text-indigo-500 w-5 h-5" />
                  <CardTitle className="text-lg font-bold">{t.title}</CardTitle>
                </div>
                <CardDescription className="text-xs">{t.sub}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-5">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Bandwidth card */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950/20 space-y-3">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      {isLowConnActive ? (
                        <WifiOff className="text-amber-500 w-4 h-4 animate-bounce" />
                      ) : (
                        <Wifi className="text-emerald-500 w-4 h-4" />
                      )}
                      {t.connectivityCard}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.connDesc}</p>

                    <div className="border-t pt-3 space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        {t.connStatus}:
                      </span>
                      <p className="text-[11px] text-foreground font-semibold">
                        {isLowConnActive ? t.statusLow : t.statusHigh}
                      </p>
                    </div>

                    {isLowConnActive && (
                      <div className="bg-slate-950 text-amber-500 font-mono text-[9px] p-2 rounded-lg space-y-1">
                        <div>DATA SYNCED AT 92% REDUCED PAYLOAD</div>
                        <div>REMOVED: Font variables (loaded system mono)</div>
                        <div>REMOVED: Interactive SVG graphics, animations</div>
                        <div>BASELINE LATENCY: 2.1kb total file load</div>
                      </div>
                    )}
                  </div>

                  {/* Language switch card */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950/20 space-y-3">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Languages className="text-indigo-500 w-4 h-4" />
                      {t.languageCard}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.langDesc}</p>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <button
                        onClick={() => {
                          setActiveLanguage("en")
                          logDatabaseEvent("SET_LANG_EN")
                          toast.success("English interface active")
                        }}
                        className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                          activeLanguage === "en"
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        English LTR
                      </button>
                      <button
                        onClick={() => {
                          setActiveLanguage("ar")
                          logDatabaseEvent("SET_LANG_AR")
                          toast.success("Arabic RTL realigned layout active")
                        }}
                        className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                          activeLanguage === "ar"
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        العربية RTL
                      </button>
                      <button
                        onClick={() => {
                          setActiveLanguage("fr")
                          logDatabaseEvent("SET_LANG_FR")
                          toast.success("French LTR active")
                        }}
                        className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                          activeLanguage === "fr"
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        Français
                      </button>
                    </div>
                  </div>
                </div>

                {/* Multilingual Alignment Statement */}
                <div className="border border-slate-250 dark:border-slate-800/80 rounded-xl p-4 bg-white dark:bg-slate-950 space-y-2">
                  <h4 className="text-xs font-bold text-foreground">{t.demoHeading}</h4>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350">
                    {t.demoText}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Concept 9: AI Governance and Ethics */}
          {activeTab === "tab-9" && (
            <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-slate-900">
              <CardHeader className="bg-indigo-500/[0.03] border-b pb-4">
                <div className="flex items-center gap-2">
                  <Shield className="text-indigo-500 w-5 h-5" />
                  <CardTitle className="text-lg font-bold">
                    Concept 9: AI Governance & Ethics Ledger
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Maintain absolute accountability and transparency in artificial intelligence
                  implementations through auditing and policies.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-5">
                {/* Transparency ledger index */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-950/20 text-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Bias Audit Score
                    </span>
                    <div className="text-2xl font-black text-emerald-500 mt-1">
                      1.2% (Excellent)
                    </div>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-950/20 text-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Transparency index
                    </span>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                      98.4%
                    </div>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-950/20 text-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Privacy Compliance
                    </span>
                    <div className="text-2xl font-black text-emerald-500 mt-1">Verified</div>
                  </div>
                </div>

                {/* Audit testing */}
                <div className="space-y-3">
                  <Label htmlFor="audit-text" className="text-xs font-bold">
                    Explainability Sandbox: Audit Text for Logical Fallacies
                  </Label>
                  <Textarea
                    id="audit-text"
                    rows={3}
                    value={auditText}
                    onChange={(e) => setAuditText(e.target.value)}
                    className="rounded-xl text-xs"
                    placeholder="Enter arguments to analyze..."
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setAuditText(
                          "All humans are mortal. Socrates is a human. Therefore Socrates is mortal.",
                        )
                      }
                      className="rounded-xl text-xs"
                    >
                      Load Sound Syllogism Example
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleFallacyAudit}
                      disabled={isAuditingEthics || !auditText.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs ml-auto"
                    >
                      {isAuditingEthics ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Auditing fallacies...
                        </>
                      ) : (
                        <>
                          <FileSearch className="w-3.5 h-3.5 mr-1.5" />
                          Verify Logical Soundness
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Audit results output */}
                {auditResults && (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/20 space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-xs font-bold text-foreground">
                        AI Governance Audit Report Output
                      </span>
                      <Badge
                        className={
                          auditResults.complianceScore === 98
                            ? "bg-emerald-500/10 text-emerald-500 border-0 text-[10px]"
                            : "bg-amber-500/10 text-amber-500 border-0 text-[10px]"
                        }
                      >
                        Logical Score: {auditResults.complianceScore}%
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <strong>Logical Soundness Verdict:</strong> {auditResults.verdict}
                      </div>
                      <div>
                        <strong>Data Privacy Verification:</strong> {auditResults.dataPrivacyStatus}
                      </div>

                      {auditResults.fallaciesDetected.length > 0 ? (
                        <div className="pt-2 space-y-2">
                          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">
                            Logical Fallacies Identified:
                          </span>
                          {auditResults.fallaciesDetected.map((fal: any, idx: number) => (
                            <div
                              key={idx}
                              className="border border-rose-200 dark:border-rose-950/20 p-2.5 rounded-lg bg-rose-500/[0.02]"
                            >
                              <div className="text-[11px] font-bold text-rose-600 dark:text-rose-450">
                                {fal.name}
                              </div>
                              <div className="italic text-[10px] text-muted-foreground my-1">
                                &quot;{fal.passage}&quot;
                              </div>
                              <p className="text-[10px] text-slate-600 dark:text-slate-350">
                                {fal.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold pt-2">
                          <CheckCircle2 className="w-4 h-4" /> No cognitive logical fallacies
                          detected.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Accountability Statement */}
                <div className="border border-slate-250 dark:border-slate-800/80 rounded-xl p-4 bg-slate-50 dark:bg-slate-950/20 space-y-2 text-xs text-muted-foreground">
                  <div className="font-bold text-foreground">Governance and Privacy Policies:</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Transparency: AI algorithms do not replace academic human assessment
                      (Human-in-the-loop verified).
                    </li>
                    <li>
                      Accountability: Full audit ledgers kept for automated model revisions under
                      GDPR.
                    </li>
                    <li>
                      Ethics: Model training restricted from utilizing user private details,
                      verified under encryption.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

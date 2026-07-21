import type { ThemeDashboardData } from "../types";

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-[var(--outline-variant,#c3c6d6)] bg-white p-5 shadow-sm">
    <h2 className="text-lg font-semibold text-[var(--primary,#0056D2)]">{title}</h2>
    <div className="mt-3 space-y-3 text-sm text-[var(--on-surface-variant,#424654)]">{children}</div>
  </div>
);

const Badge = ({ status }: { status: string }) => (
  <span className="rounded-full border border-black/10 bg-[var(--surface-container,#ebeef6)] px-2 py-0.5 text-xs">
    {status}
  </span>
);

const StageArrow = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center">
    <div className="rounded-lg border border-dashed border-[var(--outline-variant,#c3c6d6)] bg-[var(--surface-container-low,#f8f9ff)] px-4 py-2 text-xs font-medium">
      {label}
    </div>
    <div className="mt-2 text-[var(--on-surface-variant,#424654)]">▼</div>
  </div>
);

const renderFileScan = (data: ThemeDashboardData) => (
  <div className="grid gap-4">
    <SectionCard title="Discovery">
      <ul className="space-y-2">
        {data.analyzed.map((item) => (
          <li key={item.path} className="rounded-lg border border-black/5 bg-[var(--surface-container-low,#f8f9ff)] p-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[var(--on-surface,#181c22)]">{item.path}</span>
              <Badge status={item.status} />
            </div>
            <p className="mt-1">{item.summary}</p>
            {item.opportunities && (
              <ul className="mt-2 list-disc pl-5">
                {item.opportunities.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            )}
            {item.requiredModifications && (
              <div className="mt-2">
                <strong className="text-xs">Required:</strong>
                <ul className="mt-1 list-disc pl-5">
                  {item.requiredModifications.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            )}
            {item.reusableArchitecture && (
              <div className="mt-2">
                <strong className="text-xs">Reusable:</strong>
                <ul className="mt-1 list-disc pl-5">
                  {item.reusableArchitecture.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </SectionCard>
  </div>
);

const renderArchitecture = (data: ThemeDashboardData) => (
  <SectionCard title="Data Flow">
    <div className="flex flex-wrap items-center gap-3">
      {data.architecture.map((edge, i) => (
        <span key={i} className="flex flex-wrap items-center gap-3">
          <StageArrow label={`${edge.from} -> ${edge.to}`} />
        </span>
      ))}
    </div>
    <p className="mt-3 text-xs">
      Data enters from the admin UI and exits as CSS variables on the public website, with Prisma persistence and
      revalidation in between.
    </p>
  </SectionCard>
);

const renderDatabase = (data: ThemeDashboardData) => (
  <div className="grid gap-4">
    {data.schemaDiffs.map((diff) => (
      <SectionCard key={diff.model} title={diff.model}>
        <div className="rounded-lg border border-black/5 bg-[var(--surface-container-low,#f8f9ff)] p-3">
          {diff.fields.map((field) => (
            <div key={field.name} className="flex items-center justify-between border-b last:border-b-0 border-black/5 py-2">
              <span className="font-mono text-xs">{field.name}</span>
              <span className="flex items-center gap-2">
                {field.notes && <span className="text-xs italic">{field.notes}</span>}
                <span
                  className={
                    "rounded-full text-xs px-2 py-0.5 " +
                    (field.status === "new"
                      ? "bg-[var(--primary,#0056D2)]/10 text-[var(--primary,#0056D2)]"
                      : field.status === "modified"
                        ? "bg-[var(--tertiary,#822800)]/10 text-[var(--tertiary,#822800)]"
                        : "bg-black/5")
                  }
                >
                  {field.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
    ))}
  </div>
);

const renderFileStructure = (data: ThemeDashboardData) => (
  <SectionCard title="Implementation Tree">
    <ul className="font-mono text-xs">
      {data.fileStructure.map((node) => (
        <li key={node.path} className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-[var(--surface-container,#ebeef6)]">
          <span className="text-[var(--on-surface,#181c22)]">{node.path}</span>
          <Badge status={node.status} />
        </li>
      ))}
    </ul>
  </SectionCard>
);

const renderAdminUi = (data: ThemeDashboardData) => (
  <div className="grid gap-4">
    {data.adminTabs.map((tab) => (
      <SectionCard key={tab.name} title={tab.name}>
        <dl className="grid gap-2 text-sm">
          <div>
            <dt className="text-xs font-semibold text-[var(--on-surface,#181c22)]">Controls</dt>
            <dd className="ml-0 mt-1 list-disc pl-5">
              <ul>{tab.controls.map((c) => (
                <li key={c}>{c}</li>
              ))}</ul>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-[var(--on-surface,#181c22)]">Preview behavior</dt>
            <dd>{tab.previewBehavior}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-[var(--on-surface,#181c22)]">Affected components</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {tab.affectedComponents.map((file) => (
                <span key={file} className="rounded-lg border border-black/5 bg-[var(--surface-container-low,#f8f9ff)] px-2 py-1 font-mono text-xs">
                  {file}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </SectionCard>
    ))}
  </div>
);

const RenderCode = ({ code }: { code: string | undefined }) =>
  code ? (
    <pre className="mt-2 overflow-auto rounded-lg border border-black/10 bg-[#1f2430] px-4 py-3 text-xs text-[#e6edf3]">
      {code}
    </pre>
  ) : null;

const renderServerActions = (data: ThemeDashboardData) => (
  <SectionCard title="Save Workflow">
    <div className="space-y-3">
      {data.serverActionFlow.map((step, idx) => (
        <div key={idx}>
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary,#0056D2)]/10 text-xs font-bold text-[var(--primary,#0056D2)]">
              {idx + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-[var(--on-surface,#181c22)]">{step.label}</p>
              <p className="text-xs text-[var(--on-surface-variant,#424654)]">{step.description}</p>
            </div>
          </div>
          {step !== data.serverActionFlow[data.serverActionFlow.length - 1] && (
            <div className="ml-[14px] mt-1 h-4 border-l border-dashed border-[var(--outline-variant,#c3c6d6)]" />
          )}
          <RenderCode code={step.codeSnippet} />
        </div>
      ))}
    </div>
  </SectionCard>
);

const renderRoadmap = (data: ThemeDashboardData) => (
  <div className="grid gap-4">
    <SectionCard title="Progress">
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--surface-container,#ebeef6)]">
          <div
            className="h-full rounded-full bg-[var(--primary,#0056D2)]"
            style={{ width: `${Math.max(0, Math.min(100, data.overallProgress))}%` }}
          />
        </div>
        <span className="text-xs font-medium">{data.overallProgress}%</span>
      </div>
    </SectionCard>
    {data.implementationPhases.map((phase) => (
      <SectionCard key={phase.id} title={`Phase ${phase.id}: ${phase.title}`}>
        <p className="text-sm">{phase.objective}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs">Status:</span>
          <span className="rounded-full px-2 py-0.5 text-xs">{phase.status}</span>
        </div>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {phase.tasks.map((task) => (
            <li key={task}>{task}</li>
          ))}
        </ul>
        <div className="mt-3">
          <strong className="text-xs">Checklist</strong>
          <ul className="mt-1 space-y-1">
            {phase.checklist.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs">
                <span className="mt-0.5 text-[var(--primary,#0056D2)]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </SectionCard>
    ))}
  </div>
);

export const sectionRenderers = {
  "file-scan": ({ data }: { data: ThemeDashboardData }) => renderFileScan(data),
  architecture: ({ data }: { data: ThemeDashboardData }) => renderArchitecture(data),
  database: ({ data }: { data: ThemeDashboardData }) => renderDatabase(data),
  "file-structure": ({ data }: { data: ThemeDashboardData }) => renderFileStructure(data),
  "admin-ui": ({ data }: { data: ThemeDashboardData }) => renderAdminUi(data),
  "server-actions": ({ data }: { data: ThemeDashboardData }) => renderServerActions(data),
  roadmap: ({ data }: { data: ThemeDashboardData }) => renderRoadmap(data),
};

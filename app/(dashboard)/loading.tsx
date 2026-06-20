export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="h-9 w-64 rounded-lg bg-muted/70" />
        <div className="h-5 w-96 max-w-full rounded-md bg-muted/50" />
      </div>

      {/* Hero / wide block */}
      <div className="h-40 w-full rounded-2xl bg-muted/40 border border-border/40" />

      {/* Stat cards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="card-surface p-5 space-y-3"
          >
            <div className="h-4 w-24 rounded bg-muted/60" />
            <div className="h-8 w-16 rounded bg-muted/70" />
          </div>
        ))}
      </div>

      {/* Content rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-surface p-6 space-y-4">
          <div className="h-5 w-40 rounded bg-muted/60" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 w-full rounded-xl bg-muted/40" />
          ))}
        </div>
        <div className="lg:col-span-1 card-surface p-6 space-y-4">
          <div className="h-5 w-32 rounded bg-muted/60" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-full rounded-lg bg-muted/40" />
          ))}
        </div>
      </div>
    </div>
  )
}

import { getGiveaways } from '@/lib/db'
import { DrawWinnersClient } from '@/components/draw/draw-winners-client'

export const dynamic = 'force-dynamic'

export default async function DrawWinnersPage() {
  const giveaways = await getGiveaways()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-4 relative z-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 drop-shadow-sm tracking-tight">Draw Winners</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">Run the lottery wheel to select winners</p>
      </div>

      <DrawWinnersClient giveaways={giveaways} />
    </div>
  )
}

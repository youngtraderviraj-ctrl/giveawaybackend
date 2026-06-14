import { getGiveaways } from '@/lib/db'
import { DrawWinnersClient } from '@/components/draw/draw-winners-client'

export const dynamic = 'force-dynamic'

export default async function DrawWinnersPage() {
  const giveaways = await getGiveaways()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-extrabold mb-2"><span className="text-gradient">Draw Winners</span></h1>
        <p className="text-muted">Run the lottery wheel to select winners</p>
      </div>

      <DrawWinnersClient giveaways={giveaways} />
    </div>
  )
}

import { supabaseServerAnon } from '@/lib/supabase/server'
import { EntryForm } from '@/components/giveaway/entry-form'
import { Gift } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function GiveawayPage() {
  const supabase = supabaseServerAnon()
  const { data: giveaway } = await supabase
    .from('giveaways')
    .select('id, name, prize, description, status')
    .eq('status', 'Live')
    .order('start_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="mx-auto max-w-xl">
        {giveaway ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold mb-3">
                <span className="text-gradient">{giveaway.name}</span>
              </h1>
              {giveaway.description && (
                <p className="text-muted">{giveaway.description}</p>
              )}
            </div>
            <EntryForm giveawayId={giveaway.id} prize={giveaway.prize} />
          </>
        ) : (
          <div className="card-surface p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-500/10">
              <Gift className="text-slate-400" size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              No active giveaway right now
            </h2>
            <p className="text-muted">
              Entries are currently closed. Check back soon for the next giveaway!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

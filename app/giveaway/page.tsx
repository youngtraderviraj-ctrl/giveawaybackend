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
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-xl">
        {giveaway ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-3 text-foreground">
                {giveaway.name}
              </h1>
              {giveaway.description && (
                <p className="text-muted-foreground">{giveaway.description}</p>
              )}
            </div>
            <EntryForm giveawayId={giveaway.id} prize={giveaway.prize} />
          </>
        ) : (
          <div className="card-surface p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Gift className="text-muted-foreground" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No active giveaway right now
            </h2>
            <p className="text-muted-foreground">
              Entries are currently closed. Check back soon for the next giveaway!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

import { Sidebar } from '@/components/layout/sidebar'
import { TopNavbar } from '@/components/layout/top-navbar'
import { AutoRefresh } from '@/components/layout/auto-refresh'
import { getAuthUser } from '@/lib/supabase/auth-server'

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getAuthUser()

  return (
    <div className="flex h-screen overflow-hidden bg-background relative selection:bg-primary/30">
      {/* Static Background Blobs for Glassmorphism (Animation removed to fix lag) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen transform-gpu"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-chart-5/20 blur-[120px] mix-blend-screen transform-gpu"></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-chart-1/20 blur-[100px] mix-blend-screen transform-gpu"></div>
      </div>

      <AutoRefresh />

      <Sidebar email={user?.email ?? ''} />

      <div className="flex-1 flex flex-col md:ml-64 min-w-0 relative z-0">
        <TopNavbar />

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}


import { Sidebar } from '@/components/layout/sidebar'
import { TopNavbar } from '@/components/layout/top-navbar'
import { getAuthUser } from '@/lib/supabase/auth-server'

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getAuthUser()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar email={user?.email ?? ''} />

      <div className="flex-1 flex flex-col md:ml-64 min-w-0">
        <TopNavbar />

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

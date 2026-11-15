import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
      <div className="flex min-h-[100svh] flex-col md:h-screen md:min-h-0 md:flex-row md:overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sidebar />
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block">
            <Header />
          </div>

          {/* Main Content Area */}
          <main className="min-w-0 flex-1 pt-14 pb-[calc(8rem+env(safe-area-inset-bottom))] focus:outline-none md:min-h-0 md:overflow-y-auto md:pt-0 md:pb-0">
            {children}
          </main>
        </div>
      </div>
   
  )
}

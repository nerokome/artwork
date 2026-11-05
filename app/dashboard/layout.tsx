import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
      <div className="flex h-screen overflow-hidden">
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
          <main className="flex-1 overflow-y-auto pt-14 pb-16 focus:outline-none md:pt-0 md:pb-0">
            {children}
          </main>
        </div>
      </div>
   
  )
}
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <body className="bg-neutral-900">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          {/* Mobile Header/Navigation */}
          {/* 'sticky top-0 z-40' keeps it at the top during scrolls */}
          <div className="sticky top-0 z-40 text-sm flex flex-row md:hidden">
            <Header />
           
            <Sidebar /> 
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block">
            <Header />
          </div>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </body>
  )
}
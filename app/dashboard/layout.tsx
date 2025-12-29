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
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex flex-col flex-1">
      
          <div className="md:hidden">
            <Sidebar />
          </div>

          <div className="hidden md:block">
            <Header />
          </div>

          <main className="flex-1 overflow-y-auto ">
  {children}
</main>

        </div>
      </div>
    </body>
  )
}
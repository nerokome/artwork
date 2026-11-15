import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  ChartNoAxesCombined,
  Globe2,
  Heart,
  ImagePlus,
  LayoutDashboard,
  MessageCircle,
  Palette,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react'
import DashboardPageHeading from '@/app/components/DashboardPageHeading'

const guideSections = [
  {
    id: 'getting-started',
    title: 'Getting started',
    icon: <UserRound size={20} />,
    paragraphs: [
      'Artfolio is a place to publish your artwork, build a public portfolio, discover other artists, and follow how your work is being viewed.',
      'Start in Account and choose Edit profile. Add a display name and, if you like, a profile picture. Your display name is used to create your public portfolio address.',
      'Use the dashboard navigation to move between your artwork archive, uploads, analytics, artist discovery, and account tools. On a phone, the five-item bar stays at the bottom; Chat is available from the top bar.',
    ],
  },
  {
    id: 'artwork',
    title: 'Upload and manage artwork',
    icon: <ImagePlus size={20} />,
    paragraphs: [
      'Open Upload from the dashboard navigation. Enter an artwork name, then choose image files or drag and drop them into the upload area.',
      'Uploads accept PNG, JPG, and WEBP files up to 20 MB each. The title you enter is applied to every file in that upload batch. Duplicate selections are ignored.',
      'Uploads run one file at a time and show progress. If some files fail, successful files are cleared and failed files stay in the list so you can retry them.',
      'Open Portfolio (My Archives) to see your uploaded work. From there you can open artwork, review its engagement, and delete work you no longer want to keep.',
    ],
  },
  {
    id: 'public-portfolio',
    title: 'Your public portfolio',
    icon: <Globe2 size={20} />,
    paragraphs: [
      'Your public portfolio is the shareable page visitors can use to view your published artwork. Set a display name first; the app uses it to form your portfolio link.',
      'Account shows your portfolio link and a search preview. Use the open icon to visit the public page or Copy portfolio link to share it.',
      'Your public page displays your name and public artwork. Visitors can open artwork to view it larger and can like work where the like control is available.',
      'If the link is missing, add or update your display name in Edit profile. If the portfolio has no artwork yet, upload your first piece from Upload.',
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: <ChartNoAxesCombined size={20} />,
    paragraphs: [
      'Analytics brings together the activity the app records for your artwork, including views over time, engagement, and top-performing pieces.',
      'View activity as your work is discovered. Opening artwork can contribute a view, so activity may change as you and other visitors browse.',
      'Analytics depends on recorded activity and available artwork. A new portfolio may have little or no data at first; continue sharing your portfolio and check back as activity accumulates.',
    ],
  },
  {
    id: 'discover',
    title: 'Discover, follow, and connect',
    icon: <UsersRound size={20} />,
    paragraphs: [
      'Explore Artists lists artists on Artfolio and highlights popular artwork when available. Select an artist to open their profile and public work.',
      'On an artist profile, you can follow or unfollow the artist, view their public artwork, and start a chat when signed in. Use Followers and Following from your profile to review your connections.',
      'Open Chat from the top navigation on mobile or the dashboard menu on desktop. Choose an artist from the list to start or continue a conversation. Search helps you find an artist in your contacts.',
      'Notifications shows updates such as new followers and messages. Refresh the list when needed, mark individual items as read, or mark all unread notifications as read.',
    ],
  },
  {
    id: 'profile-settings',
    title: 'Profile, account, and appearance',
    icon: <Settings size={20} />,
    paragraphs: [
      'Edit profile lets you choose a profile picture and change your display name. The selected picture can be previewed before upload; supported formats are JPEG, PNG, GIF, WEBP, and AVIF up to 5 MB.',
      'Settings lets you switch between light and dark appearance and change your password. A new password must be at least six characters and match the confirmation field.',
      'Account displays your name, email, account type, portfolio link, and shortcuts to Edit profile, Settings, and this guide. Sign out using the exit control in the dashboard header or mobile top bar.',
    ],
  },
]

export default function ReadmePage() {
  return (
    <main className="portfolio-background min-h-full px-4 py-8 text-zinc-100 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/account"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-cyan-300"
        >
          <ArrowLeft size={16} />
          Account
        </Link>

        <header className="mb-8">
          <DashboardPageHeading icon={BookOpen}>How Artfolio works</DashboardPageHeading>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-6 text-zinc-400 sm:text-base">
            A practical guide to setting up your profile, publishing artwork, sharing your portfolio, and connecting with artists.
          </p>
        </header>

        <nav
          aria-label="Guide contents"
          className="mb-8 rounded-3xl border border-white/10 bg-black/50 p-5 backdrop-blur sm:p-6"
        >
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <BookOpen size={17} className="text-cyan-300" />
            In this guide
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {guideSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-cyan-300"
              >
                {section.title}
              </a>
            ))}
          </div>
        </nav>

        <div className="space-y-5">
          {guideSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-6 rounded-3xl border border-white/10 bg-black/50 p-5 backdrop-blur sm:p-7"
            >
              <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-white sm:text-xl">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  {section.icon}
                </span>
                {section.title}
              </h2>
              <div className="space-y-3 text-sm leading-7 text-zinc-300">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-5 rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.06] p-5 sm:p-7">
          <h2 className="flex items-center gap-3 text-lg font-bold text-white">
            <ShieldCheck size={21} className="text-cyan-300" />
            A good first-session checklist
          </h2>
          <ol className="mt-4 list-inside list-decimal space-y-2 text-sm leading-6 text-zinc-300">
            <li>Set your display name and profile picture.</li>
            <li>Upload at least one artwork with a clear title.</li>
            <li>Open your public portfolio and copy its link to share.</li>
            <li>Explore artists, follow people whose work you like, and check your notifications.</li>
            <li>Return to Analytics as your work gets views and engagement.</li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard/uploaddocs"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-cyan-300"
            >
              <ImagePlus size={16} />
              Upload artwork
              <ArrowUpRight size={15} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/5"
            >
              <LayoutDashboard size={16} />
              Go to Portfolio
            </Link>
            <Link
              href="/dashboard/messages"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/5"
            >
              <MessageCircle size={16} />
              Open Chat
            </Link>
            <Link
              href="/dashboard/artists"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/5"
            >
              <Heart size={16} />
              Explore artists
            </Link>
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/5"
            >
              <Palette size={16} />
              Appearance and settings
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

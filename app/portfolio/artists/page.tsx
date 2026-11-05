import { redirect } from 'next/navigation'

export default function ArtistsDirectoryRedirect() {
  redirect('/dashboard/artists')
}

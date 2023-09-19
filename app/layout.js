import './globals.css'
import { PT_Sans_Caption } from 'next/font/google'

const sansCaption = PT_Sans_Caption({
  subsets: ['latin'],
  variable: '--font-subtitle',
  weight: '400'
});

export const metadata = {
  title: '',
  description: '',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body className={sansCaption.variable}>{children}</body>
    </html>
  )
}

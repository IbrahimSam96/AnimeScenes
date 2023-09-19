import './globals.css'
import { PT_Sans_Caption } from 'next/font/google'

const sansCaption = PT_Sans_Caption({ 
  subsets: ['latin'],
  variable:'--font-subtitle',
  weight:'400'
 });

export const metadata = {
  title: '',
  description: '',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={sansCaption.variable}>{children}</body>
    </html>
  )
}

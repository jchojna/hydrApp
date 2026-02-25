import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Background from "./background"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Hydrapp",
  description:
    "Hydrapp is a web app that helps you track your water consumption.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Background />
        <div className="absolute top-0 right-0 bottom-0 left-0 z-10 flex h-screen w-full items-center justify-center">
          {children}
        </div>
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import {
  initServerI18next,
  getT,
  getResources,
  generateI18nStaticParams,
} from "next-i18next/server"
import { I18nProvider } from "next-i18next/client"
import i18nConfig from "@/i18n.config"

import "../globals.css"
import Background from "../background"
import { getCurrentUser } from "@/lib/dal/user"
import { AuthProvider } from "@/providers/AuthContext"
import { ReactQueryProvider } from "@/providers/ReactQueryProvider"

initServerI18next(i18nConfig)

export async function generateStaticParams() {
  return generateI18nStaticParams()
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return {
    title: t("app.layout.metadata.title"),
    description: t("app.layout.metadata.description"),
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lng: string }>
}>) {
  const { lng } = await params
  const { i18n } = await getT(lng)
  const resources = getResources(i18n)
  const currentUser = await getCurrentUser()

  const authUser = currentUser
    ? {
        id: currentUser.id,
        email: currentUser.email,
      }
    : null

  return (
    <html lang={lng}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider language={lng} resources={resources}>
          <Background />
          <AuthProvider user={authUser}>
            <ReactQueryProvider>
              <div className="absolute top-0 right-0 bottom-0 left-0 z-10 flex h-screen w-full items-center justify-center">
                {children}
              </div>
            </ReactQueryProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  )
}

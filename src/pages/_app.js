import Toaster from "@/components/Toaster"
import NavigationControls from "@/components/NavigationControls"
import { PlayerContextProvider } from "@/context/player"
import { SocketContextProvider } from "@/context/socket"
import "@/styles/globals.css"
import clsx from "clsx"
import { Montserrat, Plaster } from "next/font/google"
import Head from "next/head"

const montserrat = Montserrat({ subsets: ["latin"] })

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="shortcut icon" href="/icon.svg" />
        <title>ChemArena 🧪</title>
      </Head>
      <SocketContextProvider>
        <PlayerContextProvider>
          <main
            className={clsx(
              "text-base-[8px] flex flex-col",
              montserrat.className,
            )}
          >
            <Component {...pageProps} />
            <NavigationControls />
          </main>
        </PlayerContextProvider>
      </SocketContextProvider>
      <Toaster />
    </>
  )
}

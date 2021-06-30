import "@fontsource/inter/variable-full.css"
import { CssBaseline, ThemeProvider } from "@italodeandra/pijama"
import { QueryClient, QueryClientProvider } from "react-query"
import type { AppProps } from "next/app"
import { DefaultSeo } from "@italodeandra/pijama/next-seo"
import Head from "next/head"
import { Hydrate } from "react-query/hydration"
import { theme } from "../theme"
import { useState } from "react"
import { withEmotionCache } from "@italodeandra/pijama/next"

const MyApp = withEmotionCache(({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient())

  // noinspection HtmlRequiredTitleElement
  return (
    <>
      <DefaultSeo
        description="Example of Pellegrino, Isomorphic Mongoose for Next.js."
        title="Pellegrino Example"
      />
      <Head>
        <meta content="initial-scale=1, width=device-width" name="viewport" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
          </Hydrate>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  )
})

// noinspection JSUnusedGlobalSymbols
export default MyApp

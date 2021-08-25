import "@fontsource/inter/variable-full.css";
import NProgress from "@italodeandra/pijama/components/NProgress";
import Snackbar from "@italodeandra/pijama/components/Snackbar";
import withEmotionCache from "@italodeandra/pijama/next/withEmotionCache";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { DefaultSeo } from "next-seo";
import Head from "next/head";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Hydrate } from "react-query/hydration";
import { theme } from "../src/theme";

const MyApp = withEmotionCache(({ Component, pageProps }) => {
  const [queryClient] = useState(() => new QueryClient());

  const getLayout = Component.getLayout || ((page) => page);

  const component = getLayout(<Component {...pageProps} />);

  // noinspection HtmlRequiredTitleElement
  return (
    <>
      <DefaultSeo description="Basic application" title="To do list" />
      <Head>
        <meta content="initial-scale=1, width=device-width" name="viewport" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Snackbar />
        <NProgress />

        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            {component}

            <div suppressHydrationWarning>
              <ReactQueryDevtools />
            </div>
          </Hydrate>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
});

// noinspection JSUnusedGlobalSymbols
export default MyApp;

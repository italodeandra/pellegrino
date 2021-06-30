import Document, { Head, Html, Main, NextScript } from "next/document"
import { getInitialProps } from "@italodeandra/pijama/next"
import { theme } from "../theme"

// noinspection JSUnusedGlobalSymbols
export default class MyDocument extends Document {
  render() {
    // noinspection HtmlRequiredTitleElement
    return (
      <Html lang="en">
        <Head>
          <meta content={theme.palette.primary.main} name="theme-color" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

MyDocument.getInitialProps = getInitialProps

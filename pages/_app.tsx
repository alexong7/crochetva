import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme";
import { Analytics } from '@vercel/analytics/react'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <Toaster />
          <Component {...pageProps} />
          <Analytics />
        </ChakraProvider>
      </Provider>
  );
}

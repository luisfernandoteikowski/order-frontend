import "../styles/globals.css";
import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import CustomLayout from "../components/shared/CustomLayout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Order Management</title>
      </Head>
      <CustomLayout>
        <Component {...pageProps} />
      </CustomLayout>
    </>
  );
}

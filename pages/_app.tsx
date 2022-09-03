import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Head from "next/head";
import ThirdwebGuideFooter from "../components/GitHubLink";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mainnet;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <div style={{
        backgroundImage: "url(" + "https://openseauserdata.com/files/d18ec156e83b3084174d00530a9def03.png" + ")",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}>
        <Head>
          <title>Real Goblins Pets NFT Drop Minting Page</title>

        </Head>
        <Component {...pageProps} />
      </div >

    </ThirdwebProvider>
  );
}

export default MyApp;

import {
  useAddress,
  useMetamask,
  useSignatureDrop,
  useNetwork,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import {
  ChainId,
  SignedPayload721WithQuantitySignature,
} from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import React, { useState, useEffect } from 'react'

import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const isMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const [claimCount, setclaimCount] = useState(0); // <--- useState is the hook

  const signatureDrop = useSignatureDrop(
    "0x53225e9F83DD01c44C6faD1cCE5c0a6f9b240427"
  );

  useEffect(() => {
    // Update the document title using the browser API
    document.title = `Real Goblins`;

    (async function () {

      try {
        const claimedNFTCount = await signatureDrop?.totalClaimedSupply();
        setclaimCount(parseInt(claimedNFTCount?.toString()!));


      } catch (e) {
        console.error(e);
      }
    })();
  });



  async function claim() {
    if (!address) {
      connectWithMetamask();
      return;
    }

    if (isMismatch) {
      switchNetwork?.(ChainId.Mainnet);
      return;
    }



    try {
      const tx = await signatureDrop?.claimTo(address, 1);
      alert(`Succesfully minted NFT!`);
    } catch (error: any) {
      alert(error?.message);
    }
  }

  async function claimWithSignature() {
    if (!address) {
      connectWithMetamask();
      return;
    }

    if (isMismatch) {
      switchNetwork && switchNetwork(ChainId.Mainnet);
      return;
    }

    const signedPayloadReq = await fetch(`/api/generate-mint-signature`, {
      method: "POST",
      body: JSON.stringify({
        address: address,
      }),
    });

    console.log(signedPayloadReq);

    if (signedPayloadReq.status === 400) {
      alert(
        "Looks like you don't own an early access NFT :( You don't qualify for the free mint."
      );
      return;
    } else {
      try {
        const signedPayload =
          (await signedPayloadReq.json()) as SignedPayload721WithQuantitySignature;

        console.log(signedPayload);

        const nft = await signatureDrop?.signature.mint(signedPayload);

        alert(`Succesfully minted NFT!`);
      } catch (error: any) {
        alert(error?.message);
      }
    }
  }

  return (
    <div className={styles.container}>
      {/* Top Section */}
      <h1 className={styles.h1}>Real Goblins</h1>
      <h1 className={styles.h1}>Sold out!</h1>
      {address ? (<p>Your address is: {address} and {claimCount.toString()} out of 606 items are claimed so far! </p>) : (address)}

      <p className={styles.describe}>
        <a href="https://opensea.io/collection/real-goblins">
          Real Goblins
        </a>{" "}
        FAAAAAAAck YAAAAAAAUUUUUGGGHHHHH gobblins faces goblinns faces GobLIN FAcES wekm mfers ta goblin world yoo mfers DEgEN RATS oooooh tihs is Besssssttttt NFFTTTEEEEESSSS ever cHaaaoooo
      </p>
      <p><a href="https://etherscan.io/address/0x53225e9f83dd01c44c6fad1cce5c0a6f9b240427">
        Etherscan
      </a>&nbsp;&nbsp;
        <a href="https://twitter.com/realgoblinsnft">
          Twitter
        </a>
      </p>
      {address ? (

        <div className={styles.nftBoxGrid}>
          {/* Mint a new NFT */}
          <div
            className={styles.optionSelectBox}

          >
            <img
              src={`https://gateway.thirdweb.dev/ipfs/QmZiBRj7s8ww1qAkXudeG73XD7KqbGnn7dqf8ZBrvGjoL7/0.gif`}
              alt="drop"
              className={styles.cardImg}
            />

            <button onClick={() => claim()}
              className={`${styles.mainButton} ${styles.spacerTop} ${styles.spacerBottom}`}
            >Mint</button>
            <p className={styles.selectBoxDescription}>
              Each address can claim one NFT!
            </p>
          </div>

          {/* }
          <div
            className={styles.optionSelectBox}
            role="button"
            onClick={() => claimWithSignature()}
          >
            <img
              src={`/icons/analytics.png`}
              alt="signature-mint"
              className={styles.cardImg}
            />
            <h2 className={styles.selectBoxTitle}>Mint with Signature</h2>
            <p className={styles.selectBoxDescription}>
              Check if you are eligible to mint an NFT for free, by using
              signature-based minting.
            </p>
      </div>*/}
        </div>

      ) : (
        <button
          className={styles.mainButton}
          onClick={() => connectWithMetamask()}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default Home;

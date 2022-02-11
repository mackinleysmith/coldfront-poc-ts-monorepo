import * as solanaWeb3 from "@solana/web3.js";
import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  getProvider,
  createSignedSolanaTransaction,
  getSolanaConnection,
} from "../../data/transactions";
import PromoCheckoutPage from "./checkout";
import MarketListPage from "./list";
import PromoShowPage from "./show_promo";

enum TransactionState {
  NOT_STARTED = "NOT_STARTED",
  CONFIRMING = "CONFIRMING",
  CONFIRMED = "CONFIRMED",
  FAILED = "FAILED",
}

const MarketApp = () => {
  return (
    <Routes>
      <Route path="/" element={<MarketListPage />} />
      <Route path="/promos/:id" element={<PromoShowPage />} />
      <Route path="/promos/:id/checkout" element={<PromoCheckoutPage />} />
    </Routes>
  );

  const provider = getProvider();
  const [connected, setConnected] = useState<boolean>(false);
  const [publicKey, setPublicKey] = useState<solanaWeb3.PublicKey | null>(null);
  const [transactionState, setTransactionState] = useState<TransactionState>(
    TransactionState.NOT_STARTED
  );

  useEffect(() => {
    if (!provider) return;
    console.log("we have a provider");
    provider.connect({ onlyIfTrusted: true }).catch((err) => {
      console.error("Phantom provider failed to connect with", err);
    });
    provider.on("connect", (publicKey: solanaWeb3.PublicKey) => {
      setPublicKey(publicKey);
      setConnected(true);
      console.log("[connect] " + publicKey?.toBase58());
    });
    provider.on("disconnect", () => {
      setPublicKey(null);
      setConnected(false);
      console.log("[disconnect] 👋");
    });
    provider.on("accountChanged", (publicKey: solanaWeb3.PublicKey | null) => {
      setPublicKey(publicKey);
      if (publicKey) {
        console.log(
          "[accountChanged] Switched account to " + publicKey?.toBase58()
        );
      } else {
        console.log("[accountChanged] Switched unknown account");
        // In this case, dapps could not to anything, or,
        // Only re-connecting to the new account if it is trusted
        // provider.connect({ onlyIfTrusted: true }).catch((err) => {
        //   // fail silently
        // });
        // Or, always trying to reconnect
        provider
          .connect()
          .then(() => console.log("[accountChanged] Reconnected successfully"))
          .catch((err: any) => {
            console.error(
              "[accountChanged] Failed to re-connect: " + err.message
            );
          });
      }
    });
    return () => {
      provider.disconnect();
    };
  }, [provider]);

  const onBuyClick = async () => {
    const provider = getProvider();

    if (!provider || !publicKey) {
      provider?.connect();
      return;
    }

    const signature = await createSignedSolanaTransaction(provider, publicKey);

    setTransactionState(TransactionState.CONFIRMING);
    await getSolanaConnection().confirmTransaction(signature);
    setTransactionState(TransactionState.CONFIRMED);

    console.log("BUY SOMETHING CLICKED");
  };

  return (
    <div>
      {connected ? (
        <>
          <p>Current wallet: {publicKey?.toString()}</p>
          {transactionState === TransactionState.CONFIRMING ? (
            <p>Confirming transaction...</p>
          ) : transactionState === TransactionState.CONFIRMED ? (
            <>
              <h3>HOLY SHIT BRO THANK YOU!</h3>
              <p>
                Here's your discount code for 10% off at Target or somethin:
              </p>
              <pre>fjkrsfaejfsdncsdhvleshflkd</pre>
            </>
          ) : (
            <h1>WANNA BUY SOMETHIN?</h1>
          )}
        </>
      ) : (
        <>
          <button
            className="btn btn-primary"
            onClick={() => {
              getProvider()?.connect();
            }}
          >
            Connect your wallet
          </button>
        </>
      )}
    </div>
  );
};

export default MarketApp;

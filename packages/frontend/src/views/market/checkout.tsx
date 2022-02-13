import {
  createSignedSolanaTransaction,
  getSolanaConnection,
  useProvider,
} from "../../data/transactions";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useParams } from "react-router";
import { PROMOS_BY_ID } from "../../data/promos";
import { CAUSES_BY_ID } from "../../data/causes";

enum PhantomConnectionState {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  FAILED = "FAILED",
}

enum TransactionState {
  NOT_STARTED = "NOT_STARTED",
  CONFIRMING = "CONFIRMING",
  CONFIRMED = "CONFIRMED",
  FAILED = "FAILED",
}

// Create our number formatter.
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PromoCheckoutPage = () => {
  const { id, cause_id } = useParams();
  const promo = PROMOS_BY_ID[id!];
  const cause = CAUSES_BY_ID[cause_id!];

  const { provider, phantomNotInstalled } = useProvider();
  const [phantomConnectionState, setPhantomConnectionState] =
    useState<PhantomConnectionState>(PhantomConnectionState.CONNECTING);
  const [transactionState, setTransactionState] = useState<TransactionState>(
    TransactionState.NOT_STARTED
  );

  useEffect(() => {
    if (!provider) return;

    provider.connect({ onlyIfTrusted: true }).catch((err) => {
      console.error("Phantom provider failed to connect with", err);
      setPhantomConnectionState(PhantomConnectionState.FAILED);
    });

    provider.on("connect", (publicKey: PublicKey) => {
      // setPublicKey(publicKey);
      setPhantomConnectionState(PhantomConnectionState.CONNECTED);
      console.log("[connect] " + publicKey?.toBase58());
    });

    provider.on("disconnect", () => {
      // setPublicKey(null);
      setPhantomConnectionState(PhantomConnectionState.FAILED);
      console.log("[disconnect] 👋");
    });

    provider.on("accountChanged", (publicKey: PublicKey | null) => {
      // setPublicKey(publicKey);
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
          .then(() => {
            console.log("[accountChanged] Reconnected successfully");
            setPhantomConnectionState(PhantomConnectionState.CONNECTED);
          })
          .catch((err: any) => {
            console.error(
              "[accountChanged] Failed to re-connect: " + err.message
            );
            setPhantomConnectionState(PhantomConnectionState.FAILED);
          });
      }
    });

    return () => {
      provider.disconnect();
    };
  }, [provider]);

  const makeTransaction = async () => {
    if (!provider || !provider.publicKey) {
      provider?.connect();
      return;
    }

    const signature = await createSignedSolanaTransaction(
      provider,
      provider.publicKey
    );

    setTransactionState(TransactionState.CONFIRMING);
    await getSolanaConnection().confirmTransaction(signature);
    setTransactionState(TransactionState.CONFIRMED);
  };

  return (
    <div className="hero text-center" style={{ marginTop: 300, maxWidth: 800 }}>
      {provider ? (
        phantomConnectionState === PhantomConnectionState.CONNECTED ? (
          transactionState === TransactionState.NOT_STARTED ? (
            <>
              <h1>Checkout</h1>
              <p className="lead">
                All systems go. Click that button when you're ready.
                <br />
                <br />
                <button
                  className="btn btn-success btn-lg"
                  type="button"
                  onClick={makeTransaction}
                >
                  Make transaction
                </button>
              </p>
            </>
          ) : transactionState === TransactionState.CONFIRMING ? (
            <>
              <h1>Checkout in progress...</h1>
              <p className="lead">This may take a few moments.</p>
            </>
          ) : transactionState === TransactionState.CONFIRMED ? (
            <>
              <h1>Success!</h1>
              <p className="lead">
                Transaction confirmed!{" "}
                {currencyFormatter.format(promo.price_in_caps * 0.9)} is now
                being invested in {cause.title}, and in the meantime, here's
                your promo code for {promo.title} at {promo.supplier}:
                <br />
                <code>{promo.code}</code>
              </p>
            </>
          ) : transactionState === TransactionState.FAILED ? (
            <>
              <h1>Checkout failed</h1>
              <p className="lead">Aw heck, something went wrong.</p>
            </>
          ) : null
        ) : (
          phantomConnectionState === PhantomConnectionState.FAILED && (
            <>
              <h1>Checkout</h1>
              <p className="lead">
                Connect your wallet to complete the transaction. ColdFront uses
                blockchain technology to ensure every transaction is public and
                auditable.
                <br />
                <br />
                <button
                  className="btn btn-primary btn-lg"
                  type="button"
                  onClick={() => {
                    provider?.connect();
                  }}
                >
                  Connect wallet
                </button>
              </p>
            </>
          )
        )
      ) : phantomNotInstalled ? (
        <>
          <h1>Woah there!</h1>
          <p className="lead">
            You must have Phantom Wallet installed to proceed.
            <br />
            <br />
            <a
              className="btn btn-primary btn-lg"
              href="https://phantom.app/"
              target="_blank"
              rel="noreferrer"
            >
              Get Phantom
            </a>
          </p>
        </>
      ) : null}
    </div>
  );
};

export default PromoCheckoutPage;

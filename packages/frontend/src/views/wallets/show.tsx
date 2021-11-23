import { useAuth0 } from "@auth0/auth0-react";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Wallet, getBalance } from "./list";

export const WalletPage: FC<{}> = () => {
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/wallets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`,
          },
        }
      );

      const wallet: Wallet = await response.json();
      const balance = await getBalance(wallet);
      setWallet(wallet);
      setBalance(balance);
    })();
  }, [getAccessTokenSilently, id]);

  return (
    <div>
      <h1>
        {wallet?.name ?? "Loading..."}

        <Link
          className="btn btn-outline-secondary float-right mt-1"
          type="button"
          to="/wallets"
        >
          Back
        </Link>
      </h1>

      <p>
        Address: <code>{wallet?.address}</code>
      </p>

      <p>Balance: {wallet ? balance : "..."} CFT</p>
    </div>
  );
};

import { FC, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { getWalletBalance, getUserWallets, Wallet } from "../../data/wallets";

const ViewWalletBtn: FC<{ wallet: Wallet }> = ({ wallet }) => {
  return (
    <Link
      to={`/wallets/${wallet.id}`}
      type="button"
      className="btn btn-outline-primary btn-sm"
      style={{
        fontSize: 12,
        padding: "2px 4px",
        marginTop: -4,
      }}
    >
      View
    </Link>
  );
};

const WalletDeleteBtn: FC<{ wallet: Wallet }> = ({ wallet }) => {
  const { getAccessTokenSilently } = useAuth0();

  const onClick = async () => {
    await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/wallets/${wallet.id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${await getAccessTokenSilently()}` },
      }
    );

    window.location.reload();
  };

  return (
    <button
      type="button"
      className="btn btn-outline-danger btn-sm"
      onClick={onClick}
      style={{
        fontSize: 12,
        padding: "2px 4px",
        marginTop: -4,
      }}
    >
      Delete
    </button>
  );
};

interface WalletRowProps {
  wallet: Wallet;
}

const WalletRow: FC<WalletRowProps> = ({ wallet }) => {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    getWalletBalance(wallet).then((balance) => {
      setBalance(balance);
    });
  }, [wallet]);

  return (
    <tr>
      <td>{wallet.name}</td>
      <td>
        <code>{wallet.address}</code>
      </td>
      <td>{balance ?? 0} CFT</td>
      <td>
        <ViewWalletBtn wallet={wallet} /> <WalletDeleteBtn wallet={wallet} />
      </td>
    </tr>
  );
};

interface WalletsListPageProps {}

const WalletsListPage: FC<WalletsListPageProps> = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [wallets, setWallets] = useState<Wallet[]>();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setErrorMessage("");

    getAccessTokenSilently()
      .then(getUserWallets)
      .then((responseData) => {
        setWallets(responseData);
      })
      .catch((error: any) => {
        setErrorMessage(error.message);
      });
  }, [getAccessTokenSilently]);

  return (
    <div>
      <h1>
        Wallets
        <Link
          className="btn btn-primary float-right mt-1"
          type="button"
          to="/wallets/new"
        >
          New Wallet
        </Link>
      </h1>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      {wallets && (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Balance</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet) => (
              <WalletRow key={wallet.id} wallet={wallet} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WalletsListPage;

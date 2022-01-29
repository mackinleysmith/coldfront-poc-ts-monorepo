import * as solanaWeb3 from "@solana/web3.js";

export interface Wallet {
  id: number;
  name: string;
  address: string;
  user_id: string;
}

export const getUserWallets = async (authToken: string) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const response = await fetch(`${serverUrl}/api/wallets`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  return await response.json();
};

export const getWalletBalance = async (wallet: Wallet) => {
  const conn = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl("mainnet-beta")
  );

  const walletAddress = new solanaWeb3.PublicKey(wallet.address);
  const tokenAddress = new solanaWeb3.PublicKey(
    "7aKNMEvezpGe2NuqRJKU3c59DGAC2fydCtKjmaHtdQ4o"
  );

  const response = await conn.getParsedTokenAccountsByOwner(walletAddress, {
    mint: tokenAddress,
  });

  return response.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
};
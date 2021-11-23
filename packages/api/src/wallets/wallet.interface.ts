export interface BaseWallet {
  name: string;
  address: string;
  user_id: string;
}

export interface Wallet extends BaseWallet {
  id: number;
}
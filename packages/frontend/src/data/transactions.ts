import {
  AccountLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import * as solanaWeb3 from "@solana/web3.js";
import { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";
import BufferLayout from "@solana/buffer-layout";
import BN from "bn.js";

declare global {
  interface Window {
    solana: any;
  }
}


const tokenMintAddress = "7aKNMEvezpGe2NuqRJKU3c59DGAC2fydCtKjmaHtdQ4o";

// createTransferInstructions.ts

export enum TokenInstruction {
  InitializeMint = 0,
  InitializeAccount = 1,
  InitializeMultisig = 2,
  Transfer = 3,
  Approve = 4,
  Revoke = 5,
  SetAuthority = 6,
  MintTo = 7,
  Burn = 8,
  CloseAccount = 9,
  FreezeAccount = 10,
  ThawAccount = 11,
  TransferChecked = 12,
  ApproveChecked = 13,
  MintToChecked = 14,
  BurnChecked = 15,
  InitializeAccount2 = 16,
  SyncNative = 17,
  InitializeAccount3 = 18,
  InitializeMultisig2 = 19,
  InitializeMint2 = 20,
}

/**
 * Construct a Transfer instruction
 *
 * @param source       Source account
 * @param destination  Destination account
 * @param owner        Owner of the source account
 * @param amount       Number of tokens to transfer
 * @param multiSigners Signing accounts if `owner` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createTransferInstruction(
  source: solanaWeb3.PublicKey,
  destination: solanaWeb3.PublicKey,
  owner: solanaWeb3.PublicKey,
  amount: number,
  multiSigners: solanaWeb3.Signer[] = [],
  programId = TOKEN_PROGRAM_ID
): solanaWeb3.TransactionInstruction {
  const dataLayout = BufferLayout.struct([
    // @ts-ignore
    BufferLayout.u8("instruction"),
    // @ts-ignore
    BufferLayout.blob(8, "amount"),
  ]);

  const keys = addSigners(
    [
      { pubkey: source, isSigner: false, isWritable: true },
      { pubkey: destination, isSigner: false, isWritable: true },
    ],
    owner,
    multiSigners
  );

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: TokenInstruction.Transfer,
      amount: new TokenAmount(amount).toBuffer(),
    },
    data
  );

  return new solanaWeb3.TransactionInstruction({ keys, programId, data });
}

export function addSigners(
  keys: solanaWeb3.AccountMeta[],
  ownerOrAuthority: solanaWeb3.PublicKey,
  multiSigners: solanaWeb3.Signer[]
): solanaWeb3.AccountMeta[] {
  if (multiSigners.length) {
    keys.push({ pubkey: ownerOrAuthority, isSigner: false, isWritable: false });
    for (const signer of multiSigners) {
      keys.push({
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false,
      });
    }
  } else {
    keys.push({ pubkey: ownerOrAuthority, isSigner: true, isWritable: false });
  }
  return keys;
}

class TokenAmount extends BN {
  /**
   * Convert to Buffer representation
   */
  toBuffer(): Buffer {
    const a = super.toArray().reverse();
    const b = Buffer.from(a);
    if (b.length === 8) {
      return b;
    }

    if (b.length >= 8) {
      throw new Error("TokenAmount too large");
    }

    const zeroPad = Buffer.alloc(8);
    b.copy(zeroPad);
    return zeroPad;
  }

  /**
   * Construct a TokenAmount from Buffer representation
   */
  static fromBuffer(buffer: Buffer): TokenAmount {
    if (buffer.length !== 8) {
      throw new Error(`Invalid buffer length: ${buffer.length}`);
    }

    return new BN(
      [...buffer]
        .reverse()
        .map((i) => `00${i.toString(16)}`.slice(-2))
        .join(""),
      16
    );
  }
}

// async function transfer(
//   tokenMintAddress: string,
//   wallet: Wallet,
//   to: string,
//   connection: web3.Connection,
//   amount: number
// ) {
//   const mintPublicKey = new web3.PublicKey(tokenMintAddress);
//   const mintToken = new Token(
//     connection,
//     mintPublicKey,
//     TOKEN_PROGRAM_ID,
//     wallet.payer // the wallet owner will pay to transfer and to create recipients associated token account if it does not yet exist.
//   );

//   const fromTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(
//     wallet.publicKey
//   );

//   const destPublicKey = new web3.PublicKey(to);

//   // Get the derived address of the destination wallet which will hold the custom token
//   const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
//     mintToken.associatedProgramId,
//     mintToken.programId,
//     mintPublicKey,
//     destPublicKey
//   );

//   const receiverAccount = await connection.getAccountInfo(
//     associatedDestinationTokenAddr
//   );

//   const instructions: web3.TransactionInstruction[] = [];

//   if (receiverAccount === null) {
//     instructions.push(
//       Token.createAssociatedTokenAccountInstruction(
//         mintToken.associatedProgramId,
//         mintToken.programId,
//         mintPublicKey,
//         associatedDestinationTokenAddr,
//         destPublicKey,
//         wallet.publicKey
//       )
//     );
//   }

//   instructions.push(
//     Token.createTransferInstruction(
//       TOKEN_PROGRAM_ID,
//       fromTokenAccount.address,
//       associatedDestinationTokenAddr,
//       wallet.publicKey,
//       [],
//       amount
//     )
//   );

//   const transaction = new web3.Transaction().add(...instructions);
//   transaction.feePayer = wallet.publicKey;
//   transaction.recentBlockhash = (
//     await connection.getRecentBlockhash()
//   ).blockhash;

//   const transactionSignature = await connection.sendRawTransaction(
//     transaction.serialize(),
//     { skipPreflight: true }
//   );

//   await connection.confirmTransaction(transactionSignature);
// }

type DisplayEncoding = "utf8" | "hex";
type PhantomEvent = "disconnect" | "connect" | "accountChanged";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  publicKey: solanaWeb3.PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (
    transaction: solanaWeb3.Transaction
  ) => Promise<solanaWeb3.Transaction>;
  signAllTransactions: (
    transactions: solanaWeb3.Transaction[]
  ) => Promise<solanaWeb3.Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (
    opts?: Partial<ConnectOpts>
  ) => Promise<{ publicKey: solanaWeb3.PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

export const getProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    const anyWindow: any = window;
    const provider = anyWindow.solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  window.open("https://phantom.app/", "_blank");
};

// const NETWORK = solanaWeb3.clusterApiUrl("mainnet-beta");
const NETWORK = "https://solana-api.projectserum.com/";
export const getSolanaConnection = (): solanaWeb3.Connection => new solanaWeb3.Connection(NETWORK);

enum AccountState {
  Uninitialized = 0,
  Initialized = 1,
  Frozen = 2,
}

async function getAccountInfo(
  connection: solanaWeb3.Connection,
  address: solanaWeb3.PublicKey,
  commitment?: solanaWeb3.Commitment,
  programId = TOKEN_PROGRAM_ID
) {
  const info = await connection.getAccountInfo(address, commitment);
  if (!info) throw new Error("TokenAccountNotFoundError");
  if (!info.owner.equals(programId))
    throw new Error("TokenInvalidAccountOwnerError");
  if (info.data.length !== AccountLayout.span)
    throw new Error("TokenInvalidAccountSizeError");

  const rawAccount = AccountLayout.decode(Buffer.from(info.data));

  return {
    address,
    mint: rawAccount.mint,
    owner: rawAccount.owner,
    amount: rawAccount.amount,
    delegate: rawAccount.delegateOption ? rawAccount.delegate : null,
    delegatedAmount: rawAccount.delegatedAmount,
    isInitialized: rawAccount.state !== AccountState.Uninitialized,
    isFrozen: rawAccount.state === AccountState.Frozen,
    isNative: !!rawAccount.isNativeOption,
    rentExemptReserve: rawAccount.isNativeOption ? rawAccount.isNative : null,
    closeAuthority: rawAccount.closeAuthorityOption
      ? rawAccount.closeAuthority
      : null,
  };
}

async function getAssociatedTokenAddress(
  mint: solanaWeb3.PublicKey,
  owner: solanaWeb3.PublicKey,
  allowOwnerOffCurve = false,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): Promise<solanaWeb3.PublicKey> {
  if (!allowOwnerOffCurve && !solanaWeb3.PublicKey.isOnCurve(owner.toBuffer()))
    throw new Error("TokenOwnerOffCurveError");

  const [address] = await solanaWeb3.PublicKey.findProgramAddress(
    [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
    associatedTokenProgramId
  );

  return address;
}

function createAssociatedTokenAccountInstruction(
  payer: solanaWeb3.PublicKey,
  associatedToken: solanaWeb3.PublicKey,
  owner: solanaWeb3.PublicKey,
  mint: solanaWeb3.PublicKey,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): solanaWeb3.TransactionInstruction {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedToken, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: false, isWritable: false },
    { pubkey: mint, isSigner: false, isWritable: false },
    {
      pubkey: solanaWeb3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: programId, isSigner: false, isWritable: false },
    {
      pubkey: solanaWeb3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];

  return new solanaWeb3.TransactionInstruction({
    keys,
    programId: associatedTokenProgramId,
    data: Buffer.alloc(0),
  });
}

async function getOrCreateAssociatedTokenAccount(
  connection: solanaWeb3.Connection,
  payer: solanaWeb3.PublicKey,
  mint: solanaWeb3.PublicKey,
  owner: solanaWeb3.PublicKey,
  signTransaction: SignerWalletAdapterProps["signTransaction"],
  allowOwnerOffCurve = false,
  commitment?: solanaWeb3.Commitment,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
) {
  const associatedToken = await getAssociatedTokenAddress(
    mint,
    owner,
    allowOwnerOffCurve,
    programId,
    associatedTokenProgramId
  );

  // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
  // Sadly we can't do this atomically.
  let account;
  try {
    account = await getAccountInfo(
      connection,
      associatedToken,
      commitment,
      programId
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
    // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
    // TokenInvalidAccountOwnerError in this code path.
    if (
      error.message === "TokenAccountNotFoundError" ||
      error.message === "TokenInvalidAccountOwnerError"
    ) {
      // As this isn't atomic, it's possible others can create associated accounts meanwhile.
      try {
        const transaction = new solanaWeb3.Transaction().add(
          createAssociatedTokenAccountInstruction(
            payer,
            associatedToken,
            owner,
            mint,
            programId,
            associatedTokenProgramId
          )
        );

        const blockHash = await connection.getRecentBlockhash();
        transaction.feePayer = await payer;
        transaction.recentBlockhash = await blockHash.blockhash;
        const signed = await signTransaction(transaction);

        const signature = await connection.sendRawTransaction(
          signed.serialize()
        );

        await connection.confirmTransaction(signature);
      } catch (error: unknown) {
        // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
        // instruction error if the associated account exists already.
      }

      // Now this should always succeed
      account = await getAccountInfo(
        connection,
        associatedToken,
        commitment,
        programId
      );
    } else {
      throw error;
    }
  }

  if (!account.mint.equals(mint.toBuffer()))
    throw Error("TokenInvalidMintError");
  if (!account.owner.equals(owner.toBuffer()))
    throw new Error("TokenInvalidOwnerError");

  return account;
}

export async function transferToken(provider: PhantomProvider) {
  if (!provider?.publicKey) {
    return;
  }
  const connection = new solanaWeb3.Connection(NETWORK);

  const destPublicKey = new solanaWeb3.PublicKey(
    "25iXfmHJiorEMmZzRXp7D8Fc2w552GhfSaNH4njiisuv"
  );
  const mint = new solanaWeb3.PublicKey(tokenMintAddress);
  const { signTransaction } = provider;

  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    provider.publicKey,
    mint,
    provider.publicKey,
    signTransaction
  );

  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    provider.publicKey,
    mint,
    destPublicKey,
    signTransaction
  );

  const amount = 1;

  const transaction = new solanaWeb3.Transaction().add(
    createTransferInstruction(
      fromTokenAccount.address, // source
      toTokenAccount.address, // dest
      provider.publicKey,
      amount * solanaWeb3.LAMPORTS_PER_SOL,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  // // const token = await getAccessTokenSilently();
  // // const userWallets = await getUserWallets(token);
  // // const firstWalletAddress = new solanaWeb3.PublicKey(userWallets[0].address);
  // const firstWalletAddress = provider.publicKey;
  // const destWalletAddress = new solanaWeb3.PublicKey("TODO");

  // const mintPublicKey = new solanaWeb3.PublicKey(tokenMintAddress);
  // const mintToken = new Token(
  //   connection,
  //   mintPublicKey,
  //   TOKEN_PROGRAM_ID,
  //   {
  //     publicKey: provider.publicKey,
  //     secretKey: null,
  //   }
  //   // wallet.payer // the wallet owner will pay to transfer and to create recipients associated token account if it does not yet exist.
  // );
  // const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
  //   connection,
  //   publicKey,
  //   mint,
  //   publicKey,
  //   signTransaction
  // );

  // // Get the derived address of the destination wallet which will hold the custom token
  // const associatedDestinationTokenAddr =
  //   await Token.getAssociatedTokenAddress(
  //     mintToken.associatedProgramId,
  //     mintToken.programId,
  //     mintPublicKey,
  //     destWalletAddress
  //   );

  // const amount = 1;

  // const instructions: solanaWeb3.TransactionInstruction[] = [
  //   // solanaWeb3.SystemProgram.transfer({
  //   //   fromPubkey: firstWalletAddress,
  //   //   toPubkey: firstWalletAddress,
  //   //   lamports: 100,
  //   // })
  //   Token.createTransferInstruction(
  //     TOKEN_PROGRAM_ID,
  //     fromTokenAccount,
  //     associatedDestinationTokenAddr,
  //     firstWalletAddress,
  //     [],
  //     amount
  //   ),
  // ];

  // const transaction = new solanaWeb3.Transaction().add(...instructions);

  // const { blockhash } = await connection.getRecentBlockhash();
  // transaction.recentBlockhash = blockhash;
  // transaction.feePayer = firstWalletAddress;

  const { signature } = await window.solana.signAndSendTransaction(transaction);
  // const { signature } = await window.solana.request({
  //   method: "signAndSendTransaction",
  //   params: {
  //     message: bs58.encode(transaction.serializeMessage()),
  //   },
  // });
  await connection.confirmTransaction(signature);
}

export async function createSignedSolanaTransaction(
  provider: PhantomProvider,
  fromPubkey: solanaWeb3.PublicKey
): Promise<string> {
  if (!provider.publicKey) {
    return Promise.reject();
  }

  const lamports = 100;

  const toPubkey = new solanaWeb3.PublicKey(
    "25iXfmHJiorEMmZzRXp7D8Fc2w552GhfSaNH4njiisuv"
  );

  const instructions: solanaWeb3.TransactionInstruction[] = [
    solanaWeb3.SystemProgram.transfer({ fromPubkey, toPubkey, lamports }),
  ];

  const transaction = new solanaWeb3.Transaction().add(...instructions);
  transaction.feePayer = fromPubkey;

  const { blockhash } = await getSolanaConnection().getRecentBlockhash();
  transaction.recentBlockhash = blockhash;

  const { signature } = await window.solana.signAndSendTransaction(transaction);
  return signature;
}

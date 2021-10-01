import { Connection, Keypair, TransactionInstruction } from '@solana/web3.js';
import {
  actions,
  StringPublicKey,
  WalletSigner,
  sendTransactionWithRetry,
} from '@oyster/common';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';

const { startLottery } = actions;

// This command makes an Lottery
export async function startCreatedLottery(
  connection: Connection,
  wallet: WalletSigner,
  lotteryStore: StringPublicKey,
): Promise<{
  txid: string;
  slot: number;
}> {
  if (!wallet.publicKey) throw new WalletNotConnectedError();

  const instructions: TransactionInstruction[] = [];

  const signers: Keypair[] = [];

  await startLottery(wallet.publicKey.toBase58(), lotteryStore, instructions);
  const { txid, slot } = await sendTransactionWithRetry(
    connection,
    wallet,
    instructions,
    signers,
    'single',
  );

  return { txid, slot };
}

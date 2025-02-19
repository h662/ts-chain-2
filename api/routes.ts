import { Router } from "express";
import Blockchain from "../blockchain/Blockchain";
import Wallet from "../wallet/Wallet";
import Transaction from "../blockchain/Transaction";

const router = Router();
const blockchain = new Blockchain();
const wallets: Record<string, Wallet> = {};

router.get("/blocks", (_, res) => {
  return res.json(blockchain.chain);
});

router.get("/blocks/:index", (req, res) => {
  const { index } = req.params;
  const block = blockchain.chain[Number(index)];
  if (!block) {
    return res.status(404).json({ error: "Block not found" });
  }

  return res.json(block);
});

router.post("/wallet", (_, res) => {
  const wallet = new Wallet();
  wallets[wallet.address] = wallet;

  return res.json(wallet);
});

router.get("/wallet/:address", (req, res) => {
  const { address } = req.params;
  const wallet = wallets[address];
  if (!wallet) {
    return res.status(404).json({ error: "Wallet not found" });
  }

  return res.json(wallet);
});

router.post("/transaction", (req, res) => {
  const { sender, receiver, amount } = req.body;

  if (!sender || !receiver || typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Invalid transaction data" });
  }

  const senderWallet = Object.values(wallets).find(
    (wallet) => wallet.address === sender
  );
  if (!senderWallet) {
    return res.status(400).json({ error: "Invalid sender address" });
  }

  const transaction = new Transaction(senderWallet.address, receiver, amount);

  try {
    transaction.signTransaction(senderWallet);
    blockchain.addTransaction(transaction);

    return res.json(transaction);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(400).json({ error: "Unknown error occurred" });
    }
  }
});

router.get("/transactions", (_, res) => {
  return res.json(blockchain.transactionPool);
});

export default router;

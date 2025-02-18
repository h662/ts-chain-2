import Wallet from "../wallet/Wallet";

class Transaction {
  sender: string | null;
  receiver: string;
  amount: number;
  timestamp: string;
  signature: string | null = null;

  constructor(sender: string | null, receiver: string, amount: number) {
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
    this.timestamp = new Date().toISOString();
  }

  signTransaction(wallet: Wallet): void {
    if (wallet.publicKey !== this.sender) {
      throw new Error("Transaction signing is only allowed by the sender.");
    }
    const data = this.calculateHash();
    this.signature = wallet.signTransaction(data);
  }

  calculateHash(): string {
    return JSON.stringify({
      sender: this.sender,
      receiver: this.receiver,
      amount: this.amount,
      timestamp: this.timestamp,
    });
  }

  toString(): string {
    return JSON.stringify(this);
  }
}

export default Transaction;

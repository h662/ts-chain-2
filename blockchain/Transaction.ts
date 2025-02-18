import Wallet from "../wallet/Wallet";

class Transaction {
  sender: string | null;
  receiver: string;
  amount: number;
  timestamp: string;
  signature: string | null = null;

  constructor(
    sender: string | null,
    receiver: string,
    amount: number,
    signature: string | null = null,
    timestamp: string = new Date().toISOString()
  ) {
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
    this.signature = signature;
    this.timestamp = timestamp;
  }

  signTransaction(wallet: Wallet): void {
    if (wallet.publicKey !== this.sender) {
      throw new Error("Transaction signing is only allowed by the sender.");
    }
    const data = this.calculateHash();
    this.signature = wallet.signTransaction(data);
  }

  isValid(): boolean {
    if (this.sender === null) return true;
    if (!this.signature) {
      throw new Error("No signature in this transaction.");
    }
    return Wallet.verifySignature(
      this.sender,
      this.calculateHash(),
      this.signature
    );
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

  static fromJSON(data: any): Transaction {
    return new Transaction(
      data.sender,
      data.receiver,
      data.amount,
      data.signature,
      data.timestamp
    );
  }
}

export default Transaction;

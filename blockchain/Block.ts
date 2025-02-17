import * as crypto from "crypto";

class Block {
  index: number;
  timestamp: string;
  transactions: object[];
  previousHash: string;
  hash: string;
  nonce: number;

  constructor(
    index: number,
    timestamp: string,
    transactions: object[],
    previousHash: string = ""
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
          this.previousHash +
          this.timestamp +
          JSON.stringify(this.transactions) +
          this.nonce
      )
      .digest("hex");
  }
}

export default Block;

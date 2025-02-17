import WebSocket, { WebSocketServer } from "ws";
import Blockchain from "../blockchain/Blockchain";
import Transaction from "../blockchain/Transaction";
import Block from "../blockchain/Block";

enum MessageType {
  CHAIN = "CHAIN",
  TRANSACTION = "TRANSACTION",
}

interface BroadcastMessage {
  type: MessageType;
  chain?: Block[];
  transaction?: Transaction;
}

class P2PNetwork {
  sockets: WebSocket[] = [];
  blockchain: Blockchain;

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain;
  }

  startServer(port: number): void {
    const server = new WebSocketServer({ port });
    console.log(`WebSocket server started on port ${port}`);

    server.on("connection", (socket) => {
      this.connectSocket(socket);
    });
  }

  connectToPeer(peer: string): void {
    const socket = new WebSocket(peer);

    socket.on("open", () => {
      console.log(`Connected to peer: ${peer}`);
      this.connectSocket(socket);
    });

    socket.on("error", (error) => {
      console.error(`Connection error with peer ${peer}: ${error.message}`);
    });
  }

  connectSocket(socket: WebSocket): void {
    this.sockets.push(socket);
    console.log("Socket connected");

    socket.on("message", (message) => {
      const data = JSON.parse(message.toString());
      this.handleMessage(data);
    });

    this.broadcastChain();
  }

  handleMessage(data: BroadcastMessage): void {
    switch (data.type) {
      case MessageType.CHAIN:
        this.handleChainSync(data.chain!);
        break;
      case MessageType.TRANSACTION:
        this.handleTransactionSync(data.transaction!);
        break;
      default:
        console.error("Unknown message type:", data.type);
    }
  }

  handleChainSync(chain: Block[]): void {
    if (
      this.blockchain.isChainValid() &&
      chain.length > this.blockchain.chain.length
    ) {
      console.log("Replacing blockchain with received chain");
      this.blockchain.chain = chain;
    } else {
      console.log(
        "Received chain is invalid or not longer than the current chain"
      );
    }
  }

  handleTransactionSync(transaction: Transaction): void {
    this.blockchain.addTransaction(transaction);
    console.log("Transaction added to the pool:", transaction);
  }

  broadcastChain(): void {
    this.broadcast({ type: MessageType.CHAIN, chain: this.blockchain.chain });
  }

  broadcastTransaction(transaction: Transaction): void {
    this.broadcast({ type: MessageType.TRANSACTION, transaction });
  }

  broadcast(message: BroadcastMessage): void {
    this.sockets.forEach((socket) => socket.send(JSON.stringify(message)));
    console.log(`Broadcated message: ${JSON.stringify(message)}`);
  }
}

export default P2PNetwork;

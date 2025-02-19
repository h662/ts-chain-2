import { Router } from "express";
import Blockchain from "../blockchain/Blockchain";

const router = Router();
const blockchain = new Blockchain();

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

export default router;

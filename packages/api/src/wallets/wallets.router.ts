/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as WalletService from "./wallets.service";
import { BaseWallet, Wallet } from "./wallet.interface";
import { checkJwt } from "../middleware/authz.middleware";
import { WalletPayload } from './wallets.service';

/**
 * Router Definition
 */

export const walletsRouter = express.Router();

walletsRouter.use(checkJwt);

const getCurrentUserId = (req: Request): string => {
  const user = <{ sub: string } | undefined>req.user;
  if (!user) throw Error("user not available");
  return user.sub;
};

/**
 * Controller Definitions
 */

// GET wallets
walletsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const userWallets = await WalletService.findAll(userId);
    
    res.status(200).send(userWallets);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

// GET wallets/:id
walletsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const id: number = parseInt(req.params.id, 10);
    const wallet: Wallet = await WalletService.find(userId, id);

    if (wallet) {
      return res.status(200).send(wallet);
    }

    res.status(404).send("wallet not found");
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

// POST wallets
walletsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const wallet: WalletPayload = req.body;
    const newWallet = await WalletService.create(userId, wallet);

    res.status(201).json(newWallet);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

// PUT wallets/:id
walletsRouter.put("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const userId = getCurrentUserId(req);
    const walletUpdate: WalletPayload = req.body;
    const updatedWallet = await WalletService.update(userId, id, walletUpdate);
    
    return res.status(202).json(updatedWallet);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

// DELETE wallets/:id
walletsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    const userId = getCurrentUserId(req);
    await WalletService.remove(userId, id);

    res.sendStatus(204);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

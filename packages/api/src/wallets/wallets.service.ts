/**
 * Data Model Interfaces
 */

import { getRepository } from "typeorm";
import { Wallet } from "../models";

export interface WalletPayload {
  address: string;
  name: string;
}

/**
 * Service Methods
 */

// export const getUserWallet = async (userId: string, id: number): Wallet =>
//   getRepository(Wallet).createQueryBuilder("wallet").where(`user_id = '${userId}'`).getOneOrFail();
export const findAll = async (userId: string): Promise<Wallet[]> =>
  getRepository(Wallet).createQueryBuilder("wallet").where(`user_id = '${userId}'`).getMany();

export const find = async (userId: string, id: number): Promise<Wallet> =>
  getRepository(Wallet).createQueryBuilder("wallet").where(`id = ${id} AND user_id = '${userId}'`).getOneOrFail();

export const create = async (userId: string, payload: WalletPayload): Promise<Wallet> => {
  const wallet = new Wallet();
  return getRepository(Wallet).save({ ...wallet, ...payload, user_id: userId });
};

export const update = async (
  userId: string,
  id: number,
  payload: WalletPayload
): Promise<Wallet | null> => {
  const wallet = await find(userId, id);
  
  if (payload.name) wallet.name = payload.name;
  if (payload.address) wallet.address = payload.address;
  
  const repo = getRepository(Wallet);
  await repo.update(id, wallet);
  return repo.findOneOrFail(id);
};

export const remove = async (userId: string, id: number): Promise<null | void> => {
  await find(userId, id);
  await getRepository(Wallet).delete(id);
};

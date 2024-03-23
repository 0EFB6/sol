// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey } from '@solana/web3.js';
import type { Bountify } from '../target/types/bountify';
import { IDL as BountifyIDL } from '../target/types/bountify';

// Re-export the generated IDL and type
export { Bountify, BountifyIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const BOUNTIFY_PROGRAM_ID = new PublicKey(
  'GV82BHGtQ3UaantPYTWkD3i4rVuerkHyDwq6rMKXURMC'
);

// This is a helper function to get the program ID for the Bountify program depending on the cluster.
export function getBountifyProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return BOUNTIFY_PROGRAM_ID;
  }
}

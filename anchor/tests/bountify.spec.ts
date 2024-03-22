import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { Bountify } from '../target/types/bountify';

describe('bountify', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Bountify as Program<Bountify>;

  const bountifyKeypair = Keypair.generate();

  it('Initialize Bountify', async () => {
    await program.methods
      .initialize()
      .accounts({
        bountify: bountifyKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([bountifyKeypair])
      .rpc();

    const currentCount = await program.account.bountify.fetch(
      bountifyKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment Bountify', async () => {
    await program.methods
      .increment()
      .accounts({ bountify: bountifyKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.bountify.fetch(
      bountifyKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment Bountify Again', async () => {
    await program.methods
      .increment()
      .accounts({ bountify: bountifyKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.bountify.fetch(
      bountifyKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement Bountify', async () => {
    await program.methods
      .decrement()
      .accounts({ bountify: bountifyKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.bountify.fetch(
      bountifyKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set bountify value', async () => {
    await program.methods
      .set(42)
      .accounts({ bountify: bountifyKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.bountify.fetch(
      bountifyKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the bountify account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        bountify: bountifyKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.bountify.fetchNullable(
      bountifyKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});

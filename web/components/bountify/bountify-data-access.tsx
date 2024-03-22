'use client';

import { BountifyIDL, getBountifyProgramId } from '@bountify/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useBountifyProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getBountifyProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = new Program(BountifyIDL, programId, provider);

  const accounts = useQuery({
    queryKey: ['bountify', 'all', { cluster }],
    queryFn: () => program.account.bountify.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['bountify', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ bountify: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useBountifyProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useBountifyProgram();

  const accountQuery = useQuery({
    queryKey: ['bountify', 'fetch', { cluster, account }],
    queryFn: () => program.account.bountify.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['bountify', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ bountify: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['bountify', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ bountify: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['bountify', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ bountify: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['bountify', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ bountify: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}

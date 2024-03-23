'use client';

import { Keypair, PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';
import { ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useCluster } from '../cluster/cluster-data-access';
import { AppModal } from '../ui/ui-layout';
import { useState } from 'react';
import {
  useBountifyProgram,
  useBountifyProgramAccount,
} from './bountify-data-access';

// import { ModalPost } from './bountify-post';

function ModalPost({
	hide,
	show,
	// address,
  }: {
	hide: () => void;
	show: boolean;
	// address: PublicKey;
  }) {
	// const mutation = useRequestAirdrop({ address });
	const [amount, setAmount] = useState('2');
  
	return (
	  <AppModal
		hide={hide}
		show={show}
		title="Create Job Post"
		// submitDisabled={!amount || mutation.isPending}
		submitLabel="Post Job"
		// submit={() => mutation.mutateAsync(parseFloat(amount)).then(() => hide())}
	  >
		<input
		  style={{ textAlign: 'left', paddingRight: '2rem', color: 'brown'}}
		//   disabled={mutation.isPending}
		  type="number"
		  step="any"
		  min="1"
		  placeholder="Amount"
		  className="input input-bordered w-full"
		  value={amount}
		  onChange={(e) => setAmount(e.target.value)}
		/>
	  </AppModal>
	);
  }

export function BountifyCreate() {
  const { initialize } = useBountifyProgram();
  const { cluster } = useCluster();
  const [showPostModal, setShowPostModal] = useState(false);

  return (
	<div className="space-x-2">
		<button
		className="btn btn-xs lg:btn-md btn-primary"
		onClick={() => initialize.mutateAsync(Keypair.generate())}
		disabled={initialize.isPending}
		>
		Create {initialize.isPending && '...'}
		</button>

		<ModalPost
			hide={() => setShowPostModal(false)}
			// address={address}
			show={showPostModal}
      	/>
		<button
          disabled={cluster.network?.includes('mainnet')}
          className="btn btn-xs lg:btn-md btn-outline"
          onClick={() => setShowPostModal(true)}
        >
          Create Job Post
        </button>

	</div>

  );
}

export function BountifyList() {
  const { accounts, getProgramAccount } = useBountifyProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <BountifyCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function BountifyCard({ account }: { account: PublicKey }) {
  const {
    accountQuery,
    incrementMutation,
    setMutation,
    decrementMutation,
    closeMutation,
  } = useBountifyProgramAccount({ account });

  const count = useMemo(
    () => accountQuery.data?.count ?? 0,
    [accountQuery.data?.count]
  );

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2
            className="card-title justify-center text-3xl cursor-pointer"
            onClick={() => accountQuery.refetch()}
          >
            {count}
          </h2>
          <div className="card-actions justify-around">
            <button
              className="btn btn-xs lg:btn-md btn-outline"
              onClick={() => incrementMutation.mutateAsync()}
              disabled={incrementMutation.isPending}
            >
              Increment
            </button>
            <button
              className="btn btn-xs lg:btn-md btn-outline"
              onClick={() => {
                const value = window.prompt(
                  'Set value to:',
                  count.toString() ?? '0'
                );
                if (
                  !value ||
                  parseInt(value) === count ||
                  isNaN(parseInt(value))
                ) {
                  return;
                }
                return setMutation.mutateAsync(parseInt(value));
              }}
              disabled={setMutation.isPending}
            >
              Set
            </button>
            <button
              className="btn btn-xs lg:btn-md btn-outline"
              onClick={() => decrementMutation.mutateAsync()}
              disabled={decrementMutation.isPending}
            >
              Decrement
            </button>
          </div>
          <div className="text-center space-y-4">
            <p>
              <ExplorerLink
                path={`account/${account}`}
                label={ellipsify(account.toString())}
              />
            </p>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                if (
                  !window.confirm(
                    'Are you sure you want to close this account?'
                  )
                ) {
                  return;
                }
                return closeMutation.mutateAsync();
              }}
              disabled={closeMutation.isPending}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
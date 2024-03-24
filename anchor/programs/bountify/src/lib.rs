#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::system_instruction::transfer;
use solana_program::program_error::ProgramError;

declare_id!("46ZHFftat4qgQ9DZaYNCX38mwFJu5UCgdd1xuaF7uck7");

#[program]
pub mod bountify {
    use super::*;

    pub fn close(_ctx: Context<CloseBountify>) -> Result<()> {
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.bountify.count = ctx.accounts.bountify.count.checked_sub(1).unwrap();
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.bountify.count = ctx.accounts.bountify.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn initialize(_ctx: Context<InitializeBountify>) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
        ctx.accounts.bountify.count = value;
        Ok(())
    }

    pub fn receivecash(ctx: Context<ReceiveCash>, amount: u64) -> ProgramResult {
        if *ctx.accounts.program_account.key != *ctx.accounts.user.key {
            return Err(ProgramError::Custom(1)); // Unauthorized access
        }

        // Transfer SOL from the program account to the user account
        let ix = transfer(&ctx.accounts.program_account.key(), &ctx.accounts.user.key, amount);
        anchor_lang::solana_program::program::invoke(&ix, &[
            ctx.accounts.program_account.clone(),
            ctx.accounts.user.clone(),
            ctx.accounts.system_program.clone()
        ])?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeBountify<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
    init,
    space = 8 + Bountify::INIT_SPACE,
    payer = payer
    )]
    pub bountify: Account<'info, Bountify>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseBountify<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
    mut,
    close = payer, // close account and return lamports to payer
    )]
    pub bountify: Account<'info, Bountify>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub bountify: Account<'info, Bountify>,
}

#[derive(Accounts)]
pub struct ReceiveCash<'info> {
    /// The user account receiving SOL tokens. This account must sign the transaction.
    #[account(mut, signer)]
    /// CHECK: The user account must be the same as the program account
    pub user: AccountInfo<'info>,
    /// The program account representing the source of SOL tokens to be transferred.
    #[account(mut)]
    /// CHECK: The user account must be the same as the program account
    pub program_account: AccountInfo<'info>,
    /// The System program account used for invoking the token transfer instruction.
    #[account(mut)]
    /// CHECK: The user account must be the same as the program account
    pub system_program: AccountInfo<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Bountify {
    count: u8,
}

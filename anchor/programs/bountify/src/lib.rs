#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("2idZ51svR36LuF5WNcZEvCUSP3cz4N432rMaTKNxM5Pn");

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
    ctx.accounts.bountify.count = value.clone();
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

#[account]
#[derive(InitSpace)]
pub struct Bountify {
  count: u8,
}

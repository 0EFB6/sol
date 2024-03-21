const anchor = require('@project-serum/anchor')
const {SystemProgram} = anchor.web3

const TestFunc = async () => 
{
    console.log("Starting test")
    const provider = anchor.Provider.env()
    console.log("Provider", provider)
    anchor.setProvider(provider)

    const program = anchor.workspace.Wilson

    const account = anchor.web3.Keypair.generate()

    let tx = await program.rpc.initialize({
        accounts: {
            initialAccount: account.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId
        },
        signers: [account]
    })
    console.log("Your transaction signature", tx)

    let fetchedValue = await program.account.init.fetch(account.publicKey)
    console.log("Fetched value", fetchedValue.value.toString())

    // const value = new anchor.BN(40)

    // let tx2 = await program.rpc.updateValue(value,
    //     {
    //         accounts: {
    //             initialAccount: account.publicKey
    //         }
    //     })
    // console.log("Your transaction signature", tx2)
    // let fetchedValue2 = await program.account.init.fetch(account.publicKey)
    // console.log("Fetched value 2: ", fetchedValue2.value.toString())
}

const runTest = async () =>
{
    try
    {
        await TestFunc()
        process.exit(0)
    }
    catch (err)
    {
        console.error(err)
        process.exit(1)
    }
}

runTest()
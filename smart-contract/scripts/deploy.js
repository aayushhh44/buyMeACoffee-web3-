const hre = require('hardhat');

async function main(){

        const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
        const buyMeACoffee = await BuyMeACoffee.deploy();
        await buyMeACoffee.waitForDeployment();
        console.log('Buy me a coffee has been deployed to', await buyMeACoffee.getAddress());
}

main().then(() => process.exit(0)).catch((error) =>{
    console.error(error);
    process.exit(1);
})
const hre = require("hardhat");

async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address); //waffle ==>> it uses the ether under the hood
  // return hre.ethers.utils.formatEther(balanceBigInt); //if you're using version then there is no need of using utils

  return hre.ethers.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Addresses ${idx} balance`, await getBalance(address));
    idx++;
  }
}

//logs the memos stored on-chain from coffee purchases
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) said: ${message}`
    );
  }
}

async function main() {
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.waitForDeployment();
  console.log(
    "BuyMeACoffee has been deployed to",
    await buyMeACoffee.getAddress()
  );

  //check balances before the coffee purchase

  //due to ether js update we cant use just .address but have to use .getAddress()
  // const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  const addresses = [
    owner.getAddress(),
    tipper.getAddress(),
    buyMeACoffee.getAddress(),
  ];
  console.log("=== start ===");
  await printBalances(addresses);

  //buy the owner a few coffee
  const tip = { value: hre.ethers.parseEther("1") };
  await buyMeACoffee
    .connect(tipper)
    .BuyCoffee("Aayush", "You're the best", tip);
  await buyMeACoffee
    .connect(tipper2)
    .BuyCoffee("Binit", "You're an amazing teacher :)", tip);
  await buyMeACoffee
    .connect(tipper3)
    .BuyCoffee("Riwaj", "You're doing great bro and I'm so proud of you", tip);

  //check balances after coffee purchase

  console.log("== Bought coffee ==");
  await printBalances(addresses);

  //withdraw tips
  console.log("== Withdrawing funds ==");

  await buyMeACoffee.connect(owner).withdrawTips();

  //checking balance after withdrawing tips

  console.log("==== Checking balance after withdrawing tips =====");

  await printBalances(addresses);

  //getting all the memos left for the owner

  console.log("*********** GETTING ALL THE MEMOS **************");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });

// async function main() {
//   const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
//   // const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
//   const buyMeACoffee = await ethers.deployContract("BuyMeACoffee");
//   // Deploy the contract.
//   await buyMeACoffee.waitForDeployment();
//   console.log("BuyMeACoffee deployed to:", buyMeACoffee.target);
//   console.log("5");
//   // Check balances before the coffee purchase.
//   const addresses = [owner.address, tipper.address, buyMeACoffee.address];
//   console.log("== start ==");
//   await printBalances(addresses);

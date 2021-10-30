var MessageStorage = artifacts.require("MessageStorage");

module.exports = async function (deployer) {
  try {
    await deployer.deploy(MessageStorage);
    const contract = await MessageStorage.deployed();
    console.log(`contract deployed to:"${contract.address}`);
  } catch (e) {
    console.error(e);
  }
};

const ProtoToken = artifacts.require("ProtoToken");

module.exports = function(deployer) {
  deployer.deploy(ProtoToken);
};

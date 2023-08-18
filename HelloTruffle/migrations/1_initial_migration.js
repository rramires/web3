const HelloTruffle = artifacts.require("HelloTruffle");

module.exports = function(deployer) {
  deployer.deploy(HelloTruffle);
};

var CrowdFunding = artifacts.require("./CrowdFunding.sol");

contract('CrowdFunding', function(accounts) {

  var account_one = accounts[0];
  var account_two = accounts[2];

    it("should create a new campaign", function() {
      return CrowdFunding.deployed().then(function(instance) {
        campaign = instance;
        return campaign.newCampaign.call(account_two, 2)
        .then(function (campaignID) {
          id = campaignID;
          return campaign.contribute(campaignID, {from: account_one, value: 1});
        })
        .then(function() {
          assert.equal(web3.eth.getBalance(campaign.address).toNumber(), 1, "Balance isn't 1 after one contribution of 1");
          return instance.checkGoalReached.call(id);
        })
        .then(function(reached) {
            assert.equal(reached, false, "Campaign with goal 2 is reached with 1");
        });
    });
  });
});

var CrowdFunding = artifacts.require("./CrowdFunding.sol");

contract('CrowdFunding', function(accounts) {

  var account_one = accounts[0];
  var account_two = accounts[2];
  var campaign;
  var id;

  it("should create a new campaign", function() {

  return CrowdFunding.deployed()
  .then(function(instance) {
    campaign = instance;
    return campaign.newCampaign(account_two, 2, {from: account_one});
  })
  .then(function(result) {
    // result is an object with the following values:
    //
    // result.tx      => transaction hash, string
    // result.logs    => array of decoded events that were triggered within this transaction
    // result.receipt => transaction receipt object, which includes gas used

    // We can loop through result.logs to see if we triggered the Transfer event.
    for (var i = 0; i < result.logs.length; i++) {
      var log = result.logs[i];

      if (log.event == "CampaignCreated") {
        // We found the event!
        console.log(log.args.campaignID.valueOf());
        id = log.args.campaignID.valueOf();
        break;
      }
    }
    return campaign.contribute(id, {from: account_one, value: 1});
  })
  .then(function(result) {
      assert.equal(web3.eth.getBalance(campaign.address).toNumber(), 1, "Balance isn't 1 after one contribution of 1");
      return campaign.checkGoalReached.call(id, {from: account_one});
  })
  .then(function(reached) {
      assert.equal(reached, false, "Campaign with goal 2 is reached with balance 1");
      return campaign.contribute(id, {from: account_one, value: 1});
  })
  .then(function(result) {
      assert.equal(web3.eth.getBalance(campaign.address).toNumber(), 2, "Balance isn't 2 after one contribution of 1");
      return campaign.checkGoalReached.call(id, {from: account_one});
  })
  .then(function(reached) {
        assert.equal(reached, true, "Campaign with goal 2 is not reached with balance 2");
  });
});
});

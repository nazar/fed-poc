const axios = require('axios');
const Bluebird = require('bluebird');

const Campaign = require('../../models/campaign');

const deleteCampaign = require('./deleteCampaign');

module.exports = function({ input }) {
  const { name, flightStartDate, flightEndDate, investment } = input;
  const { wsNumber, datoramaCampaignName, userShare } = input;

  const upstreamCampaign = { name, flightStartDate, flightEndDate, investment };
  const matchCampaign = { wsNumber, datoramaCampaignName, userShare };

  return Bluebird
    .resolve()
    .then(createCampaignUpstream)
    .then(createMatchCampaign)
    .tapCatch(deleteCampaignUpstream);

  // implementation

  function createCampaignUpstream() {
    return axios
      .post('http://gateway:4000/graphql', {
        query: 'mutation createCampaign($input: MutateCampaignInput!){ createCampaign(input: $input) { id } }',
        variables: { input: upstreamCampaign}
      })
      .then(({ data: { data: { createCampaign } } }) => createCampaign)
  }

  function createMatchCampaign(campaign) {
    return Campaign
      .query()
      .insert({
        id: campaign.id,
        ...matchCampaign
      })
      .returning('*')
  }

  function deleteCampaignUpstream(campaign) {
    if (campaign) {
      return deleteCampaign({ id: campaign.id });
    }
  }

};

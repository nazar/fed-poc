const axios = require('axios');
const Bluebird = require('bluebird');

const Campaign = require('../../models/campaign');

module.exports = function({ id, input }) {
  const { name, flightStartDate, flightEndDate, investment } = input;
  const { wsNumber, datoramaCampaignName, userShare } = input;

  const upstreamCampaign = { name, flightStartDate, flightEndDate, investment };
  const matchCampaign = { wsNumber, datoramaCampaignName, userShare };

  return Bluebird
    .resolve()
    .then(updateCampaignUpstream)
    .then(updateMatchCampaign);

  // implementation

  function updateCampaignUpstream() {
    return axios
      .post('http://gateway:4000/graphql', {
        query: 'mutation updateCampaign($id: ID!, $input: MutateCampaignInput!){ updateCampaign(id: $id, input: $input) { id } }',
        variables: { id, input: upstreamCampaign}
      })
      .then(({ data: { data: { updateCampaign } } }) => updateCampaign)
  }

  function updateMatchCampaign() {
    return Campaign
      .query()
      .patch(matchCampaign)
      .where({ id })
      .returning('*')
      .first()
  }

};

const axios = require('axios');

const Campaign = require('../../models/campaign');

module.exports = function deleteCampaign({ id }) {
  return axios
    .post('http://gateway:4000/graphql', {
      query: 'mutation deleteCampaign($id: ID!){ deleteCampaign(id: $id) { id } }',
      variables: { id }
    })
    .then(({ data: { data: { deleteCampaign } } }) => deleteCampaign)
    .then(() => Campaign
      .query()
      .delete()
      .where({ id })
      .returning('*')
      .first()
    )
};

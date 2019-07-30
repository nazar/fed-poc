const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { GraphQLDateTime } = require('graphql-iso-date');
const { Model } = require('objection');

const createCampaign = require('./services/campaigns/createCampaign');
const deleteCampaign = require('./services/campaigns/deleteCampaign');
const updateCampaign = require('./services/campaigns/updateCampaign');
const getCampaigns = require('./services/campaigns/getCampaigns');

const getOffers = require('./services/offers/getOffers');
const knex = require('./services/knex');

const loader = require('./loader');


Model.knex(knex);

const typeDefs = gql`
  extend type Mutation {
    createMatchCampaign(input: MutateMatchCampaignInput!): Campaign!
    updateMatchCampaign(id: ID!, input: MutateMatchCampaignInput!): Campaign!
    deleteMatchCampaign(id: ID!): Campaign!
  }

  extend type Query {
    matchCampaigns(filter: MatchCampaignFilterInput): [Campaign]
    offers: [Offer]
  }

  scalar GraphQLDateTime
  
  extend type Campaign @key(fields: "id") {
    id: ID! @external
    
    wsNumber: String
    datoramaCampaignName: String
    userShare: Boolean
  }
  
  type Offer @key(fields: "id") {
    id: ID!
    campaignId: ID!
    name: String!
    closed: Boolean
    
    Campaign: Campaign!
  }
  
  input MutateMatchCampaignInput {
    name: String!
    flightStartDate: GraphQLDateTime!
    flightEndDate: GraphQLDateTime!
    investment: Float!
    
    wsNumber: String
    datoramaCampaignName: String
    userShare: Boolean
  }
  
  input MatchCampaignFilterInput {
    hasOrders: Boolean
  }
`;

const resolvers = {
  Campaign: {
    __resolveReference: async (object, { loader }) => {
      return {
        ...object,
        ...(await loader.campaignsById.load(object.id))
      }
    }
  },
  Query: {
    matchCampaigns: async (obj, { filter }) => getCampaigns({ filter }),
    offers: async () => getOffers()
  },
  Mutation: {
    createMatchCampaign: async (obj, { input }) => createCampaign({ input }),
    deleteMatchCampaign: async (obj, { id }) => deleteCampaign({ id }),
    updateMatchCampaign: async (obj, { id, input }) => updateCampaign({ id, input })
  },
  GraphQLDateTime
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  context: ({ req }) => ({
    req,
    loader: loader(),
  }),
});

server.listen({ port: 3000 }).then(({ url }) => {
  console.log(`🚀 Match server ready at ${url}`);
});

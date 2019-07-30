const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { GraphQLDateTime } = require('graphql-iso-date');
const { Model } = require('objection');

const createCampaign = require('./services/campaigns/createCampaign');
const deleteCampaign = require('./services/campaigns/deleteCampaign');
const updateCampaign = require('./services/campaigns/updateCampaign');
const getCampaigns = require('./services/campaigns/getCampaigns');

const knex = require('./services/knex');

const loader = require('./loader');


Model.knex(knex);

const typeDefs = gql`
  extend type Query {
    # TODO - this might not work - see Campaign Required field Definitions in main README.md
    campaigns: [Campaign]
  }
  
  extend type Mutation {
    """create campaign - DO NOT CALL DIRECTLY - called by dependent services"""
    createCampaign(input: MutateCampaignInput!): Campaign!

    """update campaign - DO NOT CALL DIRECTLY - called by dependent services"""
    updateCampaign(id: ID!, input: MutateCampaignInput!): Campaign!

    """delete campaign - DO NOT CALL DIRECTLY - called by dependent services"""
    deleteCampaign(id: ID!): Campaign!
  }

  scalar GraphQLDateTime
  
  type Campaign @key(fields: "id") {
    id: ID!
    name: String!
    flightStartDate: GraphQLDateTime!
    flightEndDate: GraphQLDateTime!
    investment: Float!
  }
  
  input MutateCampaignInput {
    name: String!
    flightStartDate: GraphQLDateTime!
    flightEndDate: GraphQLDateTime!
    investment: Float!
  }
`;

const resolvers = {
  Campaign: {
    __resolveReference: async (object, { loader }) => loader.campaignsById.load(object.id)
  },
  Query: {
    campaigns: async () => getCampaigns()
  },
  Mutation: {
    createCampaign: async (obj, { input }) => createCampaign({ input }),
    updateCampaign: async (obj, { id, input }) => updateCampaign({ id, input }),
    deleteCampaign: async (obj, { id }) => deleteCampaign({ id })
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
  })
});

server.listen({ port: 3000 }).then(({ url }) => {
  console.log(`🚀 Campaigns server ready at ${url}`);
});

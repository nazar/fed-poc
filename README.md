# Apollo GraphQL Federation PoC

## Developer setup

1. Get [Docker](https://www.docker.com/get-started)
1. If you are on macOS, get [docker-sync](http://docker-sync.io/) for faster file
syncs and container IO. 
1. If using `docker-sync`, use `docker-sync start && docker-compose up` to start the local
development environment
1. run `./seed-db` 
1. Point your browser at http://localhost:3010

## Pure Docker Override

For a non `docker-sync` setup create the following `docker-compose.override.yml` file

```
version: '3'
services:
  # Campaigns micro-service
  campaigns:
    volumes:
      - ./campaigns:/app
      - /app/node_modules/

  # match service
  match:
    volumes:
      - ./match:/app
      - /app/node_modules/

  # the federation gateway
  gateway:
    volumes:
      - /app/node_modules/
      - ./gateway:/app
```

## Problems to Solve / Things that can be improved

### Campaigns Synching

[Creating](./match/src/services/campaigns/createCampaign.js) 
/ [updating](./match/src/services/campaigns/updateCampaign.js) 
/ [deleting](./match/src/services/campaigns/deleteCampaign.js) campaigns is a two step process, 
which can be brittle.

### Campaign Required field Definitions

We want to avoid creating a canonical `campaigns` datasource that could include required fields from
other services. For example, Match contains a required field `enableClientView` which might not be relevant nor available when
creating or editing a campaign in evoke/rockit. In this instance `enableClientView` can be solved as it is boolean
but other scalars cannot so easily be addressed.

At the same time, campaigns created in evoke/rockit will be missing any Match required fields so these rows will
thrown an error if Match queries the `campaigns` query. 

### Gateway Restarts
 
The gateway [needs to be restarted](https://spectrum.chat/apollo/apollo-federation/federated-schemas-changes-require-gateway-redeploy~4a839c03-4549-43df-975d-a6732c255707) 
whenever either the `campaigns` or `match` services are updated. 

### Custom Directives not supported

[This](https://spectrum.chat/apollo/apollo-federation/why-does-buildfederatedschema-ignore-custom-directives~1db147db-8395-4b1e-8ec1-3b687d405cf0) suggests
that the federation gateway doesn't support custom schemas yet. Match uses a number of custom directives.


// kU42CGRkqauFo99X7RKS2j

const query = (locationId) => `
  *[_type == 'productVariant' && "${locationId}" in locations[].location._ref] {
    store {
      // ...,
      gid,
    },
    "location": locations[] {
        "": location -> {
          name,
          countryCode,
          _id,
        },
          quantity,
    }[_id == "${locationId}"][0]
  }
  `;

export default query;

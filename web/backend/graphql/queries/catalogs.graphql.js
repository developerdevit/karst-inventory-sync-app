const GET_COMPANY_LOCATIONS_CATALOGS_QUERY = `
query CompanyLocationsCatalogs {
  companyLocations(first: 10) {
    nodes {
			id,
      name,
      currency,
      company {
        id,
        name,
        mainContact {
          company {
            id,
            name,
          }
        }
      }
    }
  }
}`;

const GET_SINGLE_COMPANY_LOCATION_CATALOGS_QUERY = `
query SingleCompanyLocationCatalogs($query: String!) {
  catalogs(first: 3, query: $query) {
    nodes {
      id
      title
      status
      priceList {
          currency,
      }
    }
  }
}`;

const GET_COMPANY_LOCATIONS_WITH_CATALOGS_QUERY = `
query CompanyLocationsCatalogs {
  companyLocations(first: 250) {
    nodes {
			id,
      name,
      company {
        id,
      }
      catalogs (first: 3) {
        nodes {
          id,
          title,
          status,
          priceList {
            currency
          }
        }
      }
    }
  }
}`;

const GET_CATALOGS_QUERY = `
query Catalogs {
	catalogs(first:150) {
		nodes {
        id,
        title,
        __typename,
        status,
        priceList {
          currency,
        }
      }
    
  }
}`;

export {
  GET_COMPANY_LOCATIONS_CATALOGS_QUERY,
  GET_CATALOGS_QUERY,
  GET_SINGLE_COMPANY_LOCATION_CATALOGS_QUERY,
  GET_COMPANY_LOCATIONS_WITH_CATALOGS_QUERY,
};

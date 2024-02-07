export type TSanityVariant = {
  store: {
    gid: string;
  };
  locations: {
    countryCode: string;
    stockCoverage: string[];
    _id: string;
    quantity: number;
  }[];
};

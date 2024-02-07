import { config } from '../config/sanity';

export async function fetchSanityVariantsByIds(ids: string[]) {
  try {
    const response = await fetch(
      `https://${config.projectId}.api.sanity.io/v${
        config.apiVersion
      }/data/query/production?query=*[store.gid in [${ids.join(
        ','
      )}]]{store {gid,},locations[] {"": location -> {countryCode,stockCoverage,_id,},quantity},}`
    );

    const data = await response.json();

    return data?.result;
  } catch (error) {
    console.log('fetchSanityVariant error: ', error);
    return [];
  }
}

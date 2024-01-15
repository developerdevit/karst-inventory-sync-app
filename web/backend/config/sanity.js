import { createClient } from '@sanity/client';
// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'

import {
  SANITY_DATASET,
  SANITY_API_TOKEN,
  SANITY_API_VERSION,
  SANITY_PROJECT_ID,
} from './vars/envs.js';

const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: SANITY_API_VERSION, // use current date (YYYY-MM-DD) to target the latest API version
  token: SANITY_API_TOKEN, // token: process.env.SANITY_SECRET_TOKEN // Only if you want to update content with the client
});

export default sanityClient;

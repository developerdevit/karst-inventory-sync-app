import logger from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  const session = res?.locals?.shopify?.session;

  console.log('!!! HERE errorHandler');

  if (session) {
    logger.error(err.message + ' ' + JSON.stringify(session, null, 2));
  }

  logger.error(err);
  res.status(err.status || 500).json({ error: err.message });
};

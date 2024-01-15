import PrivacyWebhookHandlers from './privacy.js';
import appWebhooks from './appWebhooks.js';

export const webhookHandlers = {
  ...PrivacyWebhookHandlers,
  ...appWebhooks,
};

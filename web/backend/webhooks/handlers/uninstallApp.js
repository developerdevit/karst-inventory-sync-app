export const uninstallApp = async (topic, shop, body) => {
  try {
    console.log('uninstallApp callback', shop);
  } catch (e) {
    console.log('uninstallApp callback error:', e);
  }
};

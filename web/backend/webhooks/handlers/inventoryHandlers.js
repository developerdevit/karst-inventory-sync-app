export const inventoryUpdate = async (topic, shop, body) => {
  try {
    console.log('inventoryUpdate callback', shop, topic);
    console.log('inventoryUpdate body', JSON.stringify(body, null, 2));
  } catch (e) {
    console.log('inventoryUpdate callback error:', e);
  }
};

export const inventoryCreate = async (topic, shop, body) => {
  try {
    console.log('inventoryCreate callback', shop, topic);
    console.log('inventoryCreate body', JSON.stringify(body, null, 2));
  } catch (e) {
    console.log('inventoryCreate callback error:', e);
  }
};

export const inventoryDelete = async (topic, shop, body) => {
  try {
    console.log('inventoryDelete callback', shop, topic);
    console.log('inventoryDelete body', JSON.stringify(body, null, 2));
  } catch (e) {
    console.log('inventoryDelete callback error:', e);
  }
};

export const inventoryLevelsUpdate = async (topic, shop, body) => {
  try {
    console.log('inventoryLevelsUpdate callback', shop, topic);
    console.log('inventoryLevelsUpdate body', JSON.stringify(body, null, 2));
  } catch (e) {
    console.log('inventoryLevelsUpdate callback error:', e);
  }
};

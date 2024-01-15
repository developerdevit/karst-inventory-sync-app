export const locationsUpdate = async (topic, shop, body) => {
  try {
    console.log('locationsUpdate callback', shop, topic);
    console.log('locationsUpdate body', JSON.stringify(body, null, 2));
  } catch (e) {
    console.log('locationsUpdate callback error:', e);
  }
};

export const locationsCreate = async (topic, shop, body) => {
  try {
    console.log('locationsCreate callback', shop, topic);
    console.log('locationsCreate body', JSON.stringify(body, null, 2));
  } catch (e) {
    console.log('locationsCreate callback error:', e);
  }
};

export const locationsDelete = async (topic, shop, body) => {
  try {
    console.log('locationsDelete callback', shop, topic);
    console.log('locationsDelete body', JSON.stringify(body, null, 2));
  } catch (e) {
    console.log('locationsDelete callback error:', e);
  }
};

export const locationsActivate = async (topic, shop, body) => {
  try {
    console.log('locationsActivate callback', shop, topic);
    console.log('locationsActivate body', JSON.stringify(body, null, 2));
  } catch (e) {
    console.log('locationsActivate callback error:', e);
  }
};

export const locationsDeactivate = async (topic, shop, body) => {
  try {
    console.log('locationsDeactivate callback', shop, topic);
    console.log('locationsDeactivate body', JSON.stringify(body, null, 2));
  } catch (e) {
    console.log('locationsDeactivate callback error:', e);
  }
};

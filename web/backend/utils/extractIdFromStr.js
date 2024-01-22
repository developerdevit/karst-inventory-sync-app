export function extractIdFromStr(data = null, idField = 'inventory_item_id') {
  const idStr = data?.[idField];
  const idIdx = idStr?.lastIndexOf('/');

  if (idIdx === -1) {
    return null;
  }

  return data?.[idField]?.slice(idIdx + 1);
}

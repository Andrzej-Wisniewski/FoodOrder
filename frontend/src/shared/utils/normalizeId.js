export function normalizeId(entity) {
  if (!entity || typeof entity !== 'object') return entity;
  return {
    ...entity,
    id: entity.id || entity._id,
  };
}

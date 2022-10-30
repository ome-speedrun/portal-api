export const RoleTypes = {
  administrator: 'administrator',
} as const;

export type RoleType = typeof RoleTypes[keyof typeof RoleTypes];

export const isRoleType = (v: string): v is RoleType => {
  return Object.values(RoleTypes as {[key: string]: string}).includes(v);
};

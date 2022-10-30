import { UserId } from '@domain/types';
import { RoleType } from './roles';

export type UserRole = {
  userId: UserId;
  type: RoleType;
};

export const makeUserRole = (userId: UserId, type: RoleType) => {
  return {
    userId,
    type,
  };
};
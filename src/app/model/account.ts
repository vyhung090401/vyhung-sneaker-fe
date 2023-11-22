export interface Account {
  id?: number;

  username: string;

  phone: string;

  active: boolean;

  notLocked: boolean;

  roles: Role[];
}
export interface UserInfo {
  id?: number;
  username?: string;
  phone?: string;
  roles?: string[];
  birthday?: Date|'yyy-MM-dd';
  address?: string;
  gender?: string;
}

export interface Role {
  name: string
}

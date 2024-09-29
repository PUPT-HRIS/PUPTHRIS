export interface Role {
  RoleID: number;
  RoleName: string;
}

export enum RoleName {
  Faculty = 'faculty',
  Staff = 'staff',
  Admin = 'admin',
  SuperAdmin = 'superadmin'
}
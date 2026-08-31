export interface UserModel {
  id: number;
  username: string;
  email: string;
  role: 'user'|'admin'|'superadmin';
  is_deleted: boolean;
  created_at?: string;
  updated_at?:string;
}

export interface IUser {
  email: string
  password: string
  display_name: string
  avatar_url?: string
  role: 'user' | 'admin'
  is_suspended: boolean
}
export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface DbSession {
  id: string;
  token: string;
  user_id: string;
  expires_at: Date;
  created_at: Date;
}


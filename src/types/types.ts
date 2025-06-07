
export interface User {
  uid: string;
  email: string;
  username: string;
  createdAt: Date;
}

export interface Task {
  id?: string;
  titulo: string;
  descripcion: string;
  status: 'pending' | 'completed';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthError {
  code: string;
  message: string;
}
export interface User {
  id: string
  email: string
  name: string
}

export interface AuthToken {
  token: string
  expiresAt: string
}

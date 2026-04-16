export interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  createdAt: string;
}

export interface MeResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    plan: string;
  };
}

import { Lock, Mail, User } from 'lucide-react';

export const REGISTER_FIELDS = [
  { name: 'name', type: 'text', icon: User },
  { name: 'email', type: 'email', icon: Mail },
  { name: 'password', type: 'password', icon: Lock },
  { name: 'confirmPassword', type: 'password', icon: Lock },
] as const;

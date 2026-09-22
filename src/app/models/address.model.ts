export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  label?: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
  createdAt?: string;
}

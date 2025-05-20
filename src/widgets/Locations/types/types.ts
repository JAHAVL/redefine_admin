export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LocationViewMode = 'grid' | 'table';

export interface LocationFilters {
  city?: string;
  state?: string;
  status?: string;
  isActive?: boolean;
  searchTerm?: string;
  [key: string]: string | boolean | undefined;
}

export interface LocationFormData {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
    phone: string;
    email: string;
    website: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
}

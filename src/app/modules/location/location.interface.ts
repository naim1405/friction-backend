export type ILocationFilters = {
  searchTerm?: string;
  name?: string;
  address?: string;
  city?: string;
};

export type ICreateLocationPayload = {
  name: string;
  address?: string;
  city?: string;
  country?: string;
  latitude: number;
  longitude: number;
  type?: string;
  officeHours?: string;
};

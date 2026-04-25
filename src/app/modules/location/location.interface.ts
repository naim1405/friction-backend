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
  source?: string;
  sourcePlaceId?: string;
  latitude: number;
  longitude: number;
  type?: string;
  officeHours?: string;
};

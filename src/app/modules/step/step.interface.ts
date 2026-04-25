import type { ICreateLocationPayload } from '../location/location.interface';

export type ICreateStepPayload = {
  taskId: string;
  title: string;
  description?: string;
  order: number;
  estimatedTime?: string;
  estimatedCost?: number;
  documents?: string[];
  tips?: string[];
  contributionLocked?: boolean;
  locationId?: string | null;
  location?: ICreateLocationPayload;
};

export type IUpdateStepPayload = {
  title?: string;
  description?: string;
  order?: number;
  estimatedTime?: string;
  estimatedCost?: number;
  documents?: string[];
  tips?: string[];
  contributionLocked?: boolean;
  locationId?: string | null;
  location?: ICreateLocationPayload;
};

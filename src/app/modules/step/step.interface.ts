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
  locationId?: string;
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
  locationId?: string;
};

export type ITaskFilters = {
  searchTerm?: string;
  slug?: string;
  title?: string;
  category?: string;
  isPublished?: string | boolean;
};

export type ITaskStepPayload = {
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

export type ICreateTaskPayload = {
  slug?: string;
  title: string;
  tagline?: string;
  description?: string;
  summary?: string;
  category?: string;
  estimatedDays?: string;
  estimatedCostBdt?: number;
  difficulty?: string;
  documents?: string[];
  aiSummary?: string;
  communityTip?: string;
  coverLabel?: string;
  isPublished?: boolean;
  steps?: ITaskStepPayload[];
};

export type IUpdateTaskPayload = {
  slug?: string;
  title?: string;
  tagline?: string;
  description?: string;
  summary?: string;
  category?: string;
  estimatedDays?: string;
  estimatedCostBdt?: number;
  difficulty?: string;
  documents?: string[];
  aiSummary?: string;
  communityTip?: string;
  coverLabel?: string;
  isPublished?: boolean;
};

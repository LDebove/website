export interface MetaData {
  timestamp: string;
  status: number;
  error?: string;
  message?: string;
};

export interface ApiResponse {
  data?: any;
  meta: MetaData;
};

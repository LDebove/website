export interface MetaData {
  timestamp: string;
  status: number;
  path: string;
  method: string;
  error?: string;
  message?: string;
};

export interface ApiResponse {
  data?: any;
  meta: MetaData;
};

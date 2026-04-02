export interface UserQueryOptions{
    data?: {
      email?: string;
      emailVerified?: boolean;
      role?: string;
      status?: string;
      phone?: string;
    };
    isactivequery: boolean;
    page?: number;
    limit?: number;
    skip?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };
  
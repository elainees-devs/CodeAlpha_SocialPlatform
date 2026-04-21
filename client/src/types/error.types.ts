// src/types/error.types.ts
import { AxiosError } from "axios";

export interface BackendErrorResponse {
  success: boolean;
  message: string;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

export type Error = AxiosError<BackendErrorResponse>;
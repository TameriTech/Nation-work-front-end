// src/app/types/common/api.ts
import { z } from 'zod';
import { PaginatedResponse } from './pagination';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  withCredentials?: boolean;
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  authenticated: boolean;
  roles?: string[];
}


export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) => {
  return z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    statusCode: z.number().optional()
  });
};

export const FileUploadResponseSchema = z.object({
  success: z.boolean(),
  fileUrl: z.string().url(),
  filePath: z.string(),
  mediaType: z.string(),
  originalFilename: z.string(),
  fileSize: z.number(),
  fileExt: z.string(),
  messageId: z.number().optional()
});

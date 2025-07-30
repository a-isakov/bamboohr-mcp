import { z } from 'zod';

export const dateSchema = () =>
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const envSchema = z.object({
  BAMBOOHR_SUBDOMAIN: z.string().min(1, 'BAMBOOHR_SUBDOMAIN is required'),
  BAMBOOHR_API_KEY: z.string().min(1, 'BAMBOOHR_API_KEY is required'),
});

export type Env = z.infer<typeof envSchema>;

export const getEmployeesSchema = z.object({
  fields: z.string().optional().describe('Comma-separated list of fields to include'),
});

export const getEmployeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  fields: z.string().optional().describe('Comma-separated list of fields to include'),
});

export const updateEmployeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  data: z.record(z.any()).describe('Employee data to update'),
});

export const getTimeOffRequestsSchema = z.object({
  startDate: dateSchema(),
  endDate: dateSchema(),
  employeeId: z.string().optional(),
  status: z.enum(['approved', 'denied', 'pending', 'canceled', 'all']).optional(),
  type: z.string().optional(),
});

export const createTimeOffRequestSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  startDate: dateSchema(),
  endDate: dateSchema(),
  timeOffTypeId: z.string().min(1, 'Time off type ID is required'),
  amount: z.number().positive('Amount must be positive'),
  notes: z.string().optional(),
});

export const getDepartmentsSchema = z.object({
  includeEmployees: z.boolean().optional().default(false),
});

export const getCompanyReportSchema = z.object({
  reportId: z.string().min(1, 'Report ID is required'),
  format: z.enum(['json', 'csv', 'xml']).optional().default('json'),
  fields: z.string().optional(),
});

export const getCustomFieldsSchema = z.object({
  type: z.enum(['employee', 'company', 'all']).optional().default('all'),
});

export const getEmployeeFilesSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  categoryId: z.string().optional(),
});

export const getWhosOutSchema = z.object({
  startDate: dateSchema()
    .optional()
    .describe('Start date in YYYY-MM-DD format (defaults to current date)'),
  endDate: dateSchema()
    .optional()
    .describe('End date in YYYY-MM-DD format (defaults to 14 days from start date)'),
});

export interface ToolResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  department?: string;
  jobTitle?: string;
  status?: string;
  hireDate?: string;
  [key: string]: any;
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  amount: number;
  notes?: string;
}

export interface Department {
  id: string;
  name: string;
  employees?: Employee[];
}

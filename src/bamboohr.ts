import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import config from './config.js';
import { Employee, TimeOffRequest, Department } from './types.js';

const api = axios.create({
  baseURL: config.bambooHRApi.baseUrl,
  auth: {
    username: config.bambooHRApi.apiKey,
    password: 'x',
  },
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export async function getEmployees(_fields?: string[]): Promise<Employee[]> {
  try {
    const response = await api.get('/employees/directory', {
      headers: {
        Accept: 'application/json',
      },
    });

    const employees = response.data.employees || [];

    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

export async function getEmployee(employeeId: string, fields?: string[]): Promise<Employee> {
  try {
    const fieldsParam = fields ? `?fields=${fields.join(',')}` : '';
    const response = await api.get(`/employees/${employeeId}${fieldsParam}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee ${employeeId}:`, error);
    throw error;
  }
}

export async function updateEmployee(employeeId: string, data: any): Promise<Employee> {
  try {
    const response = await api.post(`/employees/${employeeId}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating employee ${employeeId}:`, error);
    throw error;
  }
}

export async function getTimeOffRequests(
  startDate: string,
  endDate: string,
  employeeId?: string,
  status?: string,
  type?: string,
): Promise<TimeOffRequest[]> {
  try {
    const params: any = {
      start: startDate,
      end: endDate,
    };

    if (employeeId) params.employeeId = employeeId;
    if (status && status !== 'all') params.status = status;
    if (type) params.type = type;

    const response = await api.get('/time_off/requests', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching time off requests:', error);
    throw error;
  }
}

export async function createTimeOffRequest(
  employeeId: string,
  startDate: string,
  endDate: string,
  timeOffTypeId: string,
  amount: number,
  notes?: string,
): Promise<TimeOffRequest> {
  try {
    const data: any = {
      employeeId,
      start: startDate,
      end: endDate,
      timeOffTypeId,
      amount,
    };

    if (notes) data.notes = notes;

    const response = await api.post(`/employees/${employeeId}/time_off/request`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating time off request:', error);
    throw error;
  }
}

export async function getDepartments(includeEmployees: boolean = false): Promise<Department[]> {
  try {
    const response = await api.get('/meta/departments');
    const departments = response.data;

    if (includeEmployees) {
      const employees = await getEmployees();
      return departments.map((dept: any) => ({
        ...dept,
        employees: employees.filter((emp) => emp.department === dept.name),
      }));
    }

    return departments;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
}

export async function getCompanyReport(
  reportId: string,
  format: string = 'json',
  fields?: string,
): Promise<any> {
  try {
    const params: any = { format };
    if (fields) params.fields = fields;

    const response = await api.get(`/reports/${reportId}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching report ${reportId}:`, error);
    throw error;
  }
}

export async function getCustomFields(type: string = 'all'): Promise<any[]> {
  try {
    const endpoint = type === 'all' ? '/meta/fields' : `/meta/fields/${type}`;
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching custom fields:', error);
    throw error;
  }
}

export async function getEmployeeFiles(employeeId: string, categoryId?: string): Promise<any[]> {
  try {
    const params = categoryId ? { category: categoryId } : {};
    const response = await api.get(`/employees/${employeeId}/files/view`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching files for employee ${employeeId}:`, error);
    throw error;
  }
}

export async function getWhosOut(startDate?: string, endDate?: string): Promise<any> {
  try {
    const params: any = {};
    if (startDate) params.start = startDate;
    if (endDate) params.end = endDate;

    const response = await api.get('/time_off/whos_out', {
      params,
      headers: {
        Accept: 'application/xml',
      },
    });

    // Parse XML response
    const parsed = await parseStringPromise(response.data, {
      explicitArray: false,
      ignoreAttrs: false,
    });

    // Extract calendar items
    const calendar = parsed.calendar;
    if (!calendar || !calendar.item) {
      return [];
    }

    // Ensure items is always an array
    const items = Array.isArray(calendar.item) ? calendar.item : [calendar.item];

    // Transform items to a more usable format
    return items.map((item: any) => ({
      type: item.$.type,
      employeeId: item.employee?.$.id,
      employeeName: item.employee?._,
      start: item.start,
      end: item.end,
      holidayName: item.holiday, // For company holidays
    }));
  } catch (error) {
    console.error('Error fetching whos out data:', error);
    throw error;
  }
}

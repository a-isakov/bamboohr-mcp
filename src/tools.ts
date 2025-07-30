import * as bamboohr from './bamboohr.js';
import { ToolResponse } from './types.js';
import {
  formatError,
  formatEmployeeInfo,
  formatTimeOffRequest,
  parseFields,
  formatWhosOutItem,
} from './utils.js';

export async function getEmployees(
  fields?: string,
  limit?: number,
  filter?: any,
): Promise<ToolResponse> {
  try {
    const fieldArray = parseFields(fields);
    const employees = await bamboohr.getEmployees(fieldArray, filter);

    const limitedEmployees = limit ? employees.slice(0, limit) : employees;

    if (limitedEmployees.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No employees found matching the criteria.',
          },
        ],
      };
    }

    const formattedContent = limitedEmployees
      .map((emp) => formatEmployeeInfo(emp))
      .join('\n\n---\n\n');

    return {
      content: [
        {
          type: 'text',
          text: `Found ${limitedEmployees.length} employee(s):\n\n${formattedContent}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error fetching employees: ${formatError(error)}`,
        },
      ],
    };
  }
}

export async function getEmployee(employeeId: string, fields?: string): Promise<ToolResponse> {
  try {
    const fieldArray = parseFields(fields);
    const employee = await bamboohr.getEmployee(employeeId, fieldArray);

    return {
      content: [
        {
          type: 'text',
          text: formatEmployeeInfo(employee),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error fetching employee: ${formatError(error)}`,
        },
      ],
    };
  }
}

export async function updateEmployee(employeeId: string, data: any): Promise<ToolResponse> {
  try {
    const updatedEmployee = await bamboohr.updateEmployee(employeeId, data);

    return {
      content: [
        {
          type: 'text',
          text: `Employee ${employeeId} updated successfully:\n\n${formatEmployeeInfo(updatedEmployee)}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error updating employee: ${formatError(error)}`,
        },
      ],
    };
  }
}

export async function getTimeOffRequests(
  startDate: string,
  endDate: string,
  employeeId?: string,
  status?: string,
  type?: string,
): Promise<ToolResponse> {
  try {
    const requests = await bamboohr.getTimeOffRequests(
      startDate,
      endDate,
      employeeId,
      status,
      type,
    );

    if (requests.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No time off requests found for the specified criteria.',
          },
        ],
      };
    }

    const formattedContent = requests.map((req) => formatTimeOffRequest(req)).join('\n\n---\n\n');

    return {
      content: [
        {
          type: 'text',
          text: `Found ${requests.length} time off request(s):\n\n${formattedContent}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error fetching time off requests: ${formatError(error)}`,
        },
      ],
    };
  }
}

export async function createTimeOffRequest(
  employeeId: string,
  startDate: string,
  endDate: string,
  timeOffTypeId: string,
  amount: number,
  notes?: string,
): Promise<ToolResponse> {
  try {
    const request = await bamboohr.createTimeOffRequest(
      employeeId,
      startDate,
      endDate,
      timeOffTypeId,
      amount,
      notes,
    );

    return {
      content: [
        {
          type: 'text',
          text: `Time off request created successfully:\n\n${formatTimeOffRequest(request)}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error creating time off request: ${formatError(error)}`,
        },
      ],
    };
  }
}

export async function getDepartments(includeEmployees: boolean = false): Promise<ToolResponse> {
  try {
    const departments = await bamboohr.getDepartments(includeEmployees);

    if (departments.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No departments found.',
          },
        ],
      };
    }

    const formattedContent = departments
      .map((dept) => {
        let text = `Department: ${dept.name} (ID: ${dept.id})`;
        if (includeEmployees && dept.employees) {
          text += `\nEmployees: ${dept.employees.length}`;
        }
        return text;
      })
      .join('\n\n');

    return {
      content: [
        {
          type: 'text',
          text: `Found ${departments.length} department(s):\n\n${formattedContent}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error fetching departments: ${formatError(error)}`,
        },
      ],
    };
  }
}

export async function getCompanyReport(
  reportId: string,
  format: string = 'json',
  fields?: string,
): Promise<ToolResponse> {
  try {
    const report = await bamboohr.getCompanyReport(reportId, format, fields);

    const reportText = typeof report === 'string' ? report : JSON.stringify(report, null, 2);

    return {
      content: [
        {
          type: 'text',
          text: `Report ${reportId} (${format} format):\n\n${reportText}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error fetching report: ${formatError(error)}`,
        },
      ],
    };
  }
}

export async function getCustomFields(type: string = 'all'): Promise<ToolResponse> {
  try {
    const fields = await bamboohr.getCustomFields(type);

    if (fields.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No custom fields found.',
          },
        ],
      };
    }

    const formattedContent = fields
      .map((field) => `Field: ${field.name} (ID: ${field.id}, Type: ${field.type})`)
      .join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Found ${fields.length} custom field(s):\n\n${formattedContent}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error fetching custom fields: ${formatError(error)}`,
        },
      ],
    };
  }
}

export async function getEmployeeFiles(
  employeeId: string,
  categoryId?: string,
): Promise<ToolResponse> {
  try {
    const files = await bamboohr.getEmployeeFiles(employeeId, categoryId);

    if (files.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No files found for this employee.',
          },
        ],
      };
    }

    const formattedContent = files
      .map((file) => `File: ${file.name} (ID: ${file.id}, Category: ${file.category})`)
      .join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Found ${files.length} file(s):\n\n${formattedContent}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error fetching employee files: ${formatError(error)}`,
        },
      ],
    };
  }
}

export async function getWhosOut(startDate?: string, endDate?: string): Promise<ToolResponse> {
  try {
    const items = await bamboohr.getWhosOut(startDate, endDate);

    if (items.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No employees are out and no holidays are scheduled for the specified period.',
          },
        ],
      };
    }

    const formattedContent = items.map((item: any) => formatWhosOutItem(item)).join('\n\n---\n\n');

    return {
      content: [
        {
          type: 'text',
          text: `Found ${items.length} time off/holiday item(s):\n\n${formattedContent}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error fetching who's out data: ${formatError(error)}`,
        },
      ],
    };
  }
}

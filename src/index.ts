#!/usr/bin/env node
/**
 * BambooHR MCP Server
 *
 * A Model Context Protocol server for managing BambooHR data with TypeScript.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import config from './config.js';
import * as tools from './tools.js';
import {
  getEmployeesSchema,
  getEmployeeSchema,
  updateEmployeeSchema,
  getTimeOffRequestsSchema,
  createTimeOffRequestSchema,
  getDepartmentsSchema,
  getCompanyReportSchema,
  getCustomFieldsSchema,
  getEmployeeFilesSchema,
  getWhosOutSchema,
} from './types.js';

const server = new McpServer({
  name: config.server.name,
  version: config.server.version,
});

server.tool('getEmployees', getEmployeesSchema.shape, async ({ fields }) => {
  try {
    const result = await tools.getEmployees(fields);
    return {
      content: result.content,
    };
  } catch (error) {
    console.error(
      `[ERROR] getEmployees failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {
      content: [
        {
          type: 'text',
          text: `Error retrieving employees: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

server.tool('getEmployee', getEmployeeSchema.shape, async ({ employeeId, fields }) => {
  try {
    const result = await tools.getEmployee(employeeId, fields);
    return {
      content: result.content,
    };
  } catch (error) {
    console.error(
      `[ERROR] getEmployee failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {
      content: [
        {
          type: 'text',
          text: `Error retrieving employee: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

server.tool('updateEmployee', updateEmployeeSchema.shape, async ({ employeeId, data }) => {
  try {
    const result = await tools.updateEmployee(employeeId, data);
    return {
      content: result.content,
    };
  } catch (error) {
    console.error(
      `[ERROR] updateEmployee failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {
      content: [
        {
          type: 'text',
          text: `Error updating employee: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

server.tool(
  'getTimeOffRequests',
  getTimeOffRequestsSchema.shape,
  async ({ startDate, endDate, employeeId, status, type }) => {
    try {
      const result = await tools.getTimeOffRequests(startDate, endDate, employeeId, status, type);
      return {
        content: result.content,
      };
    } catch (error) {
      console.error(
        `[ERROR] getTimeOffRequests failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      return {
        content: [
          {
            type: 'text',
            text: `Error retrieving time off requests: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  'createTimeOffRequest',
  createTimeOffRequestSchema.shape,
  async ({ employeeId, startDate, endDate, timeOffTypeId, amount, notes }) => {
    try {
      const result = await tools.createTimeOffRequest(
        employeeId,
        startDate,
        endDate,
        timeOffTypeId,
        amount,
        notes,
      );
      return {
        content: result.content,
      };
    } catch (error) {
      console.error(
        `[ERROR] createTimeOffRequest failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      return {
        content: [
          {
            type: 'text',
            text: `Error creating time off request: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool('getDepartments', getDepartmentsSchema.shape, async ({ includeEmployees }) => {
  try {
    const result = await tools.getDepartments(includeEmployees);
    return {
      content: result.content,
    };
  } catch (error) {
    console.error(
      `[ERROR] getDepartments failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {
      content: [
        {
          type: 'text',
          text: `Error retrieving departments: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

server.tool(
  'getCompanyReport',
  getCompanyReportSchema.shape,
  async ({ reportId, format, fields }) => {
    try {
      const result = await tools.getCompanyReport(reportId, format, fields);
      return {
        content: result.content,
      };
    } catch (error) {
      console.error(
        `[ERROR] getCompanyReport failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      return {
        content: [
          {
            type: 'text',
            text: `Error retrieving report: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool('getCustomFields', getCustomFieldsSchema.shape, async ({ type }) => {
  try {
    const result = await tools.getCustomFields(type);
    return {
      content: result.content,
    };
  } catch (error) {
    console.error(
      `[ERROR] getCustomFields failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {
      content: [
        {
          type: 'text',
          text: `Error retrieving custom fields: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

server.tool(
  'getEmployeeFiles',
  getEmployeeFilesSchema.shape,
  async ({ employeeId, categoryId }) => {
    try {
      const result = await tools.getEmployeeFiles(employeeId, categoryId);
      return {
        content: result.content,
      };
    } catch (error) {
      console.error(
        `[ERROR] getEmployeeFiles failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      return {
        content: [
          {
            type: 'text',
            text: `Error retrieving employee files: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.tool('getWhosOut', getWhosOutSchema.shape, async ({ startDate, endDate }) => {
  try {
    const result = await tools.getWhosOut(startDate, endDate);
    return {
      content: result.content,
    };
  } catch (error) {
    console.error(
      `[ERROR] getWhosOut failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {
      content: [
        {
          type: 'text',
          text: `Error retrieving who's out data: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function startServer(): Promise<void> {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('[INFO] BambooHR MCP Server started successfully');
  } catch (error) {
    console.error(
      `[ERROR] Failed to start MCP Server: ${error instanceof Error ? error.message : String(error)}`,
    );

    if (error instanceof Error && error.stack) {
      console.error(`[ERROR] Stack trace: ${error.stack}`);
    }

    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error(
    `[ERROR] Unhandled exception: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});

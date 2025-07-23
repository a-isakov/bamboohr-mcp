# BambooHR MCP Server

A Model Context Protocol (MCP) server for interacting with BambooHR API.

## Features

- Get employees (with filtering by department, status)
- Get individual employee details
- Update employee information
- Manage time off requests
- Get departments information
- Access company reports
- Manage custom fields
- Access employee files

## Installation

```bash
npm install
npm run build
```

## Configuration

Set the following environment variables:

- `BAMBOOHR_SUBDOMAIN`: Your BambooHR subdomain
- `BAMBOOHR_API_KEY`: Your BambooHR API key

## Usage with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "bamboohr": {
      "command": "node",
      "args": ["/path/to/bamboohr-mcp/build/index.js"],
      "env": {
        "BAMBOOHR_SUBDOMAIN": "your-subdomain",
        "BAMBOOHR_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Available Tools

- `getEmployees` - List all employees with optional filtering
- `getEmployee` - Get details for a specific employee
- `updateEmployee` - Update employee information
- `getTimeOffRequests` - Get time off requests within date range
- `createTimeOffRequest` - Create a new time off request
- `getDepartments` - List all departments
- `getCompanyReport` - Get a company report
- `getCustomFields` - List custom fields
- `getEmployeeFiles` - Get files for an employee

## Development

```bash
npm run dev
```

## License

MIT

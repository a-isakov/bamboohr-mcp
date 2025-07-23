export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function formatEmployeeInfo(employee: any): string {
  const fields = [];

  fields.push(`ID: ${employee.id}`);
  fields.push(`Name: ${employee.firstName} ${employee.lastName}`);

  if (employee.email) fields.push(`Email: ${employee.email}`);
  if (employee.department) fields.push(`Department: ${employee.department}`);
  if (employee.jobTitle) fields.push(`Job Title: ${employee.jobTitle}`);
  if (employee.status) fields.push(`Status: ${employee.status}`);
  if (employee.hireDate) fields.push(`Hire Date: ${employee.hireDate}`);

  return fields.join('\n');
}

export function formatTimeOffRequest(request: any): string {
  const fields = [];

  fields.push(`Request ID: ${request.id}`);
  fields.push(`Employee ID: ${request.employeeId}`);
  fields.push(`Dates: ${request.startDate} to ${request.endDate}`);
  fields.push(`Type: ${request.type}`);
  fields.push(`Status: ${request.status}`);
  fields.push(`Amount: ${request.amount} days`);

  if (request.notes) fields.push(`Notes: ${request.notes}`);

  return fields.join('\n');
}

export function parseFields(fieldsString?: string): string[] | undefined {
  if (!fieldsString) return undefined;
  return fieldsString.split(',').map((field) => field.trim());
}

export function formatWhosOutItem(item: any): string {
  const fields = [];

  if (item.type === 'holiday') {
    fields.push(`Type: Company Holiday`);
    fields.push(`Holiday: ${item.holidayName}`);
    fields.push(`Date: ${item.start}`);
  } else {
    fields.push(`Type: Time Off`);
    fields.push(`Employee: ${item.employeeName} (ID: ${item.employeeId})`);
    fields.push(`Dates: ${item.start} to ${item.end}`);
  }

  return fields.join('\n');
}

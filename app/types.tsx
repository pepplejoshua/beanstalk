export type AuthenticatedUser = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  company_role: string;
};

export type ExpenseItem = {
  id: string;
  label: string;
  details: string | null;
  totalAmount: number;
  expenseDate: string;
  createdAt: string;
};
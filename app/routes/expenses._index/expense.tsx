import { Link } from "@remix-run/react";
import type { ExpenseItem } from "~/types";

export default function Expense({expense}: {expense: ExpenseItem}) {

  // format date to show readable date: Fri, 12 Feb 2021
  const expenseDate = new Date(expense.expenseDate);
  const formattedDate = expenseDate.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    });

  return (
    <div className="mt-5 flex flex-row border-2 rounded-lg px-5 py-3">
      <div className="w-2/4 flex flex-col">
        <h1 className="text-3xl font-bold">
          {expense.label}
        </h1>
        <h2 className="italic text-sm">
          {formattedDate}
        </h2>
          
        <span className="text-lg font-bold text-gray-600">
          {expense.details}
        </span>
      </div>

      <div className="ml-20 w-1/4 flex flex-row items-center justify-center">
        <span className="text-2xl font-bold text-gray-600">
          ₦{expense.totalAmount}
        </span>
      </div>

      {/* add a section for editing a user */}
      <div className="w-1/4 items-center flex flex-row justify-end">
        <Link to="" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Edit Expense
        </Link>
      </div>
    </div>
  )
}
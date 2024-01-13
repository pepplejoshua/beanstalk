import type { LoaderFunctionArgs } from "@remix-run/node";
import BeanLayout from "~/components/bean_layout";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import { Link, useLoaderData } from "@remix-run/react";
import Expense from "./expense";

export default function ExpensesList() {
  let expenses = useLoaderData<typeof loader>();

  return (
    <BeanLayout>
      <h1 className="text-5xl font-bold text-center mb-10">
        expenses
      </h1>

      <div className="ml-10 mt-5 flex flex-row">
        <Link to={`view/0`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded">
          new expense
        </Link>
      </div>

      <div className="ml-10 mt-5 flex flex-col">
        {expenses.map((expense) => (
          <Expense key={expense.id} expense={expense}/>
        ))}
      </div>
    </BeanLayout>
  )
}

export async function loader({request}: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/gbf',
  });

  // now we will load all the expenses from the db
  const expenses = await prisma.expense.findMany({
    select: {
      id: true,
      totalAmount: true,
      details: true,
      label: true,
      expenseDate: true,
      createdAt: true,
    },
    orderBy: {
      expenseDate: 'desc',
    },
  });

  return expenses;
}
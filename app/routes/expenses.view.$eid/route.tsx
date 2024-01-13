import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import BeanLayout from "~/components/bean_layout";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";

export default function ViewExpense() {
  let { expense } = useLoaderData<typeof loader>();

  const newMode = expense === undefined;
  
  return (
    <BeanLayout>
      <h1 className="text-5xl font-bold text-center">
        <p className="text-5xl font-bold text-center mb-10">
            {newMode ? "new expense" : "edit expense"}
        </p>
      </h1>

      <div className="mt-10 mx-auto w-3/4">
        <Form className="flex flex-col text-justify" method="POST">
          <label htmlFor="label" className="text-3xl font-bold mb-2">
            label
          </label>
          <input
            type="text"
            name="label"
            id="label"
            defaultValue={expense?.label}
            className="border-2 border-gray-500 rounded-lg p-2 mb-5"
            required
          />

          <label htmlFor="details" className="text-3xl font-bold mb-2">
            details
          </label>
          <input
            type="text"
            name="details"
            id="details"
            defaultValue={expense?.details || ""}
            className="border-2 border-gray-500 rounded-lg p-2 mb-5"
          />

          <label htmlFor="totalAmount" className="text-3xl font-bold mb-2">
            total amount
          </label>
          <input
            type="number"
            name="totalAmount"
            id="totalAmount"
            defaultValue={expense?.totalAmount}
            className="border-2 border-gray-500 rounded-lg p-2 mb-5"
            required
          />

          <label htmlFor="expenseDate" className="text-3xl font-bold mb-2">
            expense date
          </label>
          <input
            type="datetime-local"
            name="expenseDate"
            id="expenseDate"
            defaultValue={
              expense?.expenseDate 
                ? new Date(expense.expenseDate).toISOString().substring(0, 16) 
                : new Date().toISOString().substring(0, 16)
            }
            className="border-2 border-gray-500 rounded-lg p-2 mb-5"
            required
          />

          <button type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg"
          >
            {newMode ? "create expense" : "update expense"}
          </button>
        </Form>
      </div>
    </BeanLayout>
  )
}

export async function loader({request, params}: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/gbf',
  });
  
  let url = new URL(request.url);
  let editExpense = url.searchParams.get("edit");
  let expense = undefined;
  if (editExpense) {
    // we are editing an expense
    let expenseId = params.eid;
    expense = await prisma.expense.findUnique({
      where: {
        id: expenseId,
      },
    });
  }

  return {
    expense,
  }
}
  
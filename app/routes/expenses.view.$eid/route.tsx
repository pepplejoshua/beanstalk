import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BeanLayout from "~/components/bean_layout";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import { sessionStorage } from "~/services/session.server";

export default function ViewExpense() {
  let { expense, fatalError, error, mode } = useLoaderData<typeof loader>();
  invariant(mode === "new" || mode === "edit" || mode === "clone", "mode must be new, edit or clone");
  
  let newMode = mode === "new" || mode === "clone";

  return (
    <BeanLayout>
      <h1 className="text-5xl font-bold text-center">
        { fatalError && 
          <p className="font-bold text-center text-5xl">error</p>  }
        { !fatalError &&
          <p className="text-5xl font-bold text-center mb-10">
              {mode} expense
          </p>
        }
      </h1>

      { fatalError &&
        <div className="mt-20">
          <p className="text-red-500 text-2xl text-center">
            {fatalError}
          </p>
        </div>  
      } 

      {error &&
        <p className="text-red-500 text-2xl mx-auto mt-10 w-3/4">{error}</p>}

      { !fatalError &&
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
              type="date"
              name="expenseDate"
              id="expenseDate"
              defaultValue={
                expense?.expenseDate ?
                  new Date(expense.expenseDate).toISOString().substring(0, 10)
                : new Date().toISOString().substring(0, 10)
              }
              className="border-2 border-gray-500 rounded-lg p-2 mb-5"
              required
            />

            <button type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg"
            >
              {newMode ? "create" : "update"}
            </button>
          </Form>
        </div>
      }
    </BeanLayout>
  )
}

export async function loader({request, params}: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/gbf',
  });
  
  let url = new URL(request.url);
  let editExpense = url.searchParams.get("edit");
  let cloneExpense = url.searchParams.get("clone");
  let expense = undefined;
  let errorKey = "new-expense-error";
  if (editExpense || cloneExpense) {
    // we are editing an expense or cloning an existing expense
    errorKey = editExpense ? "edit-expense-error" : "clone-expense-error";
    let expenseId = params.eid;
    expense = await prisma.expense.findUnique({
      where: {
        id: expenseId,
      },
      select: {
        id: true,
        label: true,
        details: true,
        totalAmount: true,
        expenseDate: cloneExpense ? false : true,
      },
    });
  }

  let fatalError = undefined;
  if (expense === undefined && (editExpense || cloneExpense)) {
    fatalError = "expense not found";
  }

  let { getSession, commitSession } = sessionStorage;
  let session = await getSession(request.headers.get('Cookie'));
  let error = session.get(errorKey);
  
  return json({
    expense,
    fatalError,
    error,
    mode: editExpense ? "edit" : (cloneExpense ? "clone" : "new" ),
  }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
  
export async function action({request, params}: ActionFunctionArgs) {
  let url = new URL(request.url);
  let editExpense = url.searchParams.get("edit");
  let cloneExpense = url.searchParams.get("clone");
  let error = undefined;
  let errorKey = "new-expense-error";
  
  try {
    let formData = await request.formData();
    let label = formData.get("label");
    invariant(typeof label === "string", "label must be a string");
    let details = formData.get("details");
    invariant(typeof details === "string", "details must be a string");
    let totalAmount = formData.get("totalAmount");
    invariant(typeof totalAmount === "string", "total amount must be a string");
    // make sure totalAmount is a valid number
    let totalAmountNum = Number(totalAmount);
    invariant(!isNaN(totalAmountNum), "total amount must be a valid number");
    let expenseDate = formData.get("expenseDate");
    invariant(typeof expenseDate === "string", "expense date must be a string");
    // make sure expenseDate is a valid date
    let expenseDateObj = new Date(expenseDate);
    invariant(!isNaN(expenseDateObj.getTime()), "expense date must be a valid date");
    
    if (editExpense) {
      // we are editing an expense so we need the id of the expense we are editing
      let expenseId = params.eid;
      errorKey = "edit-expense-error";
      // now we can update the expense
      await prisma.expense.update({
        where: {
          id: expenseId,
        },
        data: {
          label,
          details,
          totalAmount: totalAmountNum,
          expenseDate: expenseDateObj,
        },
      });
    } else {
      errorKey = cloneExpense ? "clone-expense-error" : "new-expense-error";
      // we are creating a new expense or cloning an existing expense
      await prisma.expense.create({
        data: {
          label,
          details,
          totalAmount: totalAmountNum,
          expenseDate: expenseDateObj,
        },
      });
    }
  } catch (err) {
    // handle any errors
    if (err instanceof Error) {
      error = err.message;
    } else if (typeof err === "string") {
      // TODO(@pepplejoshua): look into why we even need this
      error = err;
    } else {
      error = "an unknown error occured while handling your request";
    }

    let { getSession, commitSession } = sessionStorage;
    let session = await getSession(request.headers.get('Cookie'));
    session.flash(errorKey, error);
    let headers = {'Set-Cookie': await commitSession(session)};
    if (editExpense) {
      return redirect(`/expenses/view/${params.eid}?edit=true`, {headers});
    } else if (cloneExpense) {
      return redirect(`/expenses/view/${params.eid}?clone=true`, {headers});
    }

    return redirect(`/expenses/view/${params.eid}`, {headers});
  }

  // go to the expenses page from here
  return redirect('/expenses');
}
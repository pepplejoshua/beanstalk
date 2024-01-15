import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";

export async function loader({request, params}: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/gbf',
  });

  // now we will get the expense id from the request
  let expenseId = params.eid;

  // now we will delete the expense from the db
  await prisma.expense.delete({
    where: {
      id: expenseId,
    },
  });

  // now we will redirect the user back to the expenses list
  return redirect('/expenses');
}

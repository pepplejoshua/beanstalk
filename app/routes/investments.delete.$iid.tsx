import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/gbf",
  });

  // now we will get the investment id from the request
  let investmentId = params.iid;

  // now we will delete the investment from the db
  await prisma.investment.delete({
    where: {
      id: investmentId,
    },
  });

  // now we will redirect the user back to the investments list
  return redirect("/investments");
}

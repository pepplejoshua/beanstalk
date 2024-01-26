import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BeanLayout from "~/components/bean_layout";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import { sessionStorage } from "~/services/session.server";

export default function ViewInvestment() {
  let { investment, fatalError, error, mode } = useLoaderData<typeof loader>();
  invariant(mode === "new" || mode === "edit" || mode === "clone", "mode must be new, edit, or clone");

  let newMode = mode !== "edit";

  return (
    <BeanLayout>
      <h1 className="text-5xl font-bold text-center">
        { fatalError && 
          <p className="font-bold text-center text-5xl">error</p>  }
        { !fatalError &&
          <p className="text-5xl font-bold text-center mb-10">
              {mode} sale
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
              id="label"
              name="label"
              type="text"
              defaultValue={investment?.label}
              className="border-2 border-gray-500 rounded-lg p-2 mb-5"
              required
            />

            <label htmlFor="details" className="text-3xl font-bold mb-2">
              details
            </label>
            <input
              id="details"
              name="details"
              defaultValue={investment?.details || ""}
              className="border-2 border-gray-500 rounded-lg p-2 mb-5"
              required
            />

            <label htmlFor="totalAmount" className="text-3xl font-bold mb-2">
              total amount
            </label>
            <input
              id="totalAmount"
              name="totalAmount"
              type="number"
              defaultValue={investment?.totalAmount}
              className="border-2 border-gray-500 rounded-lg p-2 mb-5"
              required
            />

            <label htmlFor="investmentDate" className="text-3xl font-bold mb-2">
              investment date
            </label>
            <input
              id="investmentDate"
              name="investmentDate"
              type="date"
              defaultValue={
                investment?.investmentDate ?
                  new Date(investment?.investmentDate).toISOString().substring(0, 10)
                : new Date().toISOString().substring(0, 10)
              }
              className="border-2 border-gray-500 rounded-lg p-2 mb-5"
              required
            />

            <button
              type="submit"
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

export async function loader({params, request}: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/gbf",
  });

  let url = new URL(request.url);
  let editInvestment = url.searchParams.get("edit");
  let cloneInvestment = url.searchParams.get("clone");
  let investment = undefined;
  let errorKey = "new-investment-error";
  if (editInvestment || cloneInvestment) {
    // we are editing or cloning an investment
    errorKey = editInvestment ? "edit-investment-error" : "clone-investment-error";
    let investmentId = params.iid;
    investment = await prisma.investment.findUnique({
      where: {
        id: investmentId,
      },
      select: {
        id: true,
        label: true,
        details: true,
        totalAmount: true,
        investmentDate: true,
      }
    });
  }

  let fatalError = undefined;
  if (investment === undefined && (editInvestment || cloneInvestment)) {
    fatalError = "investment not found";
  }

  let { getSession, commitSession } = sessionStorage;
  let session = await getSession(request.headers.get("Cookie"));
  let error = session.get(errorKey);

  return json({
    investment,
    error,
    fatalError,
    mode: editInvestment ? "edit" : (cloneInvestment ? "clone" : "new"),
  }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  })
}
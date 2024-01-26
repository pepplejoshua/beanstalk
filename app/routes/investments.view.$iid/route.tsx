import { type ActionFunctionArgs, json, type LoaderFunctionArgs, redirect } from "@remix-run/node";
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

export async function action({request, params}: ActionFunctionArgs) {
  let url = new URL(request.url);
  let editInvestment = url.searchParams.get("edit");
  let cloneInvestment = url.searchParams.get("clone");
  let error = undefined;
  let errorKey = "new-investment-error";

  try {
    let formData = await request.formData();
    let label = formData.get("label");
    invariant(typeof label === "string", "label must be a string");
    let details = formData.get("details");
    invariant(typeof details === "string", "details must be a string");
    let totalAmount = formData.get("totalAmount");
    let totalAmountNum = Number(totalAmount);
    invariant(!isNaN(totalAmountNum), "total amount must be a number");
    let investmentDate = formData.get("investmentDate");
    invariant(typeof investmentDate === "string", "investment date must be a string");
    let investmentDateObj = new Date(investmentDate);
    invariant(!isNaN(investmentDateObj.getTime()), "investment date must be a valid date");

    if (editInvestment) {
      let investmentId = params.iid;
      errorKey = "edit-investment-error";
      // update the investment
      await prisma.investment.update({
        where: {
          id: investmentId,
        },
        data: {
          label,
          details,
          totalAmount: totalAmountNum,
          investmentDate: investmentDateObj,
        },
      });
    } else {
      errorKey = cloneInvestment ? "clone-investment-error" : "new-investment-error";
      // we are creating or cloning an investment
      await prisma.investment.create({
        data: {
          label,
          details,
          totalAmount: totalAmountNum,
          investmentDate: investmentDateObj,
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
    let session = await getSession(request.headers.get("Cookie"));
    session.flash(errorKey, error);
    let headers = {'Set-Cookie': await commitSession(session)};
    if (editInvestment) {
      return redirect(`/investments/view/${params.iid}?edit=true`, { headers });
    } else if (cloneInvestment) {
      return redirect(`/investments/view/${params.iid}?clone=true`, { headers });
    }

    return redirect("/investments/new", { headers });
  }

  // go to the investments page
  return redirect("/investments");
}
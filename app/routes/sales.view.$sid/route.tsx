import { type ActionFunctionArgs, json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BeanLayout from "~/components/bean_layout";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import { sessionStorage } from "~/services/session.server";

export default function ViewSale() {
  let { sale, fatalError, error, mode } = useLoaderData<typeof loader>();
  invariant(mode === "new" || mode === "edit" || mode === "clone", "mode must be new, edit or clone");

  let newMode = mode !== "edit";

  function getSalePricePerItem() {
    let totalAmount = document.getElementById("totalAmount") as HTMLInputElement;
    let quantitySold = document.getElementById("quantitySold") as HTMLInputElement;
    let pricePerItemDisplay = document.getElementById("pricePerItemDisplay") as HTMLInputElement;
    let pricePerItem = document.getElementById("pricePerItem") as HTMLInputElement;
    let totalAmountValue = parseFloat(totalAmount.value);
    let quantitySoldValue = parseFloat(quantitySold.value);
    let pricePerItemValue = totalAmountValue / quantitySoldValue;
    // limit to 2 decimal places
    pricePerItemValue = Math.round(pricePerItemValue * 100) / 100;
    pricePerItemDisplay.value = pricePerItemValue.toString();
    pricePerItem.value = pricePerItemValue.toString();
  }

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
              type="text"
              name="label"
              id="label"
              defaultValue={sale?.label}
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
              defaultValue={sale?.details || ""}
              className="border-2 border-gray-500 rounded-lg p-2 mb-5"
            />

            <div className="flex flex-row">
              <div className="flex flex-col w-1/3 mr-3">
                <label htmlFor="totalAmount" className="text-3xl font-bold mb-2">
                  total amount
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  id="totalAmount"
                  defaultValue={sale?.totalAmount}
                  className="border-2 border-gray-500 rounded-lg p-2 mb-5"
                  onChange={getSalePricePerItem}
                  required
                />  
              </div>

              <div className="flex flex-col w-1/3 mr-3">
                <label htmlFor="quantitySold" className="text-3xl font-bold mb-2">
                  quantity sold
                </label>

                <input
                  type="number"
                  name="quantitySold"
                  id="quantitySold"
                  defaultValue={sale?.quantitySold}
                  className="border-2 border-gray-500 rounded-lg p-2 mb-5"
                  onChange={getSalePricePerItem}
                  required
                />
              </div>

              <div className="flex flex-col w-1/3">
                <label htmlFor="pricePerItem" className="text-3xl font-bold mb-2">
                  price per item
                </label>
                <input
                  type="string"
                  name="pricePerItemDisplay"
                  id="pricePerItemDisplay"
                  defaultValue={sale?.pricePerItem}
                  className="border-2 border-gray-500 rounded-lg p-2 mb-5"
                  disabled
                  required
                />

                <input
                  type="hidden"
                  name="pricePerItem"
                  id="pricePerItem"
                  defaultValue={sale?.pricePerItem}
                />
              </div>
            </div>

            <label htmlFor="saleDate" className="text-3xl font-bold mb-2">
              sale date
            </label>
            <input
              type="date"
              name="saleDate"
              id="saleDate"
              defaultValue={
                sale?.saleDate ?
                  new Date(sale.saleDate).toISOString().substring(0, 10)
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

export async function loader({params, request}: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/gbf',
  });

  let url = new URL(request.url);
  let editSale = url.searchParams.get("edit");
  let cloneSale = url.searchParams.get("clone");
  let sale = undefined;
  let errorKey = "new-sale-error";
  if (editSale || cloneSale) {
    // we are editing a sale or cloning an existing sale
    errorKey = editSale ? "edit-sale-error" : "clone-sale-error";
    let saleId = params.sid;
    sale = await prisma.sale.findUnique({
      where: {
        id: saleId,
      },
      select: {
        id: true,
        label: true,
        details: true,
        totalAmount: true,
        pricePerItem: true,
        quantitySold: true,
        saleDate: cloneSale ? false : true,
      },
    });
  }

  let fatalError = undefined;
  if (sale === undefined && (editSale || cloneSale)) {
    fatalError = "sale not found";
  }

  let { getSession, commitSession } = sessionStorage;
  let session = await getSession(request.headers.get('Cookie'));
  let error = session.get(errorKey);

  return json({
    sale,
    fatalError,
    error,
    mode: editSale ? "edit" : (cloneSale ? "clone" : "new" ),
  }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function action({request, params}: ActionFunctionArgs) {
  let url = new URL(request.url);
  let editSale = url.searchParams.get("edit");
  let cloneSale = url.searchParams.get("clone");
  let error = undefined;
  let errorKey = "new-sale-error";

  try {
    let formData = await request.formData();
    let label = formData.get("label");
    invariant(typeof label === "string", "label must be a string");
    let details = formData.get("details");
    invariant(typeof details === "string", "details must be a string");
    let totalAmount = formData.get("totalAmount");
    let totalAmountNum = Number(totalAmount);
    invariant(!isNaN(totalAmountNum), "total amount must be a number");
    let pricePerItem = formData.get("pricePerItem");
    invariant(typeof pricePerItem === "string", "price per item must be a number");
    let pricePerItemNum = Number(pricePerItem);
    invariant(!isNaN(pricePerItemNum), "price per item must be a number");
    let quantitySold = formData.get("quantitySold");
    invariant(typeof quantitySold === "string", "quantity sold must be a string");
    let quantitySoldNum = Number(quantitySold);
    invariant(!isNaN(quantitySoldNum), "quantity sold must be a number");
    let saleDate = formData.get("saleDate");
    invariant(typeof saleDate === "string", "sale date must be a string");
    let saleDateObj = new Date(saleDate);
    invariant(!isNaN(saleDateObj.getTime()), "sale date must be a valid date");

    if (editSale) {
      // we are editing a sale so we need the id of the sale we are editing
      let saleId = params.sid;
      errorKey = "edit-sale-error";
      // update the sale
      await prisma.sale.update({
        where: {
          id: saleId,
        },
        data: {
          label,
          details,
          totalAmount: totalAmountNum,
          pricePerItem: pricePerItemNum,
          quantitySold: quantitySoldNum,
          saleDate: saleDateObj,
        },
      });
    } else {
      errorKey = cloneSale ? "clone-sale-error" : "new-sale-error";
      // we are creating a sale or cloning an existing sale
      await prisma.sale.create({
        data: {
          label,
          details,
          totalAmount: totalAmountNum,
          pricePerItem: pricePerItemNum,
          quantitySold: quantitySoldNum,
          saleDate: saleDateObj,
        },
      });
    }
  } catch (err) {
    // handle any errors
    if (err instanceof Error) {
      error = err.message;
    } else if (typeof err == "string") {
      // TODO(@pepplejoshua): look into why we even need this
      error = err;
    } else {
      error = "an unknown error occured while handling your request";
    }

    let { getSession, commitSession } = sessionStorage;
    let session = await getSession(request.headers.get('Cookie'));
    session.flash(errorKey, error);
    let headers = {'Set-Cookie': await commitSession(session)};
    if (editSale) {
      return redirect(`/sales/view/${params.sid}?edit=true`, {headers});
    } else if (cloneSale) {
      return redirect(`/sales/view/${params.sid}?clone=true`, {headers});
    }

    return redirect(`/sales/view/${params.sid}`, {headers});
  }

  // go to the sales page from here
  return redirect('/sales');
}
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import BeanLayout from "~/components/bean_layout";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import { sessionStorage } from "~/services/session.server";

export default function ViewSale() {
  return (
    <BeanLayout>
      <h1>

      </h1>
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


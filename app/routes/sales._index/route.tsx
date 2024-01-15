import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import BeanLayout from "~/components/bean_layout";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import Sale from "./sale";

export default function SalesList() {
  let sales = useLoaderData<typeof loader>();

  return (
    <BeanLayout>
      <h1 className="text-5xl font-bold text-center mb-10">sales</h1>

      <div className="ml-10 mt-5 flex flex-row">
        <Link to={`view/0`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded">
          new sale
        </Link>
      </div>

      <div className="ml-10 mt-5 flex flex-col">
        {sales.map((sale) => (
          <Sale key={sale.id} sale={sale}/>
        ))}
      </div>
    </BeanLayout>
  ) 
}

export async function loader({request}: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/gbf',
  });

  // now we will load all the sales from the db
  const sales = await prisma.sale.findMany({
    select: {
      id: true,
      totalAmount: true,
      details: true,
      label: true,
      saleDate: true,
      pricePerItem: true,
      quantitySold: true,
    },
    orderBy: {
      saleDate: 'desc',
    },
  });

  return sales;
}
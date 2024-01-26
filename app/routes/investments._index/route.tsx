import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BeanLayout from "~/components/bean_layout";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import Investment from "./investment";

export default function InvestmentsList() {
  let investments = useLoaderData<typeof loader>();

  return (
    <BeanLayout>
      <h1 className="text-5xl font-bold text-center mb-10">
        investments
      </h1>

      <div className="ml-10 mt-5 flex flex-row">
        <a href="/investments/view/0"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded">
          new investment
        </a>
      </div>

      <div className="ml-10 mt-5 flex flex-col">
        {investments.map((investment) => (
          <Investment key={investment.id} investment={investment}/>
        ))}
      </div>
    </BeanLayout>
  )
}

export async function loader({request}: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/gbf',
  });

  const investments = await prisma.investment.findMany({
    select: {
      id: true,
      totalAmount: true,
      label: true,
      details: true,
      investmentDate: true,
    },
    orderBy: {
      investmentDate: "desc",
    },
  });

  return investments;
}
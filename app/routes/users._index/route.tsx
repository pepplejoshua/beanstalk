import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BeanLayout from "~/components/bean_layout";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";
import User from "./user";

export default function Users() {
  const users = useLoaderData<typeof loader>();

  return (
      <BeanLayout>
        <h1 className="text-5xl font-bold text-center mb-10">
          users
        </h1>
        {users.map((user) => (
          <User key={user.id} user={user} />
        ))}
      </BeanLayout>
  )
}

export async function loader({request}: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/gbf',
  });

  // now we will load all the users from the db
  let users = await prisma.user.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      username: true,
      email: true,
      company_role: true,
    }
  });
  return users;
}
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BeanLayout from "~/components/bean_layout";
import { authenticator } from "~/services/auth.server";

export default function Summary() {
  let user = useLoaderData<typeof loader>();
  let user_name = user.username.toLowerCase();

  return (
      <BeanLayout>
        <h1 className="text-3xl font-bold">
          hello, { user_name }
        </h1>
      </BeanLayout>
  )
}

// this is an important redirect, since people who are not logged in
// should not be able to access this page
export async function loader({request}: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: '/gbf',
  });
}

// this is the logout action. redirect to login page
export async function action({request}: ActionFunctionArgs) {
  await authenticator.logout(request, {
    redirectTo: '/gbf',
  })
}


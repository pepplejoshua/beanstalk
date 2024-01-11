import type { LoaderFunctionArgs } from "@remix-run/node";
import BeanLayout from "~/components/bean_layout";
import { authenticator } from "~/services/auth.server";

export default function Users() {
  return (
      <BeanLayout>
        <h1 className="text-3xl font-bold">
          welcome to users page
        </h1>
      </BeanLayout>
  )
}

export async function loader({request}: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: '/gbf',
  });
}
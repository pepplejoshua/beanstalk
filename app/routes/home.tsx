import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export default function GbfHome() {
  return (
    <div className="w-full">
      <h1 className="text-6xl font-bold text-center">
        welcome to gbf
      </h1>

      <Form method="post" action="/home" className="text-center w-full">
        <button className="bg-black text-white px-10 py-4 rounded text-2xl mt-20" type="submit">
        sign out
        </button>
      </Form>
      
    </div>
  )
}

// this is the logout action. redirect to login page
export async function action({request}: ActionFunctionArgs) {
  await authenticator.logout(request, {
    redirectTo: '/gbf',
  })
}

// this is an important redirect, since people who are not logged in
// should not be able to access this page
export async function loader({request}: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: '/gbf',
  });
}
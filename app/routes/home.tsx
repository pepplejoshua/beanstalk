import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export default function Summary() {
  let user = useLoaderData<typeof loader>();
  let user_name = user.username.toLowerCase();

  return (
    <div className="flex flex-row w-full min-h-screen">
      {/* this is the actual left pane div */}
      <div className="w-1/4 min-h-screen py-10 border-r-2">
        {/* keep stuff aligned in the column */}
        <div className="flex flex-col justify-center items-center">
          <Link to="/home" className="text-3xl font-bold text-center">
            beanstalk
          </Link>

          <p className="text-2xl font-bold text-center mt-10">
            expenses    
          </p>

          <p className="text-2xl font-bold text-center mt-10">
            sales
          </p>

          <p className="text-2xl font-bold text-center mt-10">
            users
          </p>

          <Form method="post" action="/home" className="text-center w-full">
            <button className="bg-black text-white px-8 py-3 rounded text-xl mt-20" type="submit">
              sign out
            </button>
          </Form>
        </div>

        
      </div>
      
      {/* this is the actual right pane div */}
      <div className="w-3/4 min-h-screen bg-gray-100 flex flex-col  py-10">
        <h1 className="text-3xl font-bold text-center">
          hello, { user_name }
        </h1>

        
        
      </div>
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
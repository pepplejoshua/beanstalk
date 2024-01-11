import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import React from "react";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";

// this will be the entry point for the gbf area
// it will present a login screen
export default function GBF() {
  const [showPassword, setShowPassword] = React.useState(false);
  // grab any data containing errors returned from the loader
  // TODO(@pepplejoshua): return the user_identification and
  // password together with the error so that we can prefill
  // the login form with the user's input
  const data = useLoaderData<typeof loader>();
  const error = data.error?.message;

  const handleShowPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowPassword(event.target.checked);
  }

  return (
    <div className="w-full py-20">
      <Form method="post" action="/gbf" className="text-center w-full">
        <h1 className="text-6xl font-bold text-center">
          sign in to beanstalk
        </h1>

        <div className="mt-20" hidden={!error}>
          {error && <p className="text-red-500 text-2xl">{error}</p>}
        </div>

        <div className={error ? "mt-10 w-full"  : "mt-20 w-full"}>
          <input className="border-2 border-black pl-3 text-2xl py-4 rounded w-5/6 sm:w-4/5 md:w-2/3 lg:w-2/3 xl:w-2/3 2xl:w-2/3"
            type="text" name="user_identification" placeholder="email or username" required/>
        </div>

        <div className="mt-10 w-full">
          <input className="border-2 border-black pl-3 text-2xl py-4 rounded w-5/6 sm:w-4/5 md:w-2/3 lg:w-2/3 xl:w-2/3 2xl:w-2/3"
            type={showPassword ? "text" : "password"} name="password" placeholder="password" required/>

          <div className="mt-5">
            <label className="text-2xl">
              <input className="transform scale-150 mr-3" type="checkbox" name="show-password"
              onChange={handleShowPasswordChange} />
              show password
            </label>  
          </div>          
        </div>
        
        <div className="mt-10">
          <button className="bg-black text-white px-10 py-4 rounded text-2xl" type="submit">
            sign in
          </button>
        </div>
      </Form>
    </div>
  )
}

export async function action({request}: ActionFunctionArgs) {
  try {
    // try to login and make sure all errors are thrown
    let user = await authenticator.authenticate('gbf_login', request, {
      failureRedirect: '/gbf',
      throwOnError: true,
    });

    // do session stuff to set the user if the login was successful
    let { getSession, commitSession } = sessionStorage;
    let session = await getSession(request.headers.get('Cookie'));
    session.set(authenticator.sessionKey, user);
    let headers = new Headers({'Set-Cookie': await commitSession(session)});

    // go home
    return redirect('/home', {headers})
  } catch (err) {
    // if we get an error, we want to return a response
    if (err instanceof Error) {
      return new Response(err.message, {status: 401});
    } else if (err instanceof Response) {
      return err;
    }
  }
}

export async function loader({request}: LoaderFunctionArgs) {
  // if the user is already logged in, redirect them to the home page
  await authenticator.isAuthenticated(request, {
    successRedirect: '/home',
  });
  
  // otherwise, since we return to ourselves on a login error, we
  // need to get the error from the session and return it from the 
  // loader
  let { getSession, commitSession } = sessionStorage;
  let session = await getSession(request.headers.get('Cookie'));
  let error = session.get(authenticator.sessionErrorKey);
  return json({error}, {
    headers: {'Set-Cookie': await commitSession(session)},
  })
}
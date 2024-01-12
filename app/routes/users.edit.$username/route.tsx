import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import BeanLayout from "~/components/bean_layout";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";

export default function EditUser() {
  let info_bunder = useLoaderData<typeof loader>();
  let { user, editingUser, fatalError } = info_bunder;

  let editingSelf = user.id === editingUser?.id;

  return (
    <BeanLayout>
      <h1 className="text-5xl font-bold text-center">
        {/* show this if there is a fatalError */}
        { fatalError && 
          <p className="font-bold text-center text-5xl">error</p>  }
        {/* show this if there is no fatalError */}
        { !fatalError && 
          <p className="text-5xl font-bold text-center mb-10">
            {editingSelf ? "edit your profile" : `edit ${editingUser?.username}'s profile`}
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

      { !fatalError && 
          <div className="mt-10 mx-auto w-3/4">
            <Form className="flex flex-col text-justify" method="POST">
              <label htmlFor="first_name" className="text-3xl font-bold mb-2">
                first name
              </label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                defaultValue={editingUser?.first_name}
                className="border-2 border-gray-500 rounded-lg p-2 mb-5"
              />

              <label htmlFor="last_name" className="text-3xl font-bold mb-2">
                last name
              </label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                defaultValue={editingUser?.last_name}
                className="border-2 border-gray-500 rounded-lg p-2 mb-5"
                required
              />

              <label htmlFor="username" className="text-3xl font-bold mb-2">
                username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                defaultValue={editingUser?.username}
                className="border-2 border-gray-500 rounded-lg p-2 mb-5"
                required
              />

              <label htmlFor="email" className="text-3xl font-bold mb-2">
                email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                defaultValue={editingUser?.email}
                className="border-2 border-gray-500 rounded-lg p-2 mb-5"
                required
              />

              <label htmlFor="company_role" className="text-3xl font-bold mb-2">
                company role
              </label>
              <input
                type="text"
                name="company_role"
                id="company_role"
                defaultValue={editingUser?.company_role}
                className="border-2 border-gray-500 rounded-lg p-2 mb-5"
                required
              />

              {/* TODO(@pepplejoshua): add optional password field here. style fields like gbf page */}

              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                submit
              </button>
            </Form>
          </div>
      }
    </BeanLayout>
  )
}

export async function loader({request, params}: LoaderFunctionArgs) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/gbf',
  });

  let editingUsername = params.username;
  let error = await request.text();
  console.log("ERROR::::", error);
  let editingUser = await prisma.user.findUnique({
    where: {
      username: editingUsername,
    }
  });

  let fatalError = undefined;
  if (!editingUser) {
    fatalError = "this user was not found";
  }

  return {
    user,
    editingUser,
    fatalError,
  }
}

export async function action({request, params}: ActionFunctionArgs) {
  let updatingUser = params.username;

  let formData = await request.formData();
  let error = undefined;

  let first_name = formData.get("first_name");
  invariant(typeof first_name === "string", "first name must be a string");
  let last_name = formData.get("last_name");
  invariant(typeof last_name === "string", "last name must be a string");
  let username = formData.get("username");
  invariant(typeof username === "string", "username must be a string");
  let email = formData.get("email");
  invariant(typeof email === "string", "email must be a string");
  let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  let is_email = regex.test(email);
  if (!is_email) {
    error = "email must be a valid email";
  }
  let company_role = formData.get("company_role");
  invariant(typeof company_role === "string", "company role must be a string");

  if (error) {
    return new Error(error);
  }

  try {
    await prisma.user.update({
      data: {
        first_name,
        last_name,
        username,
        email,
        company_role,
      },
      where: {
        username: updatingUser + 'sa',
      }
    });
  } catch (err) {
    throw new Error("this user was not found");
  }

  if (error) {
    throw new Error(error);
  }
  // go to the /users page from here
  return redirect("/users");
}
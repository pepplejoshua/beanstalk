import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BeanLayout from "~/components/bean_layout";
import { authenticator } from "~/services/auth.server";
import { prisma } from "~/services/prisma.server";

export default function EditUser() {
  let info_bunder = useLoaderData<typeof loader>();
  let { user, editingUser, error } = info_bunder;

  let editingSelf = user?.id === editingUser?.id;

  return (
    <BeanLayout>
      <h1 className="text-5xl font-bold text-center mb-10">
        {/* show this if there is an error */}
        { error && 
          <p className="font-bold text-center text-5xl">error</p>  }
        {/* show this if there is no error */}
        { !error && 
          <p className="text-5xl font-bold text-center mb-10">
            {editingSelf ? "edit your profile" : `edit ${editingUser?.username}'s profile`}
          </p>
        }
      </h1>

      { error &&
          <div className="mt-20">
            <p className="text-red-500 text-2xl">
              {error}
            </p>
          </div>  
      }

      { !error && 
          <div className="mt-20">
            hi
          </div>
      }
    </BeanLayout>
  )
}

export async function loader({request, params}: LoaderFunctionArgs) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/gbf',
  });

  let editingUserId = params.uid;
  let editingUser = await prisma.user.findUnique({
    where: {
      id: editingUserId,
    }
  });

  let error = undefined;
  if (!editingUser) {
    error = "this user was not found";
  }

  return {
    user,
    editingUser,
    error,
  }
}
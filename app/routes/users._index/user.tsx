// each user will be have their info displayed
// in a card. This info includes:
// - first and last name
// - username
// - email
// - company role

import { Link } from "@remix-run/react";
import type { AuthenticatedUser } from "~/services/auth.server";

// They will be passed by props from the parent component
// TODO(@sewedur): style this nicely
export default function User({user}: {user: AuthenticatedUser}) {
  return (
    <div className="ml-5 mt-5 flex flex-row border-2 rounded-lg px-5 py-3">
      <div className="w-2/3 flex flex-col">
        <h1 className="text-3xl font-bold">
          {user.first_name}, {user.last_name}
          <span className="text-2xl font-bold text-gray-400 ml-2">
            @{user.username}
          </span>
        </h1>
        <h2 className="">
          
        </h2>
    
        <span className="text-lg font-bold text-gray-600">
          {user.company_role}
        </span>
      </div>

      {/* add a section for editing a user */}
      <div className="w-1/3 items-center flex flex-row justify-end">
        <Link to={`edit/${user.username}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Edit User
        </Link>
      </div>
    </div>
  )
}
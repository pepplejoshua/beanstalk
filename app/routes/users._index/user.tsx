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
    <div className="mt-5 flex flex-row">
      <div className="w-2/3 flex flex-col">
        <h1 className="text-3xl font-bold">
          {user.first_name}, {user.last_name}
        </h1>
        <h2 className="text-2xl font-bold">
          .{user.username}
        </h2>
        <h3 className="text-xl font-bold">
          {user.email}
        </h3>
        <h4 className="text-lg font-bold">
          {user.company_role}
        </h4>
      </div>

      {/* add a section for editing a user */}
      <div className="w-1/3">
        <Link to={`edit/${user.id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Edit User
        </Link>
      </div>
    </div>
  )
}
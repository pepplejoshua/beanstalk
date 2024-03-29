import { Form, NavLink } from "@remix-run/react";

export default function BeanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row w-full min-h-screen">
      {/* this is the actual left pane div */}
      <div className="w-1/4 min-h-screen py-16 border-r-2">
        {/* keep stuff aligned in the column */}
        <div className="flex flex-col justify-center items-center">
          <NavLink to="/home" className={({ isActive }) => isActive ? "text-2xl font-bold text-center text-gray-500" : "text-2xl font-bold text-center"}>
            beanstalk
          </NavLink>

          <NavLink to="/expenses" className={({ isActive }) => isActive ? "text-2xl font-bold text-center mt-10 text-red-600" : "text-2xl font-bold text-center mt-10"}>
            expenses
          </NavLink>

          <NavLink to="/sales" className={({ isActive }) => isActive ? "text-2xl font-bold text-center mt-10 text-green-500" : "text-2xl font-bold text-center mt-10"}>
            sales
          </NavLink>

          <NavLink to="/investments" className={({ isActive }) => isActive ? "text-2xl font-bold text-center mt-10 text-blue-600" : "text-2xl font-bold text-center mt-10"}>
            investments
          </NavLink>

          <NavLink to="/users" className={({ isActive }) => isActive ? "text-2xl font-bold text-center mt-10 text-gray-500" : "text-2xl font-bold text-center mt-10"}>
            users
          </NavLink>

          <Form method="post" action="/home" className="text-center w-full">
            <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg text-xl mt-20" type="submit">
              sign out
            </button>
          </Form>
        </div>
      </div>
      
      {/* this is the actual right pane div */}
      <div className="w-3/4 min-h-screen flex flex-col py-16">
        { children }
      </div>
    </div>
  )
}
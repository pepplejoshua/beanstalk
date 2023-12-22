import { NavLink } from "@remix-run/react";

export function BSHeader() {
  return (
    <header className="flex flex-row justify-between items-center px-10">
      <NavLink to="/" className={(_) => "text-2xl font-bold px-4"}>
        beanstalk
      </NavLink>

      {/* This is the section for links */}
      <nav className="flex p-4 space-x-8 text-xl">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "font-bold border-y-2 border-current p-2" : "p-2"
          }
        >
          home
        </NavLink>
        <NavLink
          to="/shop"
          className={({ isActive }) =>
            isActive ? "font-bold border-y-2 border-current p-2" : "p-2"
          }
        >
          shop
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "font-bold border-y-2 border-current p-2" : "p-2"
          }
        >
          about
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive ? "font-bold border-y-2 border-current p-2" : "p-2"
          }
        >
          log on
        </NavLink>
      </nav>
    </header>
  );
}

import { Form } from "@remix-run/react";
import React from "react";

// this will be the entry point for the gbf area
// it will present a login screen
export default function GBF() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleShowPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowPassword(event.target.checked);
  }

  return (
    <div className="w-full">
      <Form method="post" action="/gbf" className="text-center w-full">
        <h1 className="text-6xl font-bold text-center">
          sign in to beanstalk
        </h1>
        <div className="mt-20 w-full">
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
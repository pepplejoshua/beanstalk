import { Link } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { ExpenseItem } from "~/types";

export default function Expense({expense}: {expense: ExpenseItem}) {
  // format date to show readable date: Fri, 12 Feb 2021
  const expenseDate = new Date(expense.expenseDate);
  const formattedDate = expenseDate.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: Event) {
      // ignore .contains error
      // @ts-ignore
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowPopover(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mt-5 flex flex-row border-2 rounded-lg px-5 py-3">
      <div className="w-2/5 flex flex-col">
        <h1 className="text-3xl font-bold">
          {expense.label}
        </h1>
        <h2 className="italic text-sm">
          {formattedDate}
        </h2>
          
        <span className="text-lg font-bold text-gray-600">
          {expense.details}
        </span>
      </div>

      <div className="ml-20 w-1/5 flex flex-row items-center justify-center">
        <span className="text-2xl font-bold text-red-600">
          -₦{expense.totalAmount}
        </span>
      </div>

      {/* add a section for editing a user */}
      <div className="w-2/5 items-center flex flex-row justify-end">
        <Link to={`view/${expense.id}?edit=true`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          edit
        </Link>

        <Link to={`view/${expense.id}?clone=true`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-3">
          clone
        </Link>

        {/* deleting should show a popover */}
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-3"
          onClick={() => setShowPopover(true)}>
          delete
        </button>

        {/* popover */}
        { showPopover && (
          <div ref={popoverRef} className="absolute border-2 p-4 rounded-lg shadow-xl bg-white -mt-10 -ml-8">
            <p className="text-lg font-bold">Are you sure you want to delete this expense?</p>
            <div className="flex flex-row justify-end">
              <Link reloadDocument to={`/expenses/delete/${expense.id}`} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-5 mr-3">yes</Link>
              <button onClick={() => setShowPopover(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5">no</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
import type { SaleItem } from "~/types";

export default function Sale({sale}: {sale: SaleItem}) {
  return (
    <div className="mt-5 flex flex-row border-2 rounded-lg px-5 py-3">
      <div className="w-2/5 flex flex-col">
        <h1 className="text-3xl font-bold">
          {sale.label}
        </h1>
        <h2 className="italic text-sm">
          {sale.saleDate}
        </h2>
          
        <span className="text-lg font-bold text-gray-600">
          {sale.details || 'no details'}
        </span>

        <span className="text-lg font-bold text-gray-600">
          {sale.totalAmount}
        </span>
      </div>
    </div>
  )
}
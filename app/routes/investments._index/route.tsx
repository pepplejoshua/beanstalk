import BeanLayout from "~/components/bean_layout";

export default function InvestmentsList() {
  return (
    <BeanLayout>
      <h1 className="text-5xl font-bold text-center mb-10">
        investments
      </h1>

      <div className="ml-10 mt-5 flex flex-row">
        <a href="/investments/view/0"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded">
          new investment
        </a>
      </div>
    </BeanLayout>
  )
}
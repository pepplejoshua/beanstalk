import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "beanstalk • about" },
    { name: "description", content: "About Beanstalk." },
  ];
};

export default function About() {
  return (
    <div>
      <p className="p-4 text-xl">
        A general application for managing inventory for GreenBean Farms, while
        listing them as products on the web for sale, along with the product of
        other farms, to create a digital farmers market.
      </p>
    </div>
  );
}

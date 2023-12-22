import type { MetaFunction } from "@remix-run/node";
import { BSButton } from "~/components/bsbutton";
import Feature from "~/components/feature";

export const meta: MetaFunction = () => {
  return [
    { title: "beanstalk" },
    { name: "description", content: "Welcome to Beanstalk!" },
  ];
};

export default function Index() {
  return (
    <div>
      <section className="text-center">
        {/* Hero Section */}
        <h1 className="text-5xl font-bold text-center mb-5">
          beanstalk is a new way <br />
          to manage your farm.
        </h1>

        <p className="p-4 text-2xl">
          beanstalk is an application for business management of a small /
          medium scale farm. it does this by offering a simple but nimble
          combination of: an inventory management system, a sales management
          system, and a customer management system. All integrated into a single
          application.
        </p>

        {/* Get Started Button */}
        <BSButton className="py-5 px-5 mt-10">
          <span className="mr-1">Get started</span>
          {/* Heroicon name: chevron-right */}
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.46967 11.4697C5.17678 11.7626 5.17678 12.2374 5.46967 12.5303C5.76256 12.8232 6.23744 12.8232 6.53033 12.5303L10.5303 8.53033C10.8207 8.23999 10.8236 7.77014 10.5368 7.47624L6.63419 3.47624C6.34492 3.17976 5.87009 3.17391 5.57361 3.46318C5.27713 3.75244 5.27128 4.22728 5.56054 4.52376L8.94583 7.99351L5.46967 11.4697Z"></path>
          </svg>
        </BSButton>
      </section>

      {/* Features Section */}
      <section>
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            <Feature
              title={"Inventory Management"}
              description={`beanstalk offers a simple and intuitive interface for
                    managing your farm's inventory. You can easily add, edit,
                    and delete items from your inventory.`}
            />

            <Feature
              title="Sales Management"
              description={`beanstalk makes it easy to keep track of your sales. You
              can easily track online and in-person sales.`}
            />

            <Feature
              title={"Customer Management"}
              description={`beanstalk knows your customers are important. That's why
              we make it easy to keep track of them. You can easily add, edit, and delete customers from your customer list.
              tracking repeat customers is a breeze.`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

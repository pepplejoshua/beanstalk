import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "beanstalk" },
    { name: "description", content: "Welcome to Beanstalk!" },
  ];
};

// landing page for anyone who visits the link
// till we add the pinhole for external
// parties
export default function Index() {
  return (
    <div>
      <section className="text-center">
        {/* Hero Section */}
        <h1 className="text-6xl font-bold text-center mb-5">
          beanstalk is a new way <br />
          to manage our farm.
        </h1>

        <p className="p-4 text-3xl">
          spreadsheets were a great way to get started modelling the business but as we began to execute, 
          it became difficult to track and guarantee correctness of important information
          (purchase, sale, inventory and investment information) coming from different sources as we live in different
          timezones.
        </p>

        <p className="p-4 text-3xl">
          beanstalk is a bespoke application for managing our farm, our small farm business. It will handle our
          purchase, sale, inventory and investment information internally and also open up a pinhole for
          potential investors, customers and other interested external parties into our working effort.
        </p>
      </section>
      
      {/* into the pinhole for external parties */}
    </div>
  );
}

export async function loader({request}: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/home',
  });
}
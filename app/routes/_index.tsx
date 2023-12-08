import type { MetaFunction } from "@remix-run/node";
import { TButton } from "~/components/tbutton";

export const meta: MetaFunction = () => {
  return [
    { title: "beanstalk" },
    { name: "description", content: "Welcome to Beanstalk!" },
  ];
};

export default function Index() {
  return (
    <div>
      <h1 className="text-2xl font-bold p-4">beanstalk</h1>

      <p className="p-4 text-xl">
        An application for tracking, managing and displaying business events for
        GreenBean Farms' Snail business.
      </p>

      <TButton>Basic Button</TButton>
    </div>
  );
}

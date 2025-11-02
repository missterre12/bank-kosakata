import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { pb } from "../pocketbase";

export const Route = createFileRoute("/_auth")({
  beforeLoad: () => {
    const valid = pb.authStore.isValid;
    if (valid) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}

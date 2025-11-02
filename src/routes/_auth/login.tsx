import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { LogInIcon } from "lucide-react";
import { pb } from "../../pocketbase";

export const Route = createFileRoute("/_auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter()
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const formElement = e.target as HTMLFormElement;
    const fd = new FormData(formElement);
    const username = fd.get("username")?.toString() ?? "";
    const password = fd.get("password")?.toString() ?? "";

    try {
      await pb.collection("users").authWithPassword(username, password);
    } catch (error) {
      console.error(error)
      alert("Sorry! Login Failed :( Please Check Your Username or Password!")
      return 
    } 
    router.navigate({
      to:"/"
    })

  };
  return (
    <div className="flex flex-1 items-center justify-center w-full">
      <div className="flex flex-col w-1/5">
        <div className="flex flex-col gap-5">
          <form action="" className="contents" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Masukkan username"
                required
                className="bg-white w-full border border-neutral-500/70 rounded-lg ps-2.5 h-10"
              />
              <label className="font-medium" htmlFor="password">
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Masukkan kata sandi"
                required
                className="bg-white w-full border border-neutral-500/70 rounded-lg ps-2.5 h-10"
              />
              <button className="underline text-sky-600 text-end" type="button">
                Lupa Kata Sandi?
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              <button
                type="submit"
                className="bg-sky-600 flex flex-row rounded-lg w-full h-12 text-white items-center justify-center gap-1 hover:cursor-pointer"
              >
                <LogInIcon /> Login
              </button>
              <p className="flex justify-between">
                Belum punya akun?{" "}
                <Link to="/register" className="underline text-sky-600">
                  Daftar
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

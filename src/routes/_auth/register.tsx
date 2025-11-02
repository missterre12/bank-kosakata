import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { LogInIcon } from "lucide-react";
import { pb } from "../../pocketbase";

export const Route = createFileRoute("/_auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const formElement = e.target as HTMLFormElement;
    const fd = new FormData(formElement);
    const fullName = fd.get("fullname")?.toString() ?? "";
    const username = fd.get("username")?.toString() ?? "";
    const email = fd.get("email")?.toString() ?? "";
    const password = fd.get("password")?.toString() ?? "";
    const confirmPassword = fd.get("confirm-password")?.toString() ?? "";

    try {
      await pb
        .collection("users")
        .create({
          email: email,
          name: fullName,
          username: username,
          password: password,
          passwordConfirm: confirmPassword,
        });
    } catch (error) {
      console.error(error);
      alert("Sorry! Register Failed!");
      return;
    }
    router.navigate({
      to: "/login",
    });
  };
  return (
    <div className="flex flex-1 items-center justify-center w-full">
      <div className="flex flex-col w-1/5">
        <div className="flex flex-col gap-5">
          <form action="" className="contents" onSubmit={handleRegister}>
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="fullname">
                Nama Lengkap
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                placeholder="Masukkan nama lengkap"
                required
                className="bg-white w-full border border-neutral-500/70 rounded-lg ps-2.5 h-10"
              />
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
              <label className="font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                placeholder="Masukkan email"
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
              <label className="font-medium" htmlFor="password">
                Konfirmasi Kata Sandi
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="Konfirmasi kata sandi"
                required
                className="bg-white w-full border border-neutral-500/70 rounded-lg ps-2.5 h-10"
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <button
                type="submit"
                className="bg-sky-600 flex flex-row rounded-lg w-full h-12 text-white items-center justify-center gap-1 hover:cursor-pointer"
              >
                <LogInIcon /> Daftar
              </button>
              <p className="flex justify-between">
                Sudah punya akun?{" "}
                <Link to="/login" className="underline text-sky-600">
                  Masuk
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { getWord } from "@/words";

export default function LoginPage() {
  // async function authenticate() {
  //   "use server";

  //   const state = Math.random().toString(36).substring(2, 20);
  //   const cookieStore = await cookies();
  //   cookieStore.set("state", state);
  //   redirect(
  //     `${process.env.AUTH_AUTHORIZATION_URL}?client_id=${process.env.AUTH_CLIENT_ID}&redirect_uri=${process.env.BASE_URL + "login/callback"}&response_type=code&state=${state}&scope=openid%20profile`,
  //   );
  // }

  async function createGuest() {
    "use server";

    // const uuid = randomUUID();
    // const cookieStore = await cookies();
    // cookieStore.set("user", uuid, {
    //   maxAge: 7 * 86400,
    // });
    // console.log(await getWord(uuid));
    redirect("/");
  }

  return (
    <div className="flex h-96 w-screen flex-col items-center">
      <h1 className="mb-6 text-3xl text-center">Login or become a guest</h1>
      {/* <form action={authenticate}>
        <button
          type="submit"
          className="m-4 h-16 w-screen sm:w-44 transform bg-gray-600 transition hover:scale-105 cursor-pointer"
        >
          Login
        </button>
      </form> */}
      <form action={createGuest}>
        <button
          type="submit"
          className="m-4 h-16 w-screen sm:w-44 transform bg-gray-600 transition hover:scale-105 cursor-pointer"
        >
          Guest
        </button>
      </form>
    </div>
  );
}

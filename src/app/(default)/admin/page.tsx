import { getAccessToken, removeAccessToken } from "@/API";
import { permission } from "@/auth";
import SpotifyAuth from "@/components/SpotifyAuth";
import { JwtToken, Settings } from "@/types";
import { getSettings, updateSettings } from "@/utils";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const spotifyLoggedIn = await getAccessToken();
  const settings = await getSettings();
  const jwt = cookies().get("jwt")?.value;
  // Authenticated / permission
  const authenticated = await permission(undefined, jwt);
  // Check if user has any admin roles
  const roles = jwt ? (jwtDecode(jwt) as JwtToken).group_list : null;
  const admin =
    roles != null
      ? roles
          .map((role) => {
            if (settings?.enableAdminRoles.includes(role)) return true;
          })
          .includes(true)
      : false;

  const OptionContainer = ({
    name,
    text,
    value,
    type,
  }: {
    name: string;
    text: string;
    value: string;
    type: string;
  }) => {
    return (
      <div className="flex justify-between w-full mb-2">
        <label htmlFor={name}>{text}</label>
        {type == "checkbox" && (
          <input
            type={type}
            name={name}
            defaultChecked={value == "on" ? true : false}
          />
        )}
        {type == "text" && (
          <input
            type={type}
            name={name}
            defaultValue={value}
            className="text-sm w-2/3 overflow-y-auto"
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen flex-col items-center *:text-white">
      <div className="w-full *:text-xl lg:w-1/2 sm:w-2/3">
        <h1 className="mb-4 text-center !text-3xl">Settings</h1>
        {authenticated && admin && settings && (
          <form
            className="flex flex-col justify-between"
            action={async (formData: FormData) => {
              "use server";
              const newSettings: Settings = {
                votingEnabled: formData.get("votingEnabled") as string,
                enableGuests: formData.get("enableGuests") as string,
                requireAccount: formData.get("requireAccount") as string,
                bannedUsers: (formData.get("bannedUsers") as string).split(","),
                enableAdminRoles: (
                  formData.get("enableAdminRoles") as string
                ).split(","),
              };

              updateSettings(newSettings);
              redirect("/");
            }}
          >
            <OptionContainer
              name="votingEnabled"
              text="Enable voting"
              value={settings.votingEnabled}
              type="checkbox"
            />
            <OptionContainer
              name="enableGuests"
              text="Enable guest accounts"
              value={settings.enableGuests}
              type="checkbox"
            />
            <OptionContainer
              name="requireAccount"
              text="Require account"
              value={settings.requireAccount}
              type="checkbox"
            />
            <OptionContainer
              name="bannedUsers"
              text="Banned users"
              value={settings.bannedUsers.join(",")}
              type="text"
            />
            <OptionContainer
              name="enableAdminRoles"
              text="Admin roles"
              value={settings.enableAdminRoles.join(",")}
              type="text"
            />
            <button
              type="submit"
              className="box-border w-full transform bg-slate-400 p-2 transition hover:scale-105"
            >
              Apply settings
            </button>
          </form>
        )}
        {/* Guests have option to login */}
        {!jwt && cookies().get("user")?.value && (
          <form
            action={async () => {
              "use server";
              redirect("/login?guest=true");
            }}
            className="mb-3"
          >
            <button
              type="submit"
              className="box-border w-full transform bg-green-600 p-2 transition hover:scale-105"
            >
              Login to account
            </button>
          </form>
        )}
        {!spotifyLoggedIn?.access_token && <SpotifyAuth />}
        {admin && spotifyLoggedIn?.access_token && (
          <form action={removeAccessToken} className="mt-3">
            <button
              type="submit"
              className="box-border w-full transform bg-red-600 p-2 transition hover:scale-105"
            >
              Logout of spotify
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

"use server";
import { redirect } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { log } from "@/utils";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  const url = process.env.BASE_URL + "login/callback";
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    log("Authentication callback return with empty code");
    redirect("/login");
  } else {
    headers();
    const token = await axios
      .post(
        process.env.AUTH_TOKEN_URL!,
        {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: url,
          client_id: process.env.AUTH_CLIENT_ID!,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .catch((err) => {
        log("Couldn't get access token");
        log(err.response.status);
        log(JSON.stringify(err.response.data));
      });

      console.log({token})

    const res = NextResponse.redirect(
      new URL("/", req.nextUrl.protocol + req.headers.get("host")),
      { status: 302 }
    );
    res.cookies.set(
      "jwt",
      (token as AxiosResponse<any, any>)?.data?.access_token,
      {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 86400,
      }
    );

    return res;
  }
}

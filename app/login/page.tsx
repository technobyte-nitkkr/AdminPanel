"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession(); 
  console.log(session);
  console.log(status);
  const router = useRouter();

  if (status === "authenticated") {
    router.push("/dashboard");
    return null;
  }

  return (
    <div>
      {status === "loading" ? (
        <p>Loading...=</p>
      ) : (
        <>
          <p>Please log in:</p>
          <button onClick={() => signIn("google")}>Sign in with Google</button>
        </>
      )}
    </div>
  );
}

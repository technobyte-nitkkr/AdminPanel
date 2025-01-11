"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/db";
import { collection, query, where, doc, getDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function withAdmin(Component: React.FC) {
  
  return function AdminProtectedPage(props: any) {
    const { data: session, status } = useSession();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); 

    useEffect(() => {
      const checkAdmin = async () => {
        if (status === "authenticated" && session!==null) {
          const userEmail = session.user?.email;

          if (userEmail) {
            try {
              const adminQuery =doc(db,"admin",userEmail);

              const querySnapshot = await getDoc(adminQuery);
              if (querySnapshot.exists()) {
                setIsAdmin(true);
              } else {
                console.log(querySnapshot);
                alert("You do not have admin access.");
                router.push("/login");
              }
            } catch (error) {
              console.error("Error checking admin access:", error);
              router.push("/login");
            }
          } else {
            router.push("/login");
          }
        } else if (status === "unauthenticated") {
          router.push("/login");
        }

        setLoading(false);
      };

      checkAdmin();
    }, [session, status, router]);

    if (loading) {
      return <p>Loading...</p>;
    }

    return isAdmin ? <Component {...props} /> : null;
  };
}

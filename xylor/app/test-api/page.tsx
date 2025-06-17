"use client";
import React, { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // pass cookies
    const getLoggedUser = async () => {
      const response = await fetch("/api/method/frappe.auth.get_logged_user", {
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
    };
    getLoggedUser();
  }, []);

  return <div>page</div>;
}

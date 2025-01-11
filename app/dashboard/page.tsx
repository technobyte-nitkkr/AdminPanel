"use client";

import withAdmin from "@/lib/withAdmin";

function DashboardPage() {
  return <p>Welcome to the admin dashboard!</p>;
}

export default withAdmin(DashboardPage);

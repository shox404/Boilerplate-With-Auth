"use client"

import { useAuthGuard } from "@/hooks/use-auth-guard";
import Loading from "@/components/loading";

export default function Page() {
  const { loading, member } = useAuthGuard();

  if (loading) return <Loading />

  return (
    member && <div className="flex flex-col max-w-3xl mx-auto gap-5 py-3 px-4 sm:px-6">
      <div className="flex flex-col items-center gap-2 border rounded-4xl p-6 w-full transition-colors duration-300 bg-card">
        Joined: {member.$createdAt ? new Date(member.$createdAt).toDateString() : "—"}
        {member.email && <div>Email: {member.email}</div>}
      </div>
    </div>
  );
}

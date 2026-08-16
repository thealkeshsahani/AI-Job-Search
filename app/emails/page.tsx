"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { EmailHistoryView } from "@/components/emails/EmailHistoryView";

export default function EmailsPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto">
        <EmailHistoryView />
      </main>
    </div>
  );
}

import { Suspense } from "react";
import { Mail } from "lucide-react";
import { prisma, serializePrisma } from "@/lib/prisma";
import { MessageActions } from "@/components/control/message-actions";

export const metadata = {
  title: "Messages — PHAGLP Control",
};

async function getMessages() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return serializePrisma(messages);
  } catch {
    return [];
  }
}

async function MessagesTable() {
  const messages = await getMessages();
  const unreadCount = messages.filter((m: any) => !m.isRead).length;

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
          <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <p className="text-sm text-cyan-700 dark:text-cyan-300 font-medium">
            {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {messages.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No messages yet</p>
            </div>
          ) : (
            messages.map((msg: any) => (
              <div
                key={msg.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors ${
                  !msg.isRead ? "bg-cyan-50/40 dark:bg-cyan-900/10" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                      )}
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {msg.subject}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      From: <span className="font-medium">{msg.name}</span> &lt;
                      {msg.email}&gt;
                      {" · "}
                      {new Date(msg.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {msg.message}
                    </p>
                  </div>
                  <MessageActions id={msg.id} isRead={msg.isRead} />
                </div>
              </div>
            ))
          )}
        </div>
        {messages.length > 0 && (
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">
              {messages.length} message{messages.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
          <Mail className="w-4 h-4" />
          <span>Inbox</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Messages
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Contact form submissions from the public website.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        }
      >
        <MessagesTable />
      </Suspense>
    </div>
  );
}

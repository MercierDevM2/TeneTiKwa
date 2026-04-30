"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function NotificationsPage() {
  const supabase = createClient();

  const [notifications, setNotifications] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      setSession(session);

      // 1️⃣ Récupérer les notifications
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setNotifications(data || []);

      // 2️⃣ Marquer comme lu (ICI 🔥)
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", session.user.id);
    };

    init();
  }, []);

  return (
    <div>
      <h1>Notifications</h1>

      {notifications.length === 0 ? (
        <p>Aucune notification</p>
      ) : (
        notifications.map((n) => (
          <div key={n.id}>{n.message}</div>
        ))
      )}
    </div>
  );
}
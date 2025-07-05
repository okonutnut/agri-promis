"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function Home() {
  const supabase = createClient();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUser = async () => {
      const { data: user } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    setLoading(false);
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      <p>{user?.user?.email}</p>
      <p>{user?.user?.id}</p>
      {loading && <p>Loading...</p>}
    </div>
  );
}

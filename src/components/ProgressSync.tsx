import { useEffect } from "react";

import { supabase } from "@/integrations/supabase/client";
import {
  asJson,
  mergeBadges,
  mergeExtras,
  readDevice,
  writeDevice,
  type Badges,
  type Extras,
} from "@/lib/progressSync";

/** Invisible: merges device progress into the account on sign-in, then saves changes. */
export function ProgressSync() {
  useEffect(() => {
    let userId: string | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const push = async () => {
      if (!userId) return;
      const { badges, extras } = readDevice();
      await supabase
        .from("learner_progress")
        .upsert({ user_id: userId, badges: asJson(badges), extras: asJson(extras) });
    };
    const schedulePush = () => {
      if (!userId) return;
      clearTimeout(timer);
      timer = setTimeout(() => void push(), 800);
    };

    const pull = async (id: string) => {
      const { data } = await supabase
        .from("learner_progress")
        .select("badges, extras")
        .eq("user_id", id)
        .maybeSingle();
      const device = readDevice();
      const badges = mergeBadges(device.badges, (data?.badges ?? {}) as Badges);
      const extras = mergeExtras(device.extras, (data?.extras ?? {}) as Extras);
      writeDevice(badges, extras);
      window.dispatchEvent(new Event("dh-progress"));
      await push();
    };

    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        userId = data.user.id;
        void pull(data.user.id);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user && session.user.id !== userId) {
        userId = session.user.id;
        void pull(session.user.id);
      } else if (event === "SIGNED_OUT") {
        userId = null;
      }
    });

    window.addEventListener("dh-progress", schedulePush);
    return () => {
      clearTimeout(timer);
      sub.subscription.unsubscribe();
      window.removeEventListener("dh-progress", schedulePush);
    };
  }, []);
  return null;
}

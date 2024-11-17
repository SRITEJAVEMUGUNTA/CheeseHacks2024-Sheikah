import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "connections";

const supabaseAnonKey = "apikey";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export function getImage({ url }: { url: string }) {
  return supabase.storage.from("image").getPublicUrl(url);
}

export const fetchPrompt = async ({ userId }: { userId: string }) => {
  const { data, error } = await supabase
    .from("User")
    .select("characterBackground")
    .eq("username", userId)
    .single(); // Ensures only one row is returned
  if (error) {
    console.error(error);
    return [];
  }
  return data ? data.characterBackground : null;
};

export const fetchWaypoints = async () => {
  try {
    // Replace 'waypoints' with your table name
    const { data, error } = await supabase
      .from("Waypoints")
      .select("latitude, longitude, description");

    if (error) {
      console.error("Error fetching waypoints:", error);
      return [];
    }
    console.log(data);
    return data || []; // Return the waypoints or an empty array
  } catch (err) {
    console.error("Unexpected error:", err);
    return [];
  }
};

export function addCollectible({
  id,
  wayPointId,
  userId,
}: {
  id: string;
  wayPointId: string;
  userId: string;
}) {
  const data = supabase.from("Collectible").insert({ id, wayPointId, userId });
  return data;
}

export function addUser({
  username,
  displayedCollectibleID,
  collectibleIDs,
  LLMPrompts,
  waypointIds,
}: {
  username: string;
  displayedCollectibleID: string;
  collectibleIDs: string[];
  LLMPrompts: JSON;
  waypointIds: string[];
}) {
  return supabase.from("User").insert({
    username,
    displayedCollectibleID,
    collectibleIDs,
    LLMPrompts,
    waypointIds,
  });
}

export async function swapCollectibles({
  userTo,
  userFrom,
  collectTo,
  collectFrom,
}: {
  userTo: string;
  userFrom: string;
  collectTo: string;
  collectFrom: string;
}) {
  // Fetch the collectible from userFrom
  const { data: collectFromData, error: collectFromError } = await supabase
    .from("Collectible")
    .select("*")
    .eq("userId", userFrom)
    .eq("id", collectFrom)
    .single(); // Assuming collectFrom is the id of the collectible

  // Fetch the collectible from userTo
  const { data: collectToData, error: collectToError } = await supabase
    .from("Collectible")
    .select("*")
    .eq("userId", userTo)
    .eq("id", collectTo)
    .single(); // Assuming collectTo is the id of the collectible

  if (collectFromError || collectToError) {
    console.error(
      "Error fetching collectibles:",
      collectFromError || collectToError
    );
    return;
  }

  // Update userId for collectFrom to userTo
  const { error: updateCollectFromError } = await supabase
    .from("Collectible")
    .update({ userId: userTo })
    .eq("id", collectFrom);

  // Update userId for collectTo to userFrom
  const { error: updateCollectToError } = await supabase
    .from("Collectible")
    .update({ userId: userFrom })
    .eq("id", collectTo);

  if (updateCollectFromError || updateCollectToError) {
    console.error(
      "Error updating collectibles:",
      updateCollectFromError || updateCollectToError
    );
    return;
  }

  console.log("Collectibles swapped successfully!");
}

export function getUsers({ username }: { username: string }) {
  return supabase.from("User").select().eq("username", username);
}

export async function selectCollectible({ userId }: { userId: string }) {
  return await supabase.from("Collectible").select().eq("userId", userId);
}

export async function getTrades({ userId }: { userId: string }) {
  return await supabase.from("Trade").select().eq("username2", userId);
}

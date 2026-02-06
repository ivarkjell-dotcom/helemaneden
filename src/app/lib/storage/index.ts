import type { StorageAdapter } from "./types";
import { localStorageAdapter } from "./local";

// Bytt her senere:
// import { supabaseAdapter } from "./supabase";

export const storage: StorageAdapter = localStorageAdapter;

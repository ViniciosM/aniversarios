import { createClient } from '@supabase/supabase-js';
//import { useSession } from 'next-auth/react'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
//const { supabaseAccessToken } = useSession

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
  //{
  // global: {
  //   headers: {
  //     Authorization: `Bearer ${supabaseAccessToken}`,
  //   },
  // },
//}
//);


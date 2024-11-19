//import { getServerSession } from "next-auth";
import { handlers } from "../../../../../auth";
//import { NEXT_AUTH } from "@/lib/auth";

export const { GET, POST } = handlers

// export async function GET_SESSION(){
//     const session = await getServerSession(NEXT_AUTH);
//     return NextResponse.json({
//         session
//     })
// }
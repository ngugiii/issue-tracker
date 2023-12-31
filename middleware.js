export { default } from "next-auth/middleware"
import { getSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import {  NextResponse } from "next/server";



export const config = {matcher:["/issues","/dashboard"]};

// export async function middleware(request) {
//     const session = await getSession({ req: request });
//     console.log(session);
  
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
  
//     const accessToken = session.accessToken;
//     try {
//         const decoded = jwtDecode(accessToken);
//       console.log(decoded);
//       return NextResponse.next();
//     } catch (error) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }
//   }
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (username === "adm" && password === "adm") {
      const response = NextResponse.json({ success: true });
      // Set secure auth cookie valid for 7 days
      response.cookies.set("admin_session", "authenticated_adm", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: "Usuário ou senha incorretos." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Erro no processamento do login." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}

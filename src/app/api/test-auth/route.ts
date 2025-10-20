import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    return NextResponse.json({
      authenticated: !!session,
      user: session?.user || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Auth test error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 
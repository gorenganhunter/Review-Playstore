import { NextResponse } from "next/server";
import { mecutAISuruhAnalisisReview } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validasi minimal
    if (!body.reviews || !Array.isArray(body.reviews)) {
      return NextResponse.json(
        { error: "Field 'reviews' harus berupa array string." },
        { status: 400 }
      );
    }

    // Jalankan analisis
    const result = await mecutAISuruhAnalisisReview(body.reviews);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { handleEnquiry } from "@/lib/enquiries";

export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(request: Request) {
  return handleEnquiry(request, process.env);
}

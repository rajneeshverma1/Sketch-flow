import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { cookies } from 'next/headers'
import { getUserId } from "@/lib/getDetails";

export default async function Home() {

  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value;
  const userId = getUserId(token!);

  return (
    <div className="min-h-screen bg-[#EAF4FF]">
      <Navbar token={token} />
      <main>
        <HeroSection token={token} userId={userId} />
      </main>
    </div>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import useModalStore from "@/store/modal-store";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface HeroSection {
  token?: string | null;
  userId?: string | null;
}


const HeroSection = ({
  token,
  userId
}: HeroSection) => {

  const {onOpen} = useModalStore();
  const router = useRouter()

  function handleStartDrawing() {
    try {
      
      if(!token || !userId) {
        return toast.error("Please login to start drawing!");
      }

      onOpen("create-room-modal",{userId})

    } catch (error) {
      
    }
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-32 bg-[#EAF4FF]">
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Hero Content - Center Aligned */}
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Main Headline */}
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.15] text-gray-900 tracking-tight"
          >
            All-in-One Digital Banking for Community Financial Institutions
          </h1>

          {/* Subheadline */}
          <p 
            className="text-base sm:text-lg lg:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed opacity-90"
          >
            Your community connection is what sets you apart. Bankjoy&apos;s secure, innovative platform helps you amplify it and win in the digital world
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Button 
              onClick={handleStartDrawing} 
              className="group relative bg-gradient-to-r from-[hsl(174,72%,56%)] to-cyan-500 hover:from-[hsl(174,72%,60%)] hover:to-cyan-400 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-[hsl(174,72%,56%)]/25 hover:shadow-xl hover:shadow-[hsl(174,72%,56%)]/35 transition-all duration-300 hover:-translate-y-0.5"
              size="xl"
            >
              Start Drawing Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            {token && (
              <Button 
                onClick={() => router.push("/dashboard")} 
                className="group border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:border-gray-400 shadow-md hover:shadow-lg"
                size="xl"
              >
                Go to Dashboard
              </Button>
            )}
            {!token && (
              <Button 
                onClick={() => router.push("/auth/sign-in")} 
                className="group border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:border-gray-400 shadow-md hover:shadow-lg"
                size="xl"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            )}
          </div>

          {/* White Rounded Section Below Buttons */}
          <div className="mt-8 mx-auto max-w-6xl">
            <div className="bg-white rounded-[30px] shadow-2xl shadow-gray-300/50 p-8 sm:p-12 lg:p-16 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[hsl(174,72%,56%)] to-cyan-500 rounded-2xl mb-6">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  Built for the Future
                </h3>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                  Experience next-generation digital banking solutions designed specifically for community financial institutions
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
"use client"
import { Button } from "@/components/ui/button";
import useModalStore from "@/store/modal-store";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

interface CTASectionProps {
  token?: string | null;
  userId?: string | null;
}

const CTASection = ({token,userId}: CTASectionProps) => {
  const {onOpen} = useModalStore();

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
    <section className="py-32 relative overflow-hidden">
      {/* Enterprise gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(222,47%,11%)] to-[hsl(222,47%,11%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[300px] bg-gradient-to-r from-[hsl(217,91%,60%)]/15 to-[hsl(174,72%,56%)]/15 blur-[100px] rounded-full" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[hsl(210,40%,98%)] leading-tight">
            Ready to Transform Your
            <br />
            Team&apos;s Workflow?
          </h2>
          <p className="text-lg text-[hsl(215,20%,70%)] mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of teams collaborating visually in real-time.
            <span className="block mt-2 text-[hsl(217,91%,70%)] font-medium">No credit card required · Free forever</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={handleStartDrawing} 
              className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,65%)] text-white font-semibold px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-200" 
              size="lg"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-14 pt-10 border-t border-[hsl(222,47%,25%)]/30">
            <div className="text-center">
              <div className="text-xl font-bold text-[hsl(210,40%,98%)]">100% Free</div>
              <div className="text-sm text-[hsl(215,20%,65%)] mt-1">Forever</div>
            </div>
            <div className="h-8 w-px bg-[hsl(222,47%,25%)]" />
            <div className="text-center">
              <div className="text-xl font-bold text-[hsl(210,40%,98%)]">Open Source</div>
              <div className="text-sm text-[hsl(215,20%,65%)] mt-1">MIT License</div>
            </div>
            <div className="h-8 w-px bg-[hsl(222,47%,25%)]" />
            <div className="text-center">
              <div className="text-xl font-bold text-[hsl(210,40%,98%)]">No Setup</div>
              <div className="text-sm text-[hsl(215,20%,65%)] mt-1">Start instantly</div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default CTASection;
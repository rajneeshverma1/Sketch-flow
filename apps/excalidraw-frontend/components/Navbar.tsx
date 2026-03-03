"use client";

import { Button } from "@/components/ui/button";
import useModalStore from "@/store/modal-store";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  token?: string | null;
}

const Navbar = ({
  token
}: NavbarProps) => {

  const router = useRouter()
  const {onOpen} = useModalStore()
 
  async function handleLogout() {
    onOpen("logout-modal")
  }


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[hsl(222,47%,25%)]/20 bg-[hsl(222,47%,11%)]/95 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(217,91%,60%)]/20 to-[hsl(174,72%,56%)]/20 border border-[hsl(217,91%,60%)]/30 group-hover:border-[hsl(217,91%,60%)]/50 transition-all duration-300">
            <Pencil className="h-5 w-5 text-[hsl(217,91%,60%)]" />
          </div>
          <span className="text-xl font-bold text-[hsl(210,40%,98%)]">
            SketchFlow
          </span>
        </a>

        {/* Center Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          <button className="text-[hsl(215,20%,75%)] hover:text-[hsl(210,40%,98%)] font-medium text-sm transition-colors duration-200">
            Products
          </button>
          <button className="text-[hsl(215,20%,75%)] hover:text-[hsl(210,40%,98%)] font-medium text-sm transition-colors duration-200">
            Resources
          </button>
          <button className="text-[hsl(215,20%,75%)] hover:text-[hsl(210,40%,98%)] font-medium text-sm transition-colors duration-200">
            Company
          </button>
          <button className="text-[hsl(215,20%,75%)] hover:text-[hsl(210,40%,98%)] font-medium text-sm transition-colors duration-200">
            Pricing
          </button>
        </div>

        {/* Right side - Auth Buttons */}
        {token ? (
          <div className="flex items-center gap-3">
            <Button onClick={handleLogout} className="text-[hsl(215,20%,75%)] hover:text-[hsl(210,40%,98%)] hover:bg-[hsl(222,47%,18%)] font-medium transition-all duration-200" variant="ghost" size="sm">
              Log Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button onClick={() => router.push("/auth/sign-in")} className="text-[hsl(215,20%,75%)] hover:text-[hsl(210,40%,98%)] hover:bg-[hsl(222,47%,18%)] font-medium transition-all duration-200 px-5" variant="ghost" size="sm">
              Login
            </Button>
            <Button onClick={() => router.push("/auth/sign-up")} className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,65%)] text-white font-semibold px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-200" size="sm">
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
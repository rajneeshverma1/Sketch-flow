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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <span className="text-xl font-bold text-gray-900">
            SketchFlow
          </span>
        </a>

        {/* Center Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          <button className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200">
            Products
          </button>
          <button className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200">
            Resources
          </button>
          <button className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200">
            Company
          </button>
          <button className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200">
            Pricing
          </button>
        </div>

        {/* Right side - Auth Buttons */}
        {token ? (
          <div className="flex items-center gap-3">
            <Button onClick={handleLogout} className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium transition-all duration-200" variant="ghost" size="sm">
              Log Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button onClick={() => router.push("/auth/sign-in")} className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium transition-all duration-200 px-5" variant="ghost" size="sm">
              Login
            </Button>
            <Button onClick={() => router.push("/auth/sign-up")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-200" size="sm">
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
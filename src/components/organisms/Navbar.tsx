"use client";

import api from "@/lib/axiosInstance";
import { clearUser } from "@/redux/userSlice";
import { request } from "http";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; 

export const Navbar = () => {

  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const foundUser = useSelector((state: any) => state.user.data);

 
  useEffect(()=>{

    const checkUser = async () => {

      if(!foundUser){ 
        await handleLogout(); 
        return null;
      }
    }

    checkUser();

  },[])
 

 
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (error: any) {
      // Optionally handle error
    } finally {
      dispatch(clearUser());
      router.replace("/login");
      setIsLoggingOut(false);
    }
  }

  

    if (!foundUser) {
      return (
        <div className="flex items-center justify-center h-20 w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

  return (
    <header className="bg-black border-b border-gray-800">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Task Manager</h1>
            <p className="text-gray-400 mt-1 font-medium">Streamline your workflow</p>
          </div>

          <div className="flex items-center gap-1">

            <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-700">
              <div className="text-right">
                {/* <p className="text-xs text-gray-400 capitalize">{foundUser?.role}</p> */}
                {foundUser ? (
                  <p className="text-sm font-semibold text-white">{foundUser.email}</p>
                ) : null}
              </div>
              {/* <div className="w-9 h-9 bg-white text-black rounded-lg flex items-center justify-center font-bold text-sm">
                {user.avatar}
              </div> */}
              <button
                onClick={handleLogout}
                className={`cursor-pointer p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 flex items-center justify-center ${isLoggingOut ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={isLoggingOut}
                aria-busy={isLoggingOut}
              >
                {isLoggingOut ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

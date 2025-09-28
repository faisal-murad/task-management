"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice"; 
import api from "./axiosInstance";

export default function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me", { withCredentials: true });
        console.log("🚀 ~ fetchUser ~ res:", res)
        dispatch(setUser(res.data.user));
        // api.defaults.headers.common["Authorization"] = "Bearer " + res.data.accessToken;
      } catch (err) {
        console.log("No valid session, user logged out");
      }
    };
    fetchUser();
  }, [dispatch]);

  return <>{children}</>;
}

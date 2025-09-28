// app/signup/page.tsx (Next.js 13+ with App Router)

"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";
import api from "@/lib/axiosInstance";
import { LoginResponse } from "@/types";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser, setAccessToken } from "@/redux/userSlice";

interface FormValues { 
  email: string;
  password: string; 
}


export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false); 
  // const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const initialValues: FormValues = { 
    email: "",
    password: "", 
  };

  const validationSchema = Yup.object({ 
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Password is required"), 
  });

 


const handleSubmit = async (
  values: FormValues,
  { setSubmitting, setFieldError }: any
) => {
  try {
    // setApiError("");
    setIsSuccess(false);

    const response:LoginResponse = await api.post("/auth/login", {
      email: values.email,
      password: values.password,
    });

    const data = response.data;
    console.log("🚀 ~ handleSubmit ~ data:", data)


  dispatch(setAccessToken(data.accessToken));
  dispatch(setUser(data.user));

    setIsSuccess(true);


    toast.success("Logged in successfully!");

     if (data.user?.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/dashboard");
    }

  } catch (err: any) {
        // setApiError(err?.message || "Something went wrong. Please try again.");
        toast.warning(err?.response?.data?.message || "Something went wrong. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

 

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="bg-black p-8 text-center border-b border-gray-800">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Login</h1>
        </div>

        {/* Form */}
        <div className="p-8">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-5"> 

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Field
                      name="email"
                      type="email"
                      placeholder="john.doe@company.com"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                        errors.email && touched.email
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                          : "border-slate-300 bg-slate-50 focus:border-blue-500 focus:ring-blue-200"
                      } focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-20 text-gray-900 placeholder-gray-400`}
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600 text-xs mt-1.5 font-medium"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`w-full pl-11 pr-12 py-3 rounded-xl border transition-all duration-200 ${
                        errors.password && touched.password
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                          : "border-slate-300 bg-slate-50 focus:border-blue-500 focus:ring-blue-200"
                      } focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-20 text-gray-900 placeholder-gray-400`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 text-xs mt-1.5 font-medium"
                  />
                </div>
 
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black hover:bg-gray-900 disabled:bg-gray-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Logging in...
                    </div>
                  ) : (
                    "Log in"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          {/* Login Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-black hover:text-gray-900 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
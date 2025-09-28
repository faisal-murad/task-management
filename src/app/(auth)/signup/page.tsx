// app/signup/page.tsx (Next.js 13+ with App Router)

"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";
import api from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import Link from "next/link";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, "First name must be at least 2 characters")
      .required("First name is required"),
    lastName: Yup.string()
      .min(2, "Last name must be at least 2 characters")
      .required("Last name is required"),
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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  });
 
  interface SignupResponse {
    message: string;
    user?: {
      id: string;
      email: string;
    };
    field?: string;
  }

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setFieldError }: any
  ) => {
    try {
      setApiError("");
      setIsSuccess(false);

      const response = await api.post<SignupResponse>("/auth/signup", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      // ✅ Axios gives you `response.data` directly
      const data = response.data;
      console.log("🚀 ~ handleSubmit ~ data:", data)

      setIsSuccess(true);

      // Example: redirect after success
      // router.push("/dashboard");
    } catch (err) {
      const error = err as AxiosError<SignupResponse>;

      if (error.response) {
        const data = error.response.data;

        if (data.field) {
          setFieldError(data.field, data.message);
        } else {
          setApiError(data.message || "Something went wrong. Please try again.");
        }
      } else {
        setApiError("Network error. Please check your connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };



  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-800 p-8 text-center">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Account Created!</h2>
          <p className="text-gray-700 mb-6">
            Your account has been successfully created. Please check your email to verify your account.
          </p>
          <button
            onClick={() => window.location.href = "/login"}
            className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
          >
            Continue to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="bg-black p-8 text-center border-b border-gray-800">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm">Join us and get started today</p>
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
                {/* API Error */}
                {apiError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-medium">Error</p>
                      <p className="text-red-700 text-sm">{apiError}</p>
                    </div>
                  </div>
                )}

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      First Name
                    </label>
                    <Field
                      name="firstName"
                      type="text"
                      placeholder="John"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${errors.firstName && touched.firstName
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 bg-gray-50 focus:border-black focus:ring-black"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-20 text-gray-900 placeholder-gray-400`}
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red-600 text-xs mt-1.5 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Last Name
                    </label>
                    <Field
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${errors.lastName && touched.lastName
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 bg-gray-50 focus:border-black focus:ring-black"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-20 text-gray-900 placeholder-gray-400`}
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-red-600 text-xs mt-1.5 font-medium"
                    />
                  </div>
                </div>

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
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all duration-200 ${errors.email && touched.email
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 bg-gray-50 focus:border-black focus:ring-black"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-20 text-gray-900 placeholder-gray-400`}
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
                      className={`w-full pl-11 pr-12 py-3 rounded-xl border transition-all duration-200 ${errors.password && touched.password
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 bg-gray-50 focus:border-black focus:ring-black"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-20 text-gray-900 placeholder-gray-400`}
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

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Field
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={`w-full pl-11 pr-12 py-3 rounded-xl border transition-all duration-200 ${errors.confirmPassword && touched.confirmPassword
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 bg-gray-50 focus:border-black focus:ring-black"
                        } focus:outline-none focus:ring-2 focus:ring-opacity-20 text-gray-900 placeholder-gray-400`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
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
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          {/* Login Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-black hover:text-gray-900 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
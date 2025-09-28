import { useState } from "react";
import { FormField } from "../molecules/FormLabel";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { FaLock } from "react-icons/fa";
import { LoginResponse } from "@/types/LoginResponse"; 

export const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth() as { login: (email: string, password: string) => Promise<LoginResponse> };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // This is crucial to prevent form default behavior
    setError('');
    setLoading(true);
    try {
      const result:LoginResponse = await login(formData.email, formData.password);
      console.log("🚀 ~ handleSubmit ~ result:", result)

      if (result.success) { 
        router.replace('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error: unknown) {

      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message || 'An unexpected error occurred');
      }

      return { success: false, error: "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Professional card container */}
      <div className="bg-black border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Subtle top accent line */}
        <div className="h-1 bg-gradient-to-r from-gray-700 via-white to-gray-700"></div>

        <div className="p-8">
          {/* Header with medical cross icon */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">

              <FaLock className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-2xl font-light text-white mb-2 tracking-wide">Welcome Back</h2>
            <p className="text-gray-400 text-sm font-light">Enter your credentials to access your medical dashboard</p>
          </div>

          {error && (
            <div className="bg-gray-900 border-l-4 border-red-500 text-red-400 px-4 py-3 rounded mb-6 transition-all duration-300">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* FIXED: Added proper form element with onSubmit */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              htmlFor="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required={true}
            >
              Email Address
            </FormField>

            <FormField
              htmlFor="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={true}
            >
              Password
            </FormField>

            {/* FIXED: Changed onClick to type="submit" and removed onClick handler */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-medium rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-white"
            >
              <div className="flex items-center justify-center space-x-2">
                {loading && (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                )}
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              </div>
            </Button>
          </form>

          {/* Professional footer */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="text-center">
              <p className="text-gray-600 text-xs mt-2">
                Secured with enterprise-grade encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
"use client";

import { useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { HiLockClosed } from "react-icons/hi";
import Image from "next/image";
import Main from "../assets/images/main.png";
import { InfiniteScroll } from "@/components/infinite-scroll";

const logos = [
  "Logo 1",
  "Logo 2",
  "Logo 3",
  "Logo 4",
  "Logo 5",
  "Logo 6",
  "Logo 7",
  "Logo 8",
  "Logo 9",
  "Logo 10",
];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cookies, setCookie] = useCookies(["jwt"]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3125/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setCookie("jwt", data.token, {
          path: "/",
          secure: true,
          httpOnly: false,
        });

        alert("Signup successful!");

        router.push("/home");
      } else {
        alert(data.message || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 p-4 flex justify-center items-center">
      <div className="absolute top-4 left-4">
        <Link href="/" className="text-2xl font-bold">
          Buffer
        </Link>
      </div>
      <div className="flex w-full h-full">
        <div className="w-1/2 h-full justify-center items-center flex">
          <Card className="w-full max-w-md p-6 space-y-6 bg-white">
            <h1 className="text-2xl font-semibold text-center text-gray-900">
              Create your Buffer account
            </h1>

            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                className="w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button
                type="submit"
                className="w-full flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing up...
                  </span>
                ) : (
                  "Sign up with Email"
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-500 bg-white">OR</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <FaGoogle className="w-4 h-4" />
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <FaGithub className="w-4 h-4" />
                Continue with Github
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <HiLockClosed className="w-4 h-4" />
                Continue with SAML SSO
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </Card>
        </div>
        <div className="w-1/2 h-full justify-center items-center flex flex-col overflow-hidden">
          <Image
            src={Main}
            alt="Login"
            width={800}
            height={800}
            className="-mr-32"
          />
          <InfiniteScroll duration={30} direction="left" loop={true}>
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-40 h-20  rounded-lg"
              >
                {logo}
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}

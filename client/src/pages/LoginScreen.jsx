import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginUser } from "@/redux/slices/authSlice";
import { Eye, EyeClosed } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function LoginScreen() {
  const [eyeOpen, setEyeOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(LoginUser({ email, password }));
    } catch (error) {
      console.log(error.response.data);
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      //  Navigate to the previous route or home

      navigate("/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isAuthenticated]);

  return (
    <>
      {!isAuthenticated && (
        <form
          onSubmit={handleLogin}
          className="flex h-screen w-full -translate-y-16 items-center justify-center px-4 mt-16 xl:mt-28 "
        >
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {/* <Link to="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link> */}
                  </div>
                  <div className="relative ">
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      type={!eyeOpen ? "password" : "text"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEyeOpen((eye) => !eye);
                      }}
                      className="absolute top-0 right-2 flex items-center h-full "
                    >
                      {eyeOpen ? <Eye /> : <EyeClosed />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                {/* <Button variant="outline" className="w-full">
              Login with Google
            </Button> */}
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </>
  );
}

export default LoginScreen;

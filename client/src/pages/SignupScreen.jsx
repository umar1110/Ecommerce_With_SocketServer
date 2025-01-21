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
import { SignupUser } from "@/redux/slices/authSlice";
import { Eye, EyeClosed } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function SignupScreen() {
  const [eyeOpen, setEyeOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      dispatch(SignupUser({ email, password, firstName, lastName }));
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isAuthenticated]);

  return (
    <form
      onSubmit={handleSignup}
      className="flex h-screen -translate-y-16  w-full items-center justify-center px-4 mt-20 xl:mt-32"
    >
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign -Up</CardTitle>
          <CardDescription>
            Welcome to the our Store , Sign Up for better experiance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2 grid-cols-2">
              <div>
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="last Name"
                  required
                />
              </div>
            </div>
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
              Sign Up
            </Button>
            {/* <Button variant="outline" className="w-full">
              Login with Google
            </Button> */}
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

export default SignupScreen;

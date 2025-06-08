import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "@/firebase/firebaseconfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
  User,
} from "firebase/auth";
import { createUserDoc } from "@/firebase/createUserDoc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RegisterDialog = ({ open, onOpenChange }: RegisterDialogProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);
      const user: User = userCredential.user;

      if (user.email) {
        await createUserDoc({
          uid: user.uid,
          email: user.email,
        });
        onOpenChange(false);
        navigate("/home");
      } else {
        setError("Unable to create account. Please try again.");
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please use a different email or sign in.");
      } else if (error.code === 'auth/weak-password') {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError("Failed to create account. Please try again.");
      }
      console.error("Error registering:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user: User = result.user;

      if (user.email) {
        await createUserDoc({
          uid: user.uid,
          email: user.email,
        });
        onOpenChange(false);
        navigate("/home");
      } else {
        setError("Unable to get user information from Google.");
      }
    } catch (error: any) {
      setError("Failed to register with Google. Please try again.");
      console.error("Error registering with Google:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Join Lingez!
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Create your account and start learning today
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {error && (
            <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-email" className="text-slate-700 dark:text-slate-300">
                Email
              </Label>
              <Input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-password" className="text-slate-700 dark:text-slate-300">
                Password
              </Label>
              <Input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400"
                placeholder="Create a password (min. 6 characters)"
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-slate-700 dark:text-slate-300">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400"
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-500 dark:to-emerald-600 dark:hover:from-emerald-600 dark:hover:to-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
                Or continue with
              </span>
            </div>
          </div>
          
          <Button
            onClick={handleGoogleRegister}
            variant="outline"
            className="w-full border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <img
                src="https://img.icons8.com/color/16/000000/google-logo.png"
                alt="Google logo"
                className="mr-2 h-4 w-4"
              />
            )}
            Continue with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
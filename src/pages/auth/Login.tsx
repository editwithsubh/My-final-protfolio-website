import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useAuth();

  // If already logged in, redirect to intended target or home
  React.useEffect(() => {
    if (session) {
      const from = (location.state as any)?.from?.pathname || '/my-library';
      navigate(from, { replace: true });
    }
  }, [session, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success('Logged in successfully!');
      // Navigation is handled by the useEffect above, but resetting loading
      // avoids a stuck disabled button if session detection is slightly delayed.
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success('Account created! Check your email to confirm, then sign in.');
      setIsSignUp(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep-black py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300 bg-near-black border-dark-gray">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-off-white">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </CardTitle>
          <CardDescription className="text-mid-gray">
            {isSignUp
              ? 'Create a free account to purchase premium content.'
              : 'Enter your email and password to access your account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-off-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-deep-black border-dark-gray text-off-white placeholder:text-mid-gray focus-visible:ring-orange"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-off-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={isSignUp ? 'Min. 6 characters' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-deep-black border-dark-gray text-off-white placeholder:text-mid-gray focus-visible:ring-orange"
              />
            </div>
            <Button className="w-full font-bold" type="submit" disabled={loading}>
              {loading
                ? (isSignUp ? 'Creating account...' : 'Signing in...')
                : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
          </form>
          <p className="text-sm text-center text-mid-gray mt-4">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="text-orange hover:underline font-semibold"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Sign in' : 'Create account'}
            </button>
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-mid-gray text-center">
            <Link to="/" className="text-orange hover:underline">
              &larr; Back to Website
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

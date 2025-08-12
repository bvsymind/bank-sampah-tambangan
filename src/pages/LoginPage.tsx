// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Recycle, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Reset password states
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Login gagal');
    }
    
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    setResetSuccess(false);

    const result = await resetPassword(resetEmail);
    
    if (result.success) {
      setResetSuccess(true);
      setResetEmail('');
    } else {
      setResetError(result.error || 'Gagal mengirim email reset');
    }
    
    setResetLoading(false);
  };

  const handleResetDialogClose = () => {
    setResetDialogOpen(false);
    setResetEmail('');
    setResetError('');
    setResetSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-floating">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-soft">
              <Recycle className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Masuk Admin
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Bank Sampah Digital
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@banksampah.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="h-12 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-end">
              <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    type="button" 
                    variant="link" 
                    className="p-0 h-auto text-primary hover:text-primary-glow"
                    disabled={loading}
                  >
                    Lupa Password?
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                      Masukkan email Anda untuk menerima link reset password
                    </DialogDescription>
                  </DialogHeader>

                  {resetSuccess ? (
                    <div className="space-y-4">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Email reset password telah dikirim! Periksa inbox email Anda.
                        </AlertDescription>
                      </Alert>
                      <Button 
                        onClick={handleResetDialogClose}
                        className="w-full"
                      >
                        Tutup
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      {resetError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{resetError}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="resetEmail">Email</Label>
                        <Input
                          id="resetEmail"
                          type="email"
                          placeholder="admin@banksampah.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          disabled={resetLoading}
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleResetDialogClose}
                          disabled={resetLoading}
                          className="flex-1"
                        >
                          Batal
                        </Button>
                        <Button
                          type="submit"
                          disabled={resetLoading}
                          className="flex-1"
                        >
                          {resetLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Mengirim...
                            </>
                          ) : (
                            'Kirim Link Reset'
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                'Masuk'
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Belum punya akun?{' '}
              <Link 
                to="/register" 
                className="text-primary hover:text-primary-glow font-medium transition-colors"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
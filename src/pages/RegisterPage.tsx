import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Recycle, Eye, EyeOff, Loader2, AlertCircle, Check } from 'lucide-react';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();
  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 6) score += 20;
    if (password.length >= 8) score += 10;
    if (/[a-z]/.test(password)) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    if (score < 30) return { score, label: 'Lemah', color: 'bg-destructive' };
    if (score < 60) return { score, label: 'Sedang', color: 'bg-yellow-500' };
    if (score < 80) return { score, label: 'Kuat', color: 'bg-primary' };
    return { score, label: 'Sangat Kuat', color: 'bg-success' };
  };

  const passwordStrength = getPasswordStrength(password);
  const requirements = [
    { test: password.length >= 6, label: 'Minimal 6 karakter' },
    { test: /[a-z]/.test(password), label: 'Huruf kecil (a-z)' },
    { test: /[A-Z]/.test(password), label: 'Huruf besar (A-Z)' },
    { test: /[0-9]/.test(password), label: 'Angka (0-9)' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await register(email, password, confirmPassword);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Registrasi gagal');
    }
    
    setLoading(false);
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
              Daftar Admin
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Bank Sampah Sido Makmur
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

              {password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Kekuatan Password:</span>
                    <span className={`font-medium ${
                      passwordStrength.score < 30 ? 'text-destructive' :
                      passwordStrength.score < 60 ? 'text-yellow-600' :
                      passwordStrength.score < 80 ? 'text-primary' : 'text-success'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <Progress 
                    value={passwordStrength.score} 
                    className={`h-2 ${passwordStrength.color}`}
                  />
                  
                  <div className="space-y-1">
                    {requirements.map((req, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-2 text-xs ${
                          req.test ? 'text-success' : 'text-muted-foreground'
                        }`}
                      >
                        <Check className={`h-3 w-3 ${req.test ? 'visible' : 'invisible'}`} />
                        <span>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Konfirmasi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  className={`h-12 pr-12 ${
                    confirmPassword && password !== confirmPassword 
                      ? 'border-destructive focus:border-destructive' 
                      : confirmPassword && password === confirmPassword 
                        ? 'border-success focus:border-success' 
                        : ''
                  }`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive">
                  Password tidak cocok
                </p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="text-xs text-success flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Password cocok
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={loading || password !== confirmPassword || passwordStrength.score < 30}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mendaftar...
                </>
              ) : (
                'Daftar'
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{' '}
              <Link 
                to="/login" 
                className="text-primary hover:text-primary-glow font-medium transition-colors"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Crown, Shield } from 'lucide-react';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username: credentials.username,
        password: credentials.password,
        redirect: false
      });

      if (result?.error) {
        setError('Identifiants invalides. Accès refusé au Quartier Général.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError('Erreur de connexion. Réessayez.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-imperial-night">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-6xl text-imperial-gold">⚔️</div>
          <div className="absolute top-20 right-20 text-4xl text-imperial-gold">🦅</div>
          <div className="absolute bottom-20 left-20 text-5xl text-imperial-gold">🎖️</div>
          <div className="absolute bottom-10 right-10 text-3xl text-imperial-gold">👑</div>
        </div>
      </div>

      <Card className="w-full max-w-md z-10 bg-imperial-navy border-imperial-gold/30 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-imperial-gradient rounded-full flex items-center justify-center">
            <Crown className="h-8 w-8 text-imperial-night" />
          </div>
          <h1 className="text-2xl font-imperial font-bold text-imperial-gold mb-2">
            Quartier Général
          </h1>
          <p className="text-sm text-muted-foreground font-cinzel">
            Interface de Commandement
          </p>
          <div className="flex items-center justify-center mt-3">
            <Shield className="h-4 w-4 text-imperial-gold mr-2" />
            <span className="text-xs text-imperial-gold font-cinzel">
              Accès Réservé à l&apos;État-Major
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                Nom d&apos;utilisateur
              </label>
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 bg-imperial-night border border-border/50 rounded-md 
                         text-foreground placeholder-muted-foreground focus:outline-none 
                         focus:ring-2 focus:ring-imperial-gold focus:border-transparent"
                placeholder="Entrez votre nom d'utilisateur"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 bg-imperial-night border border-border/50 rounded-md 
                         text-foreground placeholder-muted-foreground focus:outline-none 
                         focus:ring-2 focus:ring-imperial-gold focus:border-transparent"
                placeholder="Entrez votre mot de passe"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-imperial-red/20 border border-imperial-red/30">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-imperial-gold text-imperial-night hover:bg-imperial-gold/90 
                       font-medium py-2.5 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Connexion en cours...' : 'Accéder au Quartier Général'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground font-cinzel">
              Vive l&apos;Empereur ! 🦅
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
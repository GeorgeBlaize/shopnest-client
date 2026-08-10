'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FacebookIcon } from '@/components/ui/SocialIcons';
import { useAuth } from '@/context/AuthContext';
import { signInWithGoogle, isFirebaseConfigured } from '@/lib/firebase';

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.66Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.75-2.1-6.69-4.92H1.3v3.09A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.31 14.33A7.2 7.2 0 0 1 4.93 12c0-.81.14-1.6.38-2.33V6.58H1.3A12 12 0 0 0 0 12c0 1.94.47 3.77 1.3 5.42l4.01-3.09Z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.3 6.58l4.01 3.09C6.25 6.85 8.89 4.75 12 4.75Z" />
    </svg>
  );
}

export function SocialLoginButtons() {
  const { loginWithFirebase } = useAuth();
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleGoogle() {
    if (!isFirebaseConfigured()) {
      toast.error('Google sign-in is not configured for this deployment yet.');
      return;
    }
    setIsGoogleLoading(true);
    try {
      const idToken = await signInWithGoogle();
      await loginWithFirebase(idToken);
      toast.success('Signed in with Google');
      router.push('/dashboard');
      router.refresh();
    } catch {
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button type="button" variant="outline" onClick={handleGoogle} disabled={isGoogleLoading}>
        {isGoogleLoading ? <Loader2 className="size-4 animate-spin" /> : <GoogleGlyph />}
        Google
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled
        title="Facebook sign-in is coming soon"
        onClick={() => toast.info('Facebook sign-in is coming soon')}
      >
        <FacebookIcon className="size-4 text-[#1877F2]" />
        Facebook
      </Button>
    </div>
  );
}

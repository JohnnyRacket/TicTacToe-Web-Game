import { Check, Link } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../../../components/ui/button';

interface ShareGameButtonProps {
  gameId: string;
}

export function ShareGameButton({ gameId }: ShareGameButtonProps) {
  const [copied, setCopied] = useState(false);

  const gameUrl = `${window.location.origin}/game/${gameId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(gameUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = gameUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {copied ? (
        <>
          <Check size={16} />
          Copied!
        </>
      ) : (
        <>
          <Link size={16} />
          Share Game
        </>
      )}
    </Button>
  );
}

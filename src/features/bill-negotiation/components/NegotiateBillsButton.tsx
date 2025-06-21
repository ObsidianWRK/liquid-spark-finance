import React from 'react';
import { Button } from '@/shared/ui/button';
import { useNegotiationStore } from '../store';
import { useToast } from '@/shared/hooks/use-toast';
import { Handshake } from 'lucide-react';

export const NegotiateBillsButton: React.FC = () => {
  const negotiate = useNegotiationStore((s) => s.negotiateOutstanding);
  const loading = useNegotiationStore((s) => s.loading);
  const { toast } = useToast();

  const onClick = async () => {
    await negotiate();
    toast({
      title: 'Negotiation started',
      description: "We'll work on lowering your bills.",
    });
  };

  return (
    <button 
      onClick={onClick} 
      disabled={loading}
      className="w-full p-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-green-400 text-xs font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
    >
      <Handshake className="w-3 h-3" />
      {loading ? 'Negotiating...' : 'Negotiate Bills'}
    </button>
  );
};

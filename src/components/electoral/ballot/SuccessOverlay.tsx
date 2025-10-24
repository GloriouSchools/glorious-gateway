import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SuccessOverlayProps {
  isActive: boolean;
}

export function SuccessOverlay({ isActive }: SuccessOverlayProps) {
  const navigate = useNavigate();
  
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center animate-in fade-in duration-300">
      <div 
        className="bg-white p-12 rounded-lg text-center max-w-[500px] mx-4 animate-in zoom-in duration-500"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        <div className="text-[5em] mb-5 animate-bounce">
          🎉
        </div>
        <h2 className="text-[2em] font-bold text-[#1a1a1a] mb-4">
          Vote Submitted!
        </h2>
        <p className="text-[#4a4a4a] leading-[1.6] text-[1.1em] mb-6">
          Thank you for participating in the Student Council Elections. Your vote has been recorded and will be counted!
        </p>
        <Button
          onClick={() => navigate('/student/electoral/results')}
          className="px-8 py-6 text-lg font-bold uppercase tracking-wider bg-[#667eea] hover:bg-[#5568d3] text-white"
        >
          View Live Results
        </Button>
      </div>
    </div>
  );
}

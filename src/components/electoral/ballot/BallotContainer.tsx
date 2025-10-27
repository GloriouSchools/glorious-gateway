import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BallotHeader } from "./BallotHeader";
import { BallotFooter } from "./BallotFooter";
import { PositionBallot } from "./PositionBallot";
import { ReviewSection } from "./ReviewSection";
import { SuccessOverlay } from "./SuccessOverlay";

interface Candidate {
  id: string;
  name: string;
  email: string;
  photo?: string | null;
  class: string;
  stream: string;
}

interface Position {
  id: string;
  title: string;
  description: string;
  candidates: Candidate[];
}

interface BallotContainerProps {
  positions: Position[];
  onVotePosition: (positionId: string, candidateId: string) => Promise<void>;
  onVoteComplete: (votes: Record<string, string>) => void;
}

export function BallotContainer({ 
  positions, 
  onVotePosition, 
  onVoteComplete 
}: BallotContainerProps) {
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [locked, setLocked] = useState<Record<string, boolean>>({});
  const [isExiting, setIsExiting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalPositions = positions.length;
  const currentPosition = positions[currentPositionIndex];

  // Restore session if available
  useEffect(() => {
    const savedData = sessionStorage.getItem('ballotData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setSelections(data.selections || {});
        setLocked(data.locked || {});
        
        const unvotedIndex = positions.findIndex(pos => !data.selections[pos.id]);
        if (unvotedIndex !== -1) {
          setCurrentPositionIndex(unvotedIndex);
        } else if (Object.keys(data.selections).length === positions.length) {
          setShowReview(true);
        }
      } catch (e) {
        console.error('Failed to restore session:', e);
      }
    }
  }, [positions]);

  // Save to session storage
  useEffect(() => {
    sessionStorage.setItem('ballotData', JSON.stringify({ selections, locked }));
  }, [selections, locked]);

  const handleSelectCandidate = (candidateId: string) => {
    if (locked[currentPosition.id]) return;

    // Immediately mark as selected and lock
    const newSelections = { ...selections, [currentPosition.id]: candidateId };
    const newLocked = { ...locked, [currentPosition.id]: true };
    
    setSelections(newSelections);
    setLocked(newLocked);

    // Vote in background (no await to block UI)
    onVotePosition(currentPosition.id, candidateId).catch(error => {
      console.error('Error voting:', error);
      // Unlock position if vote fails
      setLocked({ ...locked, [currentPosition.id]: false });
      setSelections({ ...selections });
      alert(`Failed to record vote: ${error.message || 'Unknown error'}. Please try again.`);
    });

    // Auto-advance after animation completes
    setTimeout(() => {
      if (currentPositionIndex < totalPositions - 1) {
        advanceToNext();
      } else {
        // Last position - auto-submit after showing review briefly
        setTimeout(() => {
          handleFinalSubmit();
        }, 800);
      }
    }, 1500);
  };

  const advanceToNext = () => {
    setIsExiting(true);
    
    setTimeout(() => {
      setCurrentPositionIndex(prev => prev + 1);
      setIsExiting(false);
    }, 400);
  };

  const handleFinalSubmit = () => {
    createConfetti();
    setShowSuccess(true);
    
    setTimeout(() => {
      sessionStorage.setItem('voteSubmitted', 'true');
      onVoteComplete(selections);
    }, 2000);
  };

  const createConfetti = () => {
    const colors = ['#667eea', '#764ba2', '#c9a961', '#2c3e50'];
    const confettiCount = 150;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = Math.random() * 15 + 5 + 'px';
        confetti.style.height = Math.random() * 15 + 5 + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-20px';
        confetti.style.opacity = '1';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        document.body.appendChild(confetti);
        
        const duration = Math.random() * 3 + 2;
        const drift = (Math.random() - 0.5) * 300;
        
        confetti.animate([
          { transform: 'translate(0, 0)', opacity: 1 },
          { transform: `translate(${drift}px, ${window.innerHeight + 50}px)`, opacity: 0 }
        ], {
          duration: duration * 1000,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => confetti.remove(), duration * 1000);
      }, i * 20);
    }
  };

  if (showSuccess) {
    return <SuccessOverlay isActive={true} />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center p-5">
        <motion.div 
          className="max-w-[800px] w-full bg-[#fdfcf8] border-[3px] border-[#2c3e50] shadow-[0_20px_60px_rgba(0,0,0,0.3),inset_0_0_50px_rgba(0,0,0,0.02)]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <BallotHeader />
          
          <div className="px-6 py-10 md:px-10 md:py-12 min-h-[500px] bg-[repeating-linear-gradient(0deg,transparent,transparent_30px,rgba(0,0,0,0.02)_30px,rgba(0,0,0,0.02)_31px)]">
            <AnimatePresence mode="wait">
              {!showReview && currentPosition && (
                <motion.div
                  key={currentPositionIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: isExiting ? 0.4 : 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  <PositionBallot
                    position={currentPosition}
                    positionNumber={currentPositionIndex + 1}
                    totalPositions={totalPositions}
                    selectedCandidateId={selections[currentPosition.id]}
                    isLocked={locked[currentPosition.id]}
                    isActive={!isExiting}
                    isExiting={isExiting}
                    onSelectCandidate={handleSelectCandidate}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <ReviewSection
              positions={positions}
              selections={selections}
              isActive={showReview}
            />
          </div>

          <BallotFooter
            totalPositions={totalPositions}
            currentPosition={currentPositionIndex}
            showSubmit={false}
            onSubmit={handleFinalSubmit}
          />
        </motion.div>
      </div>
    </>
  );
}

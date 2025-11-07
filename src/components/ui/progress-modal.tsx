import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle } from "lucide-react";

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: number;
  title: string;
  description?: string;
  isComplete: boolean;
  icon?: React.ReactNode;
}

export function ProgressModal({
  isOpen,
  onClose,
  progress,
  title,
  description,
  isComplete,
  icon
}: ProgressModalProps) {
  // Auto close after completion
  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={isComplete ? onClose : undefined}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {isComplete ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                {icon || <Loader2 className="w-8 h-8 text-primary animate-spin" />}
              </div>
            )}
          </div>
          
          <DialogTitle className="text-xl">
            {isComplete ? "Complete!" : title}
          </DialogTitle>
          
          <DialogDescription className="text-center space-y-4">
            {isComplete ? (
              <p className="text-green-600 font-medium">
                Successfully completed
              </p>
            ) : (
              <>
                {description && (
                  <p className="text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full h-3" />
                </div>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

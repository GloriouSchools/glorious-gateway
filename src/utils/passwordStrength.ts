export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  percentage: number;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  
  if (!password) {
    return { score: 0, label: "Enter password", color: "border-muted", percentage: 0 };
  }
  
  // Length checks
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character type checks
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  // Calculate final score (0-4)
  const finalScore = Math.min(Math.floor(score / 1.5), 4);
  
  const strengthLevels: Record<number, PasswordStrength> = {
    0: { score: 0, label: "Very Weak", color: "bg-destructive", percentage: 20 },
    1: { score: 1, label: "Weak", color: "bg-destructive", percentage: 40 },
    2: { score: 2, label: "Medium", color: "bg-orange-500", percentage: 60 },
    3: { score: 3, label: "Strong", color: "bg-green-500", percentage: 80 },
    4: { score: 4, label: "Very Strong", color: "bg-green-600", percentage: 100 },
  };
  
  return strengthLevels[finalScore];
}
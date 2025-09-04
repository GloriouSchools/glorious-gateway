/**
 * Generates a school email address from a student's name
 * Handles duplicate names by adding random numbers
 */
export function generateSchoolEmail(fullName: string, existingEmails: string[] = []): string {
  // Clean and format the name
  const nameParts = fullName.toLowerCase().trim().split(/\s+/);
  
  if (nameParts.length === 0) {
    throw new Error("Invalid name provided");
  }
  
  let baseEmail: string;
  
  if (nameParts.length === 1) {
    // Single name
    baseEmail = nameParts[0];
  } else if (nameParts.length === 2) {
    // First and last name
    baseEmail = nameParts.join('');
  } else {
    // Multiple names - use first and last
    baseEmail = nameParts[0] + nameParts[nameParts.length - 1];
  }
  
  // Remove any special characters
  baseEmail = baseEmail.replace(/[^a-z0-9]/g, '');
  
  // Check if email already exists
  let email = `${baseEmail}@glorious.com`;
  let counter = 1;
  
  while (existingEmails.includes(email)) {
    // Add random 3-digit number if duplicate
    const randomNum = Math.floor(Math.random() * 900) + 100;
    email = `${baseEmail}${randomNum}@glorious.com`;
    counter++;
    
    // Fallback to incremental numbers if still duplicate after 10 attempts
    if (counter > 10) {
      email = `${baseEmail}${Date.now()}@glorious.com`;
      break;
    }
  }
  
  return email;
}

/**
 * Generates a secure random password
 */
export function generateSecurePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Email template for sending credentials
 */
export function generateCredentialEmail(
  studentName: string,
  personalEmail: string,
  schoolEmail: string,
  password: string
): string {
  return `
Dear ${studentName},

Welcome to Glorious Schools! Your account has been successfully created.

Here are your login credentials for the School Management System:

School Email: ${schoolEmail}
Password: ${password}

Please keep these credentials secure and do not share them with anyone.

To access the portal:
1. Visit the school portal at https://glorious.school/login
2. Enter your school email and password
3. Complete your profile setup upon first login

For security reasons, we recommend changing your password after your first login.

If you have any questions or need assistance, please contact our IT support team at support@glorious.com

Best regards,
Glorious Schools Administration
  `.trim();
}
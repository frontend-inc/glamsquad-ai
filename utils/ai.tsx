// Utils
import { signUpAction, verifyOtpAction, signInAction, forgotPasswordAction, resetPasswordAction, signOutAction } from '@/actions/auth';

export async function checkAIAvailability() {
  const envVarExists = !!process.env.OPENAI_API_KEY;
  return envVarExists;
}

// Re-export auth actions
export { signUpAction, verifyOtpAction, signInAction, forgotPasswordAction, resetPasswordAction, signOutAction };
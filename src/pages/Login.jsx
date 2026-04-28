// src/pages/Login.jsx
import { supabase } from '../lib/supabase';

export default function Login() {
  
  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // This tells Supabase to send the user right back to your local app after they log in
        redirectTo: 'http://localhost:5173' 
      }
    });

    if (error) console.error("Error logging in:", error.message);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-zinc-950">
      <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
        <h2 className="text-xl text-white font-extrabold mb-4">Backend Smoke Test</h2>
        <button 
          onClick={handleGoogleLogin}
          className="bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
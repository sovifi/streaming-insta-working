import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface RegisterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterPopup({ isOpen, onClose }: RegisterPopupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('1. Starting registration process...');
    
    try {
      // Sign up the user with Supabase Auth
      console.log('2. Attempting Supabase auth signup...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log('3. Auth response:', authData);

      if (authError) {
        console.error('Auth Error:', authError);
        throw authError;
      }

      if (!authData.user) {
        console.error('4. No user data received');
        throw new Error('No user data received');
      }

      console.log('5. Starting profile creation for user:', authData.user.id);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select();

      console.log('6. Profile creation attempt completed');
      console.log('Profile Data:', profileData);
      console.log('Profile Error:', profileError);

      if (profileError) {
        console.error('7. Profile Error:', profileError);
        throw profileError;
      }

      console.log('8. Success! Profile created:', profileData);
      alert('Registration successful! Please check your email to verify your account.');
      onClose();
      
    } catch (error) {
      console.error('9. Final error catch:', error);
      alert('Registration failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Get Started</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
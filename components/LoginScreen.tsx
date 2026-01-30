
import React, { useState } from 'react';
import { IconEmail, IconLock, IconGoogle, IconPhone, IconUser } from './Icons.tsx';
import AnimatedBackground from './AnimatedBackground.tsx';
import Modal from './Modal.tsx';
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from '../constants/legalText.tsx';

type View = 'login' | 'signup' | 'forgot_password';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    // Mock login success
    onLogin();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Mock signup success and switch to login
    setMessage('Account created successfully! Please log in.');
    setView('login');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    // Mock success message
    setMessage('If an account exists for this email, a reset link has been sent.');
    setView('login');
  };

  const openModal = (type: 'terms' | 'privacy') => {
    if (type === 'terms') {
      setModalContent({ title: 'Terms of Service', content: TERMS_OF_SERVICE });
    } else {
      setModalContent({ title: 'Privacy Policy', content: PRIVACY_POLICY });
    }
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const renderLoginView = () => (
    <>
      <div className="text-center mb-8">
        <img 
          src="https://firebasestorage.googleapis.com/v0/b/smartrefill-singapore/o/River%20Mobile%2FLogo%2FRiverAI_Icon_White_HQ.png?alt=media&token=a850265f-12c0-4b9b-9447-dbfd37e722ff" 
          alt="River Logo" 
          className="h-16 mx-auto"
        />
        <p className="text-md text-gray-400 mt-4">
          Turning Daily Essentials Into <br /> Automatic Experiences
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-[30px] p-6 border border-white/20">
        <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
          {message && <p className="text-green-400 text-sm text-center">{message}</p>}
          <div className="relative">
            <IconEmail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-black/20 border border-transparent rounded-[20px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" aria-label="Email" />
          </div>
          <div className="relative">
            <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-black/20 border border-transparent rounded-[20px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" aria-label="Password" />
          </div>
          {error && <p className="text-red-400 text-sm text-center pt-1">{error}</p>}
          <button type="submit" className="w-full bg-[var(--primary-color)] hover:opacity-90 text-white font-bold py-3 px-4 rounded-[20px] transition-opacity !mt-6">Login with Email</button>
        </form>
        <div className="text-center mt-4">
          <button type="button" onClick={() => setView('forgot_password')} className="text-xs text-gray-400 hover:text-white">Forgot Password?</button>
        </div>
      </div>

      <div className="my-5 flex items-center">
        <div className="flex-grow border-t border-white/20"></div>
        <span className="mx-4 text-xs text-gray-400">Or</span>
        <div className="flex-grow border-t border-white/20"></div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full h-12 w-12 hover:bg-white/20 transition-colors"><IconGoogle className="w-6 h-6" /></button>
        <button className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full h-12 w-12 hover:bg-white/20 transition-colors"><IconPhone className="w-6 h-6" /></button>
      </div>
      
      <div className="text-center mt-6 text-sm text-gray-400">
        <p>Don't have an account? <button onClick={() => setView('signup')} className="font-semibold text-white hover:underline">Create one</button></p>
      </div>
    </>
  );

  const renderSignupView = () => (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Create Account</h2>
        <p className="text-md text-gray-400 mt-2">Join River today.</p>
      </div>
      <div className="bg-white/10 backdrop-blur-lg rounded-[30px] p-6 border border-white/20">
        <form onSubmit={handleSignupSubmit} className="w-full space-y-4">
          <div className="relative">
            <IconUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-black/20 border border-transparent rounded-[20px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" aria-label="Full Name" />
          </div>
          <div className="relative">
            <IconEmail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-black/20 border border-transparent rounded-[20px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" aria-label="Email" />
          </div>
          <div className="relative">
            <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-black/20 border border-transparent rounded-[20px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" aria-label="Password" />
          </div>
          <div className="relative">
            <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-black/20 border border-transparent rounded-[20px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" aria-label="Confirm Password" />
          </div>
          {error && <p className="text-red-400 text-sm text-center pt-1">{error}</p>}
          <button type="submit" className="w-full bg-[var(--primary-color)] hover:opacity-90 text-white font-bold py-3 px-4 rounded-[20px] transition-opacity mt-4">Create Account</button>
        </form>
      </div>
      <div className="text-center mt-6 text-sm text-gray-400">
        <p>Already have an account? <button onClick={() => setView('login')} className="font-semibold text-white hover:underline">Sign In</button></p>
      </div>
    </>
  );

  const renderForgotPasswordView = () => (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Reset Password</h2>
        <p className="text-md text-gray-400 mt-2">Enter your email to receive a reset link.</p>
      </div>
      <div className="bg-white/10 backdrop-blur-lg rounded-[30px] p-6 border border-white/20">
        <form onSubmit={handleForgotSubmit} className="w-full space-y-4">
          <div className="relative">
            <IconEmail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-black/20 border border-transparent rounded-[20px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" aria-label="Email" />
          </div>
          {error && <p className="text-red-400 text-sm text-center pt-1">{error}</p>}
          <button type="submit" className="w-full bg-[var(--primary-color)] hover:opacity-90 text-white font-bold py-3 px-4 rounded-[20px] transition-opacity mt-4">Send Reset Link</button>
        </form>
      </div>
      <div className="text-center mt-6 text-sm text-gray-400">
        <p>Remembered your password? <button onClick={() => setView('login')} className="font-semibold text-white hover:underline">Back to Login</button></p>
      </div>
    </>
  );

  const renderContent = () => {
    switch (view) {
      case 'signup':
        return renderSignupView();
      case 'forgot_password':
        return renderForgotPasswordView();
      case 'login':
      default:
        return renderLoginView();
    }
  };

  return (
    <div className="w-full h-full bg-[var(--accent-color)] flex flex-col justify-center items-center p-8 text-white relative overflow-hidden">
      <AnimatedBackground />
      <div className="w-full max-w-sm z-10 animate-fade-in">
        {renderContent()}
      </div>
      <div className="absolute bottom-4 text-center w-full z-10">
        <div className="text-xs text-gray-500">
          <p>By continuing, you agree to River's</p>
          <button onClick={() => openModal('terms')} className="underline hover:text-white">Terms of Service</button>
          <span className="mx-1">&</span>
          <button onClick={() => openModal('privacy')} className="underline hover:text-white">Privacy Policy</button>.
        </div>
        <p className="text-xs text-gray-600 mt-2">Version 1.0.0</p>
      </div>
      <Modal isOpen={!!modalContent} onClose={closeModal} title={modalContent?.title || ''}>
        {modalContent?.content}
      </Modal>
    </div>
  );
};

export default LoginScreen;

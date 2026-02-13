import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Toaster from '../components/Toaster';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { signIn, signUp } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setToast(null);
        setIsLoading(true);
        try {
            const { error } = isLogin
                ? await signIn({ email, password })
                : await signUp({ email, password });

            if (error) throw error;
            setToast({
                message: isLogin ? 'Success' : 'Account Created',
                subMessage: isLogin ? 'Redirecting to explorer...' : 'Check your email to verify.',
                type: 'success'
            });
        } catch (err) {
            setToast({
                message: 'Error',
                subMessage: err.message,
                type: 'error'
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
            {toast && (
                <Toaster
                    {...toast}
                    onClose={() => setToast(null)}
                />
            )}
            {/* Cinematic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-blue-900/20 blur-[120px]" />

            <div className="z-10 w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
                        <span className="text-2xl font-bold text-white">O</span>
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">
                        {isLogin ? 'Welcome Back' : 'Join Otelier'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Access the hospitality developer portal
                    </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    {toast && (
                        <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm font-medium text-red-400 border border-red-500/20">
                            {toast.subMessage}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="group relative">
                            <input
                                type="email"
                                placeholder="Email address"
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 group-hover:border-white/20"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="group relative">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 group-hover:border-white/20"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-600/40 active:scale-[0.98]"
                    >
                        {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setToast(null);
                        }}
                        className="text-sm font-medium text-slate-400 transition-colors hover:text-indigo-400"
                    >
                        {isLogin ? (
                            <>Don't have an account? <span className="text-indigo-500">Sign up</span></>
                        ) : (
                            <>Already have an account? <span className="text-indigo-500">Sign in</span></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
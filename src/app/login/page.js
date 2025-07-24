'use client'
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTranslation } from '../hooks/useTranslation';

export default function Loginpage(){
    const router = useRouter();
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) =>{
        e.preventDefault();
         const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        });

        if (res.ok) {
        router.push('/dashboard');
        } else {
        alert(t('login.invalidCredentials'));
        }
    };
    

return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-xl font-bold mb-4">{t('login.title')}</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder={t('login.emailPlaceholder')}
              className="border border-gray-300 p-3 w-full rounded text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder={t('login.passwordPlaceholder')}
              className="border border-gray-300 p-3 w-full rounded text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition-colors"
            >
              {t('login.loginButton')}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

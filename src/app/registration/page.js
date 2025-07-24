'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from '../hooks/useTranslation';

export default function Register(){
    const router = useRouter();
    const { t } = useTranslation();
    const [form, setForm] = useState({name: "", email: "", password: "", role: "user"});
    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) =>{
    e.preventDefault();
    console.log(JSON.stringify(form));
    const res = await fetch("/api/register",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
    });
    if(res.ok) router.push("/login");
    else alert(t('register.failedToRegister'));
    }
    
    return (
        <>
            <Header />
            <main className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">{t('register.title')}</h2>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder={t('register.namePlaceholder')} 
                            onChange={handleChange} 
                            className="border p-2 w-full rounded text-gray-800" 
                        />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder={t('register.emailPlaceholder')} 
                            onChange={handleChange} 
                            className="border p-2 w-full rounded text-gray-800" 
                        />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder={t('register.passwordPlaceholder')} 
                            onChange={handleChange} 
                            className="border p-2 w-full rounded text-gray-800" 
                        />
                        <select name="role" className="border p-2 w-full rounded text-gray-800" onChange={handleChange}>
                            <option value="user">{t('register.normalUser')}</option>
                            <option value="business">{t('register.serviceProvider')}</option>
                        </select>
                        <button type="submit" className="bg-blue-500 text-white p-2 w-full cursor-pointer rounded hover:bg-blue-600 transition-colors">
                            {t('register.registerButton')}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    )
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import InputGroup from "../../components/FormElements/InputGroup";
import { LoginSkeleton } from "../../components/AuthSkeletons";
import { Checkbox } from "../../components/FormElements/checkbox";
import { EmailIcon, PasswordIcon, LockIcon } from "../../components/icons";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'fr';
  const t = useTranslations('login');

  const [data, setData] = useState({ email: '', password: '', remember: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [minLoading, setMinLoading] = useState(true);

  // Le skeleton reste affiché au minimum 5 s
  useEffect(() => {
    const timer = setTimeout(() => setMinLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const responseData = await res.json();
      if (!res.ok) {
        setError(responseData.error || t('errorGeneric'));
      } else {
        // Les admins sont redirigés vers le back-office
        router.push(
          responseData.user.isAdmin ? `/${locale}/admin` : `/${locale}/dashboard`
        );
      }
    } catch (err) {
      setError(t('errorNetwork'));
    } finally {
      setLoading(false);
    }
  }

  if (minLoading) return <LoginSkeleton />;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f1f5f9] py-8">
      <div className="w-full max-w-[1170px] mx-auto px-4">
        <div className="rounded-xl bg-white shadow-lg overflow-hidden">
          <div className="flex flex-wrap items-stretch">

            <div className="w-full xl:w-1/2">
              <div className="w-full p-8 sm:p-12 xl:p-16">
                <div className="mb-9">
                  <div className="mb-6 flex items-center gap-3">
                    <img src="/logo.svg" alt="SCAP BEN" className="h-12 w-12" />
                    <span className="text-xl font-bold tracking-tight text-[#1c2434]">
                      SCAP BEN
                    </span>
                  </div>
                  <h2 className="mb-3 text-3xl font-bold text-[#1c2434]">
                    {t('title')}
                  </h2>
                  <p className="text-base text-[#64748b]">
                    {t('description')}
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <InputGroup
                    type="email"
                    label={t('email')}
                    className="mb-5"
                    placeholder={t('email')}
                    name="email"
                    handleChange={handleChange}
                    value={data.email}
                    Icon={<EmailIcon />}
                  />
                  <InputGroup
                    type="password"
                    label={t('password')}
                    className="mb-6"
                    placeholder={t('password')}
                    name="password"
                    handleChange={handleChange}
                    value={data.password}
                    Icon={<PasswordIcon />}
                  />

                  <div className="mb-6 flex items-center justify-between gap-2 font-medium">
                    <Checkbox
                      label={t('remember')}
                      name="remember"
                      onChange={(e) => setData({ ...data, remember: e.target.checked })}
                    />
                    <Link href={`/${locale}/forgot-password`} className="text-sm text-[#64748b] hover:text-[#3c50e0]">
                      {t('forgot')}
                    </Link>
                  </div>

                  {error && (
                    <p className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                      {error}
                    </p>
                  )}

                  <div className="mb-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#3c50e0] p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-60"
                    >
                      {loading ? t('submitting') : t('submit')}
                      {loading && (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-base text-[#64748b]">
                      {t('noAccount')}{' '}
                      <Link href={`/${locale}/register`} className="text-[#3c50e0] hover:underline">
                        {t('register')}
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <div className="relative hidden w-full xl:block xl:w-1/2">
              <img
                src="/auth-login.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c2434]/95 via-[#1c2434]/45 to-[#1c2434]/10" />
              <div className="relative z-10 flex h-full flex-col justify-end px-12 pb-14">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-white/70">
                  {t('subtitle')}
                </p>
                <h1 className="mb-4 text-4xl font-bold text-white">
                  {t('welcome')}
                </h1>
                <p className="max-w-md text-lg text-white/85">
                  {t('welcomeDescription')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

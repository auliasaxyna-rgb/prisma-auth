"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [info, setInfo] = useState<{ msg: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfo(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setInfo({ msg: data.error || "Pendaftaran gagal", isError: true });
    } else {
      setInfo({ msg: "Akun berhasil dibuat! Mengalihkan ke login...", isError: false });
      setTimeout(() => router.push("/login"), 1500);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">Daftar Akun Baru</h2>
        
        {info && (
          <div className={`mb-4 rounded p-3 text-sm ${info.isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {info.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded border px-3 py-2 text-gray-900 focus:outline-blue-500"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded border px-3 py-2 text-gray-900 focus:outline-blue-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded border px-3 py-2 text-gray-900 focus:outline-blue-500"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 transition"
          >
            Daftar Sekarang
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
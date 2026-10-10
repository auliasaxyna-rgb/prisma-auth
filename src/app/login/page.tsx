"use client";

import { useState } from "react";
import Link from "next/link";

// Definisiakan tipe data agar ESLint tidak komplain
interface UserData {
  id: string;
  name: string;
  email: string;
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [info, setInfo] = useState<{ msg: string; isError: boolean } | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfo(null);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setInfo({ msg: data.error || "Gagal masuk", isError: true });
    } else {
      setInfo({ msg: `Selamat datang kembali, ${data.user.name}!`, isError: false });
      setLoggedInUser(data.user);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">Masuk ke Akun</h2>

        {info && (
          <div className={`mb-4 rounded p-3 text-sm ${info.isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {info.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            Masuk
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </p>

        {loggedInUser && (
          <div className="mt-4 rounded bg-gray-50 p-3 border text-xs text-gray-700">
            <p className="font-semibold text-gray-900 mb-1">Status: Berhasil Login</p>
            <p>ID: {loggedInUser.id}</p>
            <p>Nama: {loggedInUser.name}</p>
            <p>Email: {loggedInUser.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
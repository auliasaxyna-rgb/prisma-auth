import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export async function POST(req:Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                {error: "Email dan kata sandi wajib diisi"},
                {status: 400}
            );
        }

        // Cari pengguna berdasarkan email
        const user = await prisma.user.findUnique({
            where: {email},
        });

        if(!user) {
            return NextResponse.json(
                {error: "Akun tidak ditemukan"},
                {status: 401}
            );
        }

        // Verifikasi kesesuaian password
        const passwordMatch = await compare(password, user.password);
        
        if(!passwordMatch) {
            return NextResponse.json(
                {error: "Kata sandi salah"},
                {status: 401}
            );
        }

        return NextResponse.json({
            message: "Login berhasil!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        return NextResponse.json(
            {error: "Gagal memproses login"},
            {status: 500}
        );
    }
}
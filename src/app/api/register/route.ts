import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req:Request) {
    try {
        const {name, email, password} = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                {error: "Semua data wajib diisi"},
                {status: 400}
            );
        }

        //Cek apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({
            where: {email},
        });

        if (existingUser) {
            return NextResponse.json(
                {error: "Email sudah terdaftar"},
                {status: 400}
            );
        }

        // Hash kata sandi
        const hashedPassword = await hash(password, 10);

        // Simpan data ke MySQL via Prisma
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            {message: "Registrasi berhasil!", userId: user.id},
            {status: 201}
        );
    } catch (err) {
        return NextResponse.json(
            {error: "Gagal memproses pendaftaran"},
            {status: 500}
        );
    }
}
// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body: SignupRequest = await request.json();
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email', field: 'email' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters', field: 'password' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already exists', field: 'email' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = await User.create({
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: createdUser._id, email: createdUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' } // short-lived token
    );

    const refreshToken = jwt.sign(
      { userId: createdUser._id, email: createdUser.email },
      process.env.REFRESH_SECRET as string,
      { expiresIn: '7d' } // long-lived token
    );

    // Set HttpOnly cookie with refresh token
    (await cookies()).set({
      name: 'refresh_token',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Return access token in response
    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {...createdUser.toObject(), password: null},
        accessToken,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

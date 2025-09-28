// lib/auth-middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { connectDB } from './mongodb';
import { User } from './models/User';

export function withAuth(handler: Function) {
  return async (req: any) => {
    // Skip auth for refresh-token endpoint
    if (req.url?.includes('/api/auth/refresh-token')) {
      return handler(req);
    }
    try {
      await connectDB();

      const authHeader = req.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');
      console.log("🚀 ~ withAuth ~ token:", token);
      
      if (!token) {
        return NextResponse.json(
          { error: 'Access token required' }, 
          { status: 401 }
        );
      }

      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      const _user = await User.findById(payload.id).select('-password');
      if (!_user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        );
      }

      req.user = _user;
      
      return handler(req);
    } catch (error) {
      console.error("🚨 Auth middleware error:", error);
      return NextResponse.json(
        { error: 'Invalid or expired token' }, 
        { status: 401 }
      );
    }
  };
}

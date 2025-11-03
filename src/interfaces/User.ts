import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'employer';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isEmailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  
  // Methods
  createJWT(): string;
  createRefreshToken(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
}

export interface IUserMethods {
  createJWT(): string;
  createRefreshToken(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
}

export interface UserModel extends Document, IUserMethods {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'employer';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isEmailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  loginAttempts: number;
  lockUntil?: Date;
}

// Made with Bob

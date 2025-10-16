"use client";
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-3">Page not found</h1>
      <p className="mb-6">The page you’re looking for doesn’t exist.</p>
      <Link href="/" className="btn-primary">Go Home</Link>
    </div>
  );
}


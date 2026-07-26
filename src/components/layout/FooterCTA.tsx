import React from 'react';
import Link from 'next/link';

export default function FooterCTA() {
  return (
    <footer className="w-full max-w-6xl mx-auto py-16 px-6 mt-20 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-12 text-sm">
      <div className="flex flex-col gap-4">
        <div className="font-bold text-2xl tracking-tight text-gray-900">StoreRoast</div>
        <p className="text-gray-500 max-w-xs leading-relaxed">
          © {new Date().getFullYear()} StoreRoast. Built by indie hackers for the global builder community.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-gray-400 tracking-wider text-xs uppercase mb-1">Product</h4>
        <div className="flex flex-col gap-3 font-medium text-gray-600">
          <Link href="/" className="hover:text-black transition-colors">Showcase</Link>
          <Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link>
        </div>
      </div>
    </footer>
  );
}

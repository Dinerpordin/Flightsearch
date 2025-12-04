import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Flight Search | Find Best Flight Deals',
  description: 'AI-powered flight search with smart recommendations and price comparison',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

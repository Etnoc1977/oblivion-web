import './globals.css';

export const metadata = {
  title: 'Oblivion — Blockchain-Verified Secure Deletion',
  description: 'Enterprise-grade data deletion with blockchain proof',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-400">
        {children}
      </body>
    </html>
  );
}

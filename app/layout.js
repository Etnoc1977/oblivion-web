import './globals.css';

export const metadata = {
  title: 'Oblion — Beyond Doubt',
  description: 'Blockchain-verified secure deletion with legally defensible certificates',
  manifest: '/manifest.json',
  themeColor: '#1db4c8',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Oblion',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen bg-[#090c16]">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}

function ServiceWorkerRegistration() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('SW registered'))
                .catch(err => console.log('SW failed:', err));
            });
          }
        `,
      }}
    />
  );
}

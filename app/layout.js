import './globals.css';

export const metadata = {
  title: 'Arch2Arch — Sebastiaan Tan | London → Channel → Paris',
  description: 'Follow Sebastiaan Tan\'s journey to complete the Arch2Arch ultra-triathlon: 140km run, English Channel swim, 300km bike ride. Live training data & progress.',
  openGraph: {
    title: 'Arch2Arch — London → Channel → Paris',
    description: '474 km ultra-triathlon. Follow the journey in real-time.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

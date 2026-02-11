export const metadata = {
  title: 'OpenClaw Control Center',
  description: 'Manage your OpenClaw agents',
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

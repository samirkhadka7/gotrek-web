import Providers from '@/app/providers';

export default function AuthRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}

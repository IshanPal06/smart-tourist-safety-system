import { AuthorityLayout } from '@/components/authority/AuthorityLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthorityLayout>{children}</AuthorityLayout>;
}

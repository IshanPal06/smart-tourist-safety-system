import { TouristLayout } from '@/components/tourist/TouristLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TouristLayout>{children}</TouristLayout>;
}

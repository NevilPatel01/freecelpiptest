import { requireAdmin } from '@/lib/admin';
import Link from 'next/link';
import { Home, Mail, MessageSquare, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className='min-h-screen bg-background'>
      <div className='border-b'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>Admin Portal</h1>
              <p className='text-sm text-muted-foreground'>
                Welcome, {session.user?.name || session.user?.email}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <Button variant='outline' size='sm' asChild>
                <Link href='/'>
                  <Home className='mr-2 h-4 w-4' />
                  Back to Site
                </Link>
              </Button>
              <form action='/api/auth/signout' method='post'>
                <Button variant='outline' size='sm' type='submit'>
                  <LogOut className='mr-2 h-4 w-4' />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {/* Sidebar */}
          <aside className='space-y-2'>
            <Link
              href='/admin'
              className='flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent'
            >
              <Mail className='h-4 w-4' />
              Newsletter Subscribers
            </Link>
            <Link
              href='/admin/feedback'
              className='flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent'
            >
              <MessageSquare className='h-4 w-4' />
              Feedback
            </Link>
          </aside>

          {/* Main Content */}
          <main className='md:col-span-3'>{children}</main>
        </div>
      </div>
    </div>
  );
}

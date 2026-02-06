'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Loader2, Star } from 'lucide-react';

interface Feedback {
  id: string;
  name: string | null;
  email: string | null;
  message: string;
  rating: number | null;
  category: string;
  createdAt: string;
  status: string;
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/feedback')
      .then((res) => res.json())
      .then((data) => {
        setFeedback(data.feedback || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch feedback:', err);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        setFeedback((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item)),
        );
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Name', 'Email', 'Message', 'Rating', 'Category', 'Status', 'Date'],
      ...feedback.map((f) => [
        f.name || 'Anonymous',
        f.email || 'N/A',
        `"${f.message.replace(/"/g, '""')}"`,
        f.rating || 'N/A',
        f.category,
        f.status,
        new Date(f.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-${new Date().toISOString()}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'resolved':
        return 'success';
      case 'archived':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>User Feedback</CardTitle>
            <CardDescription>
              {feedback.length} total feedback submission
              {feedback.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Button onClick={exportToCSV} size='sm' variant='outline'>
            <Download className='mr-2 h-4 w-4' />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {feedback.length === 0 ? (
          <p className='text-center text-muted-foreground py-8'>
            No feedback submissions yet.
          </p>
        ) : (
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className='max-w-md'>Message</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedback.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-medium'>
                      {item.name || 'Anonymous'}
                    </TableCell>
                    <TableCell>{item.email || 'N/A'}</TableCell>
                    <TableCell className='max-w-md'>
                      <div className='truncate' title={item.message}>
                        {item.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.rating ? (
                        <div className='flex items-center gap-1'>
                          <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                          <span>{item.rating}</span>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.status}
                        onValueChange={(value) => updateStatus(item.id, value)}
                      >
                        <SelectTrigger className='w-[140px]'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='new'>New</SelectItem>
                          <SelectItem value='in-progress'>
                            In Progress
                          </SelectItem>
                          <SelectItem value='resolved'>Resolved</SelectItem>
                          <SelectItem value='archived'>Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

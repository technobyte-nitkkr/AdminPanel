import { NextRequest, NextResponse } from 'next/server';
import { 
  addCategory,
  deleteQuery,
  sendMailToMultipleUsers,
  sendNotification,
  updateUser,
  updateUserByAdmin
} from '@/app/actions/admin';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    switch (action) {
      case 'add-category':
        if (!body) {
          return NextResponse.json({ error: 'Category is required' }, { status: 400 });
        }
        const categoryResult = await addCategory(body, authHeader ?? undefined);
        return NextResponse.json(categoryResult, { status: 200 });

      case 'send-mail':
        if (!body) {
          return NextResponse.json({ error: 'Mail data is required' }, { status: 400 });
        }
        const mailResult = await sendMailToMultipleUsers(body, authHeader ?? undefined);
        return NextResponse.json(mailResult, { status: 200 });

      case 'send-notification':
        if (!body) {
          return NextResponse.json({ error: 'Notification data is required' }, { status: 400 });
        }
        const notificationResult = await sendNotification(body, authHeader ?? undefined);
        return NextResponse.json(notificationResult, { status: 200 });

      case 'update-user':
        if (!body) {
          return NextResponse.json({ error: 'User data is required' }, { status: 400 });
        }
        const userResult = await updateUserByAdmin(body, authHeader ?? undefined);
        return NextResponse.json(userResult, { status: 200 });

      case 'update-users':
        const updateResult = await updateUser(authHeader ?? undefined);
        return NextResponse.json(updateResult, { status: 200 });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    switch (action) {
      case 'delete-query':
        if (!body) {
          return NextResponse.json({ error: 'Query data is required' }, { status: 400 });
        }
        const result = await deleteQuery(body, authHeader ?? undefined);
        return NextResponse.json(result, { status: 200 });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

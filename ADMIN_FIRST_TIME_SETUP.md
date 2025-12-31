
# Admin Portal - First Time Setup

## Creating Your First Admin User

Since the admin portal requires an admin account to access, you need to create your first admin user manually in the database.

### Step 1: Create a Regular User Account

1. Open your app (web or mobile)
2. Sign up with your email and password
3. Verify your email address
4. Complete the onboarding process (or skip if you're just setting up admin)

### Step 2: Get Your User ID

You need to find your `auth_user_id` from Supabase:

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to Authentication → Users
3. Find your email address
4. Copy the UUID in the "ID" column

**Option B: Using SQL**
```sql
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
```

### Step 3: Insert Admin Record

Run this SQL query in the Supabase SQL Editor:

```sql
INSERT INTO admin_users (auth_user_id, role, permissions, active)
VALUES (
  'YOUR-USER-ID-HERE',  -- Replace with your actual user ID
  'super_admin',
  '{
    "can_approve_users": true,
    "can_view_analytics": true,
    "can_manage_promo_codes": true,
    "can_manage_notifications": true,
    "can_manage_admins": true
  }'::jsonb,
  true
);
```

**Replace `'YOUR-USER-ID-HERE'`** with the UUID you copied in Step 2.

### Step 4: Verify Admin Access

1. Log out and log back in (or refresh the page)
2. Navigate to `/admin` route
3. You should now see the admin dashboard

If you don't see the admin dashboard:
- Check that the admin record was created: `SELECT * FROM admin_users WHERE auth_user_id = 'YOUR-USER-ID';`
- Verify the `active` field is `true`
- Clear your browser cache and try again

## Admin Roles Explained

### super_admin
Full access to everything, including:
- User approval/rejection
- User management
- Analytics
- Notifications
- Promo codes
- Email campaigns
- Creating other admins

### admin
Standard admin access:
- User approval/rejection
- User management
- Analytics (view only)
- Notifications
- Promo codes

### moderator
Limited access:
- User approval/rejection
- User management (view only)
- Basic analytics

### support
Support team access:
- View user profiles
- View support tickets
- No approval permissions

## Creating Additional Admins

Once you have super_admin access, you can create additional admins:

### Method 1: Using SQL (Recommended for first setup)

```sql
-- First, get the user ID of the person you want to make admin
SELECT id, email FROM auth.users WHERE email = 'new-admin@example.com';

-- Then insert the admin record
INSERT INTO admin_users (auth_user_id, role, permissions, created_by, active)
VALUES (
  'NEW-ADMIN-USER-ID',
  'admin',  -- or 'moderator', 'support'
  '{
    "can_approve_users": true,
    "can_view_analytics": true,
    "can_manage_promo_codes": true,
    "can_manage_notifications": true
  }'::jsonb,
  'YOUR-USER-ID',  -- Your super_admin user ID
  true
);
```

### Method 2: Using Admin Portal (Coming Soon)

A UI for creating and managing admins will be added to the admin portal.

## Permissions Explained

The `permissions` JSONB field controls what each admin can do:

```json
{
  "can_approve_users": true,          // Approve/reject pending users
  "can_view_analytics": true,         // View analytics dashboard
  "can_manage_promo_codes": true,     // Create/edit promo codes
  "can_manage_notifications": true,   // Send push notifications
  "can_manage_admins": true,          // Create/edit other admins (super_admin only)
  "can_manage_payments": true,        // View payment details
  "can_manage_email_campaigns": true  // Create email campaigns
}
```

## Security Best Practices

1. **Use Strong Passwords**: Admin accounts should have strong, unique passwords
2. **Enable 2FA**: Enable two-factor authentication for admin accounts (if available)
3. **Limit Admin Access**: Only give admin access to trusted team members
4. **Use Appropriate Roles**: Don't give everyone super_admin access
5. **Regular Audits**: Periodically review who has admin access
6. **Deactivate Unused Accounts**: Set `active = false` for admins who no longer need access

## Deactivating an Admin

To remove admin access without deleting the record:

```sql
UPDATE admin_users
SET active = false
WHERE auth_user_id = 'USER-ID-TO-DEACTIVATE';
```

To reactivate:

```sql
UPDATE admin_users
SET active = true
WHERE auth_user_id = 'USER-ID-TO-REACTIVATE';
```

## Troubleshooting

### "Access Denied" Error
- Verify your user ID is in the `admin_users` table
- Check that `active = true`
- Ensure you're logged in with the correct account
- Try logging out and back in

### Can't See Admin Menu
- Clear browser cache
- Check browser console for errors
- Verify the `/admin` route exists in your app

### Permission Errors
- Check your `permissions` JSONB field
- Verify your `role` is set correctly
- Contact a super_admin to update your permissions

## Next Steps

After setting up your admin account:

1. **Review Pending Users**: Check `/admin/pending-users` for any pending applications
2. **Set Up Notifications**: Configure notification templates in `/admin/notifications`
3. **Create Promo Codes**: Set up initial promo codes in `/admin/promo-codes`
4. **Review Analytics**: Familiarize yourself with the analytics dashboard
5. **Add Team Members**: Create admin accounts for your team members

## Support

If you encounter issues during setup:
1. Check the Supabase logs for errors
2. Verify all database tables exist
3. Ensure RLS policies are properly configured
4. Review the `ADMIN_WEB_PORTAL.md` guide for detailed feature documentation

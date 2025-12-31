
# Admin Web Portal Guide

## Overview

The Intentional Dating App admin portal is accessible on **both web and mobile platforms**. However, for the best experience managing pending user approvals and other administrative tasks, we recommend using the **web portal**.

## Accessing the Admin Portal

### Web Access (Recommended)
1. Navigate to your app's web URL
2. Log in with your admin credentials
3. Navigate to `/admin` route
4. You'll see the full admin dashboard with all management tools

### Mobile Access (iOS/Android)
1. Open the Intentional app
2. Log in with your admin credentials
3. Navigate to the admin section from your profile
4. Access all admin features on-the-go

## Admin Portal Features

### 1. Pending User Approvals (`/admin/pending-users`)

This is the core feature for managing new community member applications.

#### What You'll See:
- **Dashboard Overview**: Number of pending applications
- **Application List**: All pending users with:
  - Profile photo preview
  - Name, age, and location
  - Days waiting for review
  - Number of photos and status badges submitted

#### Review Process:

**Step 1: Select an Application**
- Tap on any pending user card to open the detailed review modal

**Step 2: Review Profile Information**
- Name, age, location
- Bio (if provided)
- Submission date

**Step 3: Review Photos**
Each application includes three types of photos:
- **Selfie**: Clear face photo without sunglasses
- **Full Body**: Full body photo without baggy clothes or jackets
- **Activity Photos**: Photos showing the applicant in various activities (only them in the photo)

For each photo, you can:
- Tap to expand for full-screen view
- Approve individual photos
- Reject individual photos with automatic reason
- Photos must meet quality standards:
  - Clear, high resolution
  - Good lighting
  - No filters or heavy editing
  - Meets the specific requirements for each type

**Step 4: Review Status Badges**
If the applicant applied for status badges, review:
- Badge type (e.g., "Student", "Professional", "Athlete")
- Tier level (Basic, Elite, or Star)
- Proof image (e.g., student ID, professional certification)

For each badge:
- Approve if proof is valid and clear
- Reject if proof doesn't meet requirements

**Step 5: Make Final Decision**
- **Approve**: Creates the user account and adds them to the community
  - Only approved photos are copied to their profile
  - Only approved badges are added to their profile
  - User receives welcome notification
  - User can immediately start using the app

- **Reject**: Denies the application
  - Must provide a rejection reason
  - User is notified with the reason
  - User can reapply after addressing issues

### 2. User Management (`/admin/user-management`)

Manage all approved users in the community:
- View all active users
- Search and filter users
- View user profiles and activity
- Suspend or ban users if needed
- View subscription status
- Monitor user engagement

### 3. Analytics (`/admin/analytics`)

View detailed analytics and reports:
- Total users and growth trends
- Daily/Monthly active users
- Conversion rates
- Revenue metrics
- Engagement statistics
- Match success rates
- Conversation completion rates

### 4. Notifications (`/admin/notifications`)

Manage push notifications:
- Create notification templates
- Schedule notifications
- Target specific user segments
- View notification history
- Track delivery and open rates

### 5. Promo Codes (`/admin/promo-codes`)

Create and manage promotional codes:
- Create new promo codes
- Set discount types (percentage, fixed amount, free months)
- Define applicable tiers
- Set usage limits
- Set expiration dates
- Track promo code usage

### 6. Payments (`/admin/payments`)

Monitor financial transactions:
- View all transactions
- Track subscription revenue
- Monitor refunds and disputes
- Export financial reports
- View revenue by tier

### 7. Email Campaigns (`/admin/email-campaigns`)

Manage email marketing:
- Create email campaigns
- Design email templates
- Schedule email sends
- Target user segments
- Track open and click rates

## Admin Roles and Permissions

The system supports multiple admin roles:

### Super Admin
- Full access to all features
- Can create and manage other admins
- Can modify system settings

### Admin
- Can approve/reject users
- Can manage notifications
- Can create promo codes
- Can view analytics

### Moderator
- Can approve/reject users
- Can view user profiles
- Limited analytics access

### Support
- Can view user profiles
- Can respond to support tickets
- Read-only access to most features

## Best Practices for User Approval

### Photo Quality Standards

**Selfie Requirements:**
- Clear, well-lit face photo
- No sunglasses or face coverings
- No heavy filters or editing
- Recent photo (not outdated)
- Only the applicant in the photo

**Full Body Requirements:**
- Full body visible from head to toe
- No baggy clothes or oversized jackets
- Clear view of body shape
- Good lighting and quality
- Only the applicant in the photo

**Activity Photos Requirements:**
- Shows applicant engaged in activities
- Clear, high-quality images
- Variety of activities preferred
- Only the applicant in each photo
- No group photos

### Status Badge Verification

**Basic Tier Badges:**
- Student: Valid student ID with photo
- Professional: Business card or LinkedIn profile
- Athlete: Team photo or competition proof

**Elite Tier Badges:**
- Entrepreneur: Business registration or website
- Graduate Degree: Diploma or transcript
- Certified Professional: Professional certification

**Star Tier Badges:**
- Executive: Company profile or press mention
- Published Author: Book cover with author name
- Award Winner: Award certificate or photo

### Rejection Reasons

Be specific and helpful when rejecting applications:

**Good Rejection Reasons:**
- "Selfie photo is too dark and face is not clearly visible. Please submit a well-lit photo."
- "Full body photo shows baggy clothing. Please submit a photo with fitted clothing."
- "Activity photos include other people. Please submit photos with only you in them."
- "Student ID proof is not clear. Please submit a clearer photo with your face and ID visible."

**Avoid:**
- Generic reasons like "Does not meet requirements"
- Subjective judgments about appearance
- Discriminatory language

## Technical Details

### Database Tables

**pending_users**
- Stores application data
- Status: pending, approved, rejected
- Links to auth_users table

**pending_user_photos**
- Stores submitted photos
- Can be individually approved/rejected
- Links to pending_users table

**pending_status_badges**
- Stores badge applications
- Can be individually approved/rejected
- Links to pending_users table

### Edge Function: approve-user

The approval/rejection process is handled by a Supabase Edge Function:
- Validates admin permissions
- Creates user account on approval
- Copies approved photos and badges
- Updates pending user status
- Sends notifications to applicant

### Security

- All admin actions require authentication
- Admin status verified via `admin_users` table
- Row Level Security (RLS) policies protect data
- All actions are logged with admin ID and timestamp

## Troubleshooting

### Can't See Pending Users
- Verify you're logged in with an admin account
- Check that your admin account is active in the `admin_users` table
- Refresh the page

### Approval/Rejection Not Working
- Check browser console for errors
- Verify Supabase connection
- Ensure Edge Function is deployed
- Check admin permissions

### Photos Not Loading
- Verify image URLs are accessible
- Check Supabase Storage permissions
- Try refreshing the page

## Support

For technical issues or questions:
1. Check the console logs for error messages
2. Verify database connectivity
3. Review Edge Function logs in Supabase dashboard
4. Contact the development team with specific error details

## Future Enhancements

Planned features for the admin portal:
- Bulk approval/rejection
- Advanced filtering and search
- Automated quality checks for photos
- AI-assisted badge verification
- Real-time notifications for new applications
- Mobile app optimization
- Admin activity audit log
- Custom rejection reason templates

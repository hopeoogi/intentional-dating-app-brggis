
# Intentional Dating App - Admin Portal Overview

## 🎯 Purpose
The Admin Portal is a comprehensive web-based dashboard for managing the Intentional dating app. It provides tools for user management, content moderation, analytics, notifications, and subscription management.

## 🔐 Access & Authentication

### Admin Roles
The system supports four admin role levels:

1. **Super Admin** - Full system access
   - Can create/manage other admins
   - Access to all features and data
   - Can modify system settings

2. **Admin** - Standard administrative access
   - User approval and management
   - Content moderation
   - Analytics viewing
   - Notification management

3. **Moderator** - Content-focused access
   - User profile review
   - Photo/badge verification
   - Report handling

4. **Support** - Customer service access
   - View user profiles
   - Handle support tickets
   - Limited data access

### Setting Up Admin Users

To create an admin user, run this SQL in your Supabase SQL Editor:

```sql
-- First, create an auth user (or use existing)
-- Then add them to admin_users table

INSERT INTO admin_users (auth_user_id, role, permissions, active)
VALUES (
  'YOUR_AUTH_USER_ID_HERE',
  'super_admin',
  '{
    "can_approve_users": true,
    "can_manage_notifications": true,
    "can_view_analytics": true,
    "can_manage_promo_codes": true,
    "can_manage_admins": true
  }'::jsonb,
  true
);
```

## 📊 Admin Portal Features

### 1. Dashboard (Home)
**Route:** `/admin/index`

**Features:**
- Quick stats overview
  - Total users
  - Pending applications
  - Active subscriptions
  - Revenue metrics
- Recent activity feed
- Quick action buttons
- System health indicators

**Key Metrics Displayed:**
- Daily active users (DAU)
- Monthly active users (MAU)
- Conversion rate (applicants → paid users)
- Average revenue per user (ARPU)
- Churn rate

### 2. Pending User Management
**Route:** `/admin/pending-users`

**Features:**
- Review new user applications
- View submitted photos (selfie, full body, activity)
- Verify profile information
- Approve or reject applications
- Provide rejection feedback
- Batch processing capabilities

**Approval Workflow:**
1. Admin reviews application
2. Checks photo quality and authenticity
3. Verifies profile completeness
4. Approves → User moves to active users + subscription triggered
5. Rejects → User receives feedback and can reapply

**Quality Standards Enforced:**
- Clear selfie (no sunglasses, good lighting)
- Full body photo (no baggy clothes/jackets)
- Three activity photos (solo, no group shots)
- Complete profile information
- Age verification (18+)

### 3. User Management
**Route:** `/admin/user-management`

**Features:**
- Search and filter users
- View detailed user profiles
- Edit user information
- Suspend/ban users
- View user activity history
- Manage subscription status
- Export user data

**Search/Filter Options:**
- By name, email, location
- By subscription tier (Basic/Elite/Star)
- By verification status
- By activity status (active/inactive)
- By join date range
- By location (city, state)

**User Actions:**
- View full profile
- Edit profile details
- Change subscription tier
- Suspend account (temporary)
- Ban account (permanent)
- Reset password
- View conversation history
- View match history

### 4. Analytics Dashboard
**Route:** `/admin/analytics`

**Features:**
- User demographics
  - Age distribution
  - Gender breakdown
  - Location heatmap
  - Subscription tier distribution
- Engagement metrics
  - Daily/weekly/monthly active users
  - Average session duration
  - Match success rate
  - Conversation completion rate
- Revenue analytics
  - Monthly recurring revenue (MRR)
  - Revenue by tier
  - Churn analysis
  - Lifetime value (LTV)
- Retention metrics
  - Day 1, 7, 30 retention
  - Cohort analysis
  - Feature usage stats

**Export Options:**
- CSV export for all data tables
- PDF reports
- Scheduled email reports

### 5. Notification Management
**Route:** `/admin/notifications`

**Features:**
- Manage notification templates
- Schedule push notifications
- Target specific user segments
- View notification history
- A/B test notifications
- Monitor delivery rates

**Notification Types:**
- New match notifications
- Message received
- Conversation expiring
- Daily reminders
- Promotional campaigns
- System announcements

**Targeting Options:**
- All users
- By subscription tier
- By location
- By activity level
- By demographics
- Custom segments

### 6. Promo Code Management
**Route:** `/admin/promo-codes`

**Features:**
- Create promo codes
- Set discount types (percentage, fixed, free months)
- Define applicable tiers
- Set usage limits
- Set validity periods
- Track redemptions
- Deactivate codes

**Promo Code Types:**
- Percentage discount (e.g., 20% off)
- Fixed amount (e.g., $10 off)
- Free months (e.g., first 2 months free)

**Configuration Options:**
- Code name (e.g., SUMMER2024)
- Description
- Discount value
- Applicable tiers (Basic/Elite/Star)
- Max uses (unlimited or specific number)
- Valid from/until dates
- Active/inactive status

### 7. Payment & Subscription Management
**Route:** `/admin/payments`

**Features:**
- View all transactions
- Monitor subscription status
- Handle refunds
- View revenue reports
- Export financial data
- Manage failed payments

**Payment Information:**
- Transaction history
- Subscription start/end dates
- Payment method
- Amount paid
- Currency
- Status (paid, pending, failed, refunded)

### 8. Email Campaign Management
**Route:** `/admin/email-campaigns`

**Features:**
- Create email campaigns
- Segment user lists
- Schedule sends
- Track open/click rates
- A/B testing
- Template management

**Use Cases:**
- Welcome emails
- Re-engagement campaigns
- Feature announcements
- Promotional offers
- Newsletter

## 🔒 Security Features

### Row Level Security (RLS)
All admin operations are protected by Supabase RLS policies:
- Admins can only access data they have permission for
- All actions are logged with admin user ID
- Super admins have full access
- Role-based permissions enforced at database level

### Audit Logging
All admin actions are logged:
- User approvals/rejections
- Profile edits
- Subscription changes
- Notification sends
- Promo code usage
- Login attempts

### Data Privacy
- PII (Personally Identifiable Information) is protected
- GDPR compliance features
- Data export for user requests
- Account deletion capabilities
- Encrypted sensitive data

## 📱 Mobile Admin Access

While the admin portal is primarily web-based, key features are accessible via the mobile app for admins:

**Mobile Admin Features:**
- Quick user approval
- View pending applications
- Send notifications
- View analytics dashboard
- Respond to support tickets

**Access:** Admin users see additional menu items in the app when logged in with admin credentials.

## 🚀 Getting Started as an Admin

### First Time Setup

1. **Get Admin Access**
   - Contact a Super Admin to create your admin account
   - Receive login credentials

2. **Login**
   - Use your admin credentials to log in
   - You'll be redirected to the admin dashboard

3. **Familiarize Yourself**
   - Review the dashboard
   - Check pending applications
   - Review notification templates
   - Explore analytics

4. **Start Managing**
   - Begin approving/rejecting user applications
   - Monitor system health
   - Respond to user issues

### Daily Admin Tasks

**Morning:**
- Review pending applications (target: < 24hr approval time)
- Check system health metrics
- Review overnight notifications

**Throughout Day:**
- Approve new users as they apply
- Respond to support tickets
- Monitor for inappropriate content
- Handle payment issues

**Evening:**
- Review daily metrics
- Schedule next day's notifications
- Export reports if needed

## 📊 Key Performance Indicators (KPIs)

### User Acquisition
- New applications per day
- Approval rate
- Time to approval
- Rejection reasons breakdown

### Engagement
- Daily active users (DAU)
- Messages sent per user
- Match success rate
- Conversation completion rate

### Revenue
- Monthly recurring revenue (MRR)
- Average revenue per user (ARPU)
- Churn rate
- Lifetime value (LTV)

### Quality
- Photo approval rate
- Badge verification time
- User satisfaction score
- Report resolution time

## 🛠️ Technical Implementation

### Tech Stack
- **Frontend:** React Native (mobile), React (web)
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Authentication:** Supabase Auth
- **Payments:** Superwall (Apple IAP / Google Play Billing)
- **Notifications:** Expo Notifications + FCM/APNs
- **Analytics:** Custom dashboard + Supabase queries

### Database Tables
- `admin_users` - Admin user roles and permissions
- `users` - All app users
- `pending_users` - Applications awaiting approval
- `notification_templates` - Notification message templates
- `scheduled_notifications` - Scheduled push notifications
- `promo_codes` - Promotional discount codes
- `invoices` - Payment history
- `matches` - User matches
- `messages` - Conversation messages

### API Endpoints (Supabase Edge Functions)
- `/admin/approve-user` - Approve pending user
- `/admin/reject-user` - Reject pending user
- `/admin/send-notification` - Send push notification
- `/admin/export-data` - Export user data
- `/admin/analytics` - Fetch analytics data

## 📞 Support & Resources

### For Admins
- Admin training documentation
- Video tutorials
- Support Slack channel
- Weekly admin meetings

### For Users
- In-app support chat
- Email support
- FAQ section
- Community guidelines

## 🔄 Future Enhancements

### Planned Features
- AI-powered photo verification
- Automated fraud detection
- Advanced analytics with ML insights
- Real-time dashboard updates
- Mobile admin app (dedicated)
- Integration with CRM tools
- Advanced A/B testing framework
- Automated user segmentation

### Under Consideration
- Video verification
- Background checks integration
- Social media verification
- Advanced matching algorithm tuning
- Predictive churn modeling
- Revenue forecasting

---

## 📝 Notes

- All times are in UTC unless specified
- Financial data is in USD
- User data is encrypted at rest
- Regular backups are performed daily
- System maintenance windows: Sundays 2-4 AM UTC

**Last Updated:** December 2024
**Version:** 1.0
**Maintained By:** Intentional Development Team

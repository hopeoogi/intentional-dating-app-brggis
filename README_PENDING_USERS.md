
# Pending User Approvals Feature

## Overview

The Pending User Approvals feature allows Intentional Dating App administrators to review and approve new community member applications. This ensures that only qualified users who meet the app's high standards are admitted to the community.

## Quick Start

### For Administrators

1. **First Time Setup**
   - Read: `ADMIN_FIRST_TIME_SETUP.md`
   - Create your admin account in the database
   - Log in to the admin portal

2. **Daily Usage**
   - Read: `ADMIN_QUICK_REFERENCE.md`
   - Navigate to `/admin/pending-users`
   - Review and approve/reject applications

3. **Detailed Guide**
   - Read: `ADMIN_WEB_PORTAL.md`
   - Learn all features and best practices

### For Developers

1. **Testing**
   - Read: `PENDING_USERS_TESTING_GUIDE.md`
   - Create test data
   - Verify all functionality

2. **Implementation Details**
   - Read: `PENDING_USERS_IMPLEMENTATION_SUMMARY.md`
   - Understand the architecture
   - Review integration points

3. **Platform Support**
   - Read: `PLATFORM_SUPPORT.md`
   - Understand web vs mobile
   - Choose deployment strategy

## Key Features

✅ **Complete Application Review**
- View user profile information
- Review all submitted photos
- Verify status badge applications
- Make informed approval decisions

✅ **Individual Content Approval**
- Approve/reject individual photos
- Approve/reject individual badges
- Only approved content is copied to user profile

✅ **Detailed Rejection Feedback**
- Provide specific rejection reasons
- Help applicants improve their applications
- Maintain community standards

✅ **Multi-Platform Support**
- Full functionality on web
- Full functionality on mobile (iOS/Android)
- Seamless sync across platforms

✅ **Secure and Scalable**
- Row Level Security (RLS) policies
- Admin permission verification
- Edge Function processing
- Efficient database queries

## Architecture

### Database
- `pending_users`: Main application data
- `pending_user_photos`: Submitted photos
- `pending_status_badges`: Badge applications
- `admin_users`: Admin permissions

### Backend
- Edge Function: `approve-user`
- Handles approval/rejection logic
- Creates user accounts
- Copies approved content

### Frontend
- Hook: `usePendingUsers`
- Component: `app/admin/pending-users.tsx`
- Responsive UI for web and mobile

## Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| `ADMIN_FIRST_TIME_SETUP.md` | Initial admin setup | Admins, Developers |
| `ADMIN_WEB_PORTAL.md` | Complete feature guide | Admins |
| `ADMIN_QUICK_REFERENCE.md` | Quick reference card | Admins |
| `PENDING_USERS_TESTING_GUIDE.md` | Testing procedures | Developers, QA |
| `PENDING_USERS_IMPLEMENTATION_SUMMARY.md` | Technical details | Developers |
| `PLATFORM_SUPPORT.md` | Platform comparison | Admins, Developers |

## Workflow

```
User Applies
    ↓
Application Stored in pending_users
    ↓
Admin Reviews Application
    ↓
    ├─→ Approve
    │       ↓
    │   User Account Created
    │       ↓
    │   Approved Content Copied
    │       ↓
    │   User Can Use App
    │
    └─→ Reject
            ↓
        Rejection Reason Stored
            ↓
        User Notified
            ↓
        User Can Reapply
```

## Security

- ✅ JWT authentication required
- ✅ Admin status verified
- ✅ RLS policies on all tables
- ✅ Audit trail (reviewer ID, timestamp)
- ✅ Secure Edge Function processing

## Performance

- ✅ Database indexes on key fields
- ✅ Efficient queries with joins
- ✅ Lazy loading of images
- ✅ Optimized re-renders
- ✅ Edge Function for heavy operations

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Support

- iOS 13.0+
- Android 8.0+

## API Endpoints

### approve-user Edge Function

**Endpoint:** `POST /functions/v1/approve-user`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body (Approve):**
```json
{
  "pendingUserId": "uuid",
  "action": "approve"
}
```

**Body (Reject):**
```json
{
  "pendingUserId": "uuid",
  "action": "reject",
  "rejectionReason": "Specific reason here"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User approved successfully",
  "userId": "uuid"
}
```

**Response (Error):**
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Database Schema

### pending_users
```sql
id                UUID PRIMARY KEY
auth_user_id      UUID REFERENCES auth.users
name              TEXT NOT NULL
age               INTEGER NOT NULL
bio               TEXT
city              TEXT NOT NULL
state             TEXT NOT NULL
status            TEXT DEFAULT 'pending'
rejection_reason  TEXT
submitted_at      TIMESTAMPTZ DEFAULT NOW()
reviewed_at       TIMESTAMPTZ
reviewed_by       UUID REFERENCES auth.users
```

### pending_user_photos
```sql
id                UUID PRIMARY KEY
pending_user_id   UUID REFERENCES pending_users
url               TEXT NOT NULL
photo_type        TEXT NOT NULL
upload_date       TIMESTAMPTZ DEFAULT NOW()
approved          BOOLEAN
rejection_reason  TEXT
```

### pending_status_badges
```sql
id                UUID PRIMARY KEY
pending_user_id   UUID REFERENCES pending_users
badge_type        TEXT NOT NULL
tier              TEXT NOT NULL
proof_image_url   TEXT
status            TEXT DEFAULT 'pending'
rejection_reason  TEXT
created_at        TIMESTAMPTZ DEFAULT NOW()
reviewed_at       TIMESTAMPTZ
reviewed_by       UUID REFERENCES auth.users
```

## Common Tasks

### Create Test Data
```sql
-- See PENDING_USERS_TESTING_GUIDE.md for complete scripts
INSERT INTO pending_users (auth_user_id, name, age, city, state, status)
VALUES (...);
```

### Check Pending Count
```sql
SELECT COUNT(*) FROM pending_users WHERE status = 'pending';
```

### View Recent Approvals
```sql
SELECT name, reviewed_at, reviewed_by
FROM pending_users
WHERE status = 'approved'
ORDER BY reviewed_at DESC
LIMIT 10;
```

### View Rejection Reasons
```sql
SELECT name, rejection_reason, reviewed_at
FROM pending_users
WHERE status = 'rejected'
ORDER BY reviewed_at DESC;
```

## Troubleshooting

### Issue: Can't see pending users
**Solution:** Check admin status in `admin_users` table

### Issue: Approval fails
**Solution:** Check Edge Function logs in Supabase dashboard

### Issue: Photos not loading
**Solution:** Verify image URLs and Supabase Storage permissions

### Issue: Permission denied
**Solution:** Verify RLS policies and admin permissions

## Future Enhancements

- [ ] Bulk approval/rejection
- [ ] Advanced filtering
- [ ] Automated quality checks
- [ ] AI-assisted verification
- [ ] Real-time notifications
- [ ] Admin activity audit log
- [ ] Custom rejection templates
- [ ] Application analytics

## Contributing

When contributing to this feature:
1. Follow existing code style
2. Add tests for new functionality
3. Update documentation
4. Test on both web and mobile
5. Verify security implications

## Support

For issues or questions:
1. Check documentation files
2. Review Supabase logs
3. Check browser console
4. Contact development team

## License

Part of the Intentional Dating App project.

## Version History

**v1.0.0** - Initial implementation
- Complete approval workflow
- Photo and badge review
- Multi-platform support
- Comprehensive documentation

---

**Last Updated:** December 2024  
**Maintained By:** Intentional Development Team

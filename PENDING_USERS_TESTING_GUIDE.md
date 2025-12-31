
# Pending User Approvals - Testing Guide

## Overview

This guide will help you test the complete pending user approval workflow, from application submission to admin review and approval.

## Prerequisites

1. Admin account set up (see `ADMIN_FIRST_TIME_SETUP.md`)
2. Supabase project configured
3. Edge Function `approve-user` deployed
4. Database tables created:
   - `pending_users`
   - `pending_user_photos`
   - `pending_status_badges`

## Test Scenario 1: Complete Application Flow

### Step 1: Create a Test Application

You'll need to create test data in the database since the application UI isn't shown in the provided files.

```sql
-- Create a test pending user
INSERT INTO pending_users (
  auth_user_id,
  name,
  age,
  bio,
  city,
  state,
  status,
  submitted_at
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),  -- Use any auth user ID
  'Test User',
  25,
  'I love hiking and photography. Looking for meaningful connections.',
  'San Francisco',
  'CA',
  'pending',
  NOW()
) RETURNING id;

-- Note the returned ID, you'll need it for the next steps
-- Let's say it returned: '123e4567-e89b-12d3-a456-426614174000'
```

### Step 2: Add Test Photos

```sql
-- Add selfie photo
INSERT INTO pending_user_photos (
  pending_user_id,
  url,
  photo_type,
  upload_date
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',  -- Replace with your pending_user_id
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  'selfie',
  NOW()
);

-- Add full body photo
INSERT INTO pending_user_photos (
  pending_user_id,
  url,
  photo_type,
  upload_date
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  'fullbody',
  NOW()
);

-- Add activity photos
INSERT INTO pending_user_photos (
  pending_user_id,
  url,
  photo_type,
  upload_date
) VALUES 
  (
    '123e4567-e89b-12d3-a456-426614174000',
    'https://images.unsplash.com/photo-1551632811-561732d1e306',
    'activity',
    NOW()
  ),
  (
    '123e4567-e89b-12d3-a456-426614174000',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    'activity',
    NOW()
  ),
  (
    '123e4567-e89b-12d3-a456-426614174000',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    'activity',
    NOW()
  );
```

### Step 3: Add Test Status Badges

```sql
-- Add a basic tier badge
INSERT INTO pending_status_badges (
  pending_user_id,
  badge_type,
  tier,
  proof_image_url,
  status,
  created_at
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'Student',
  'basic',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
  'pending',
  NOW()
);

-- Add an elite tier badge
INSERT INTO pending_status_badges (
  pending_user_id,
  badge_type,
  tier,
  proof_image_url,
  status,
  created_at
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'Professional',
  'elite',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
  'pending',
  NOW()
);
```

### Step 4: Test Admin Review

1. **Navigate to Admin Portal**
   - Go to `/admin/pending-users`
   - You should see 1 pending user

2. **Verify Dashboard Display**
   - Check that the user card shows:
     - Name: "Test User, 25"
     - Location: "San Francisco, CA"
     - "Submitted 0 days ago"
     - "5 photos"
     - "2 badges"

3. **Open Application Details**
   - Tap on the user card
   - Modal should open with full application details

4. **Review Profile Information**
   - Verify all fields display correctly:
     - Name, age, location, bio
     - Submission date

5. **Review Photos**
   - Should see 5 photos (1 selfie, 1 fullbody, 3 activity)
   - Each photo should have:
     - Type label
     - "Pending Review" badge
     - Approve/Reject buttons
   - Tap a photo to expand it
   - Tap again to collapse

6. **Test Photo Approval**
   - Tap "Approve" on the selfie photo
   - Badge should change to "Approved" (green)
   - Approve/Reject buttons should disappear

7. **Test Photo Rejection**
   - Tap "Reject" on one activity photo
   - Badge should change to "Rejected" (red)
   - Approve/Reject buttons should disappear

8. **Review Status Badges**
   - Should see 2 badges (Student - Basic, Professional - Elite)
   - Each badge should show:
     - Tier indicator with color
     - Badge type
     - Proof image
     - Approve/Reject buttons

9. **Test Badge Approval**
   - Tap "Approve" on the Student badge
   - Status should change to "Approved"

10. **Test Badge Rejection**
    - Tap "Reject" on the Professional badge
    - Status should change to "Rejected"

### Step 5: Test User Approval

1. **Tap "Approve" Button**
   - Confirmation alert should appear
   - Tap "Approve" to confirm

2. **Verify Success**
   - Success alert should appear
   - Modal should close
   - User should disappear from pending list

3. **Verify Database Changes**
   ```sql
   -- Check pending_users status
   SELECT status, reviewed_at, reviewed_by
   FROM pending_users
   WHERE id = '123e4567-e89b-12d3-a456-426614174000';
   -- Should show: status = 'approved', reviewed_at = current time, reviewed_by = your admin ID

   -- Check that user was created
   SELECT * FROM users
   WHERE name = 'Test User';
   -- Should return the new user record

   -- Check that approved photos were copied
   SELECT * FROM user_photos
   WHERE user_id = (SELECT id FROM users WHERE name = 'Test User');
   -- Should return 4 photos (all except the rejected one)

   -- Check that approved badges were copied
   SELECT * FROM status_badges
   WHERE user_id = (SELECT id FROM users WHERE name = 'Test User');
   -- Should return 1 badge (Student - the approved one)
   ```

## Test Scenario 2: User Rejection

### Step 1: Create Another Test Application

```sql
INSERT INTO pending_users (
  auth_user_id,
  name,
  age,
  bio,
  city,
  state,
  status,
  submitted_at
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Reject Test User',
  30,
  'Test bio for rejection',
  'Los Angeles',
  'CA',
  'pending',
  NOW()
) RETURNING id;

-- Add at least one photo
INSERT INTO pending_user_photos (
  pending_user_id,
  url,
  photo_type,
  upload_date
) VALUES (
  'YOUR-NEW-PENDING-USER-ID',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  'selfie',
  NOW()
);
```

### Step 2: Test Rejection Flow

1. **Open Application**
   - Navigate to `/admin/pending-users`
   - Tap on "Reject Test User"

2. **Tap "Reject" Button**
   - Rejection modal should appear
   - Should show:
     - Title: "Reject Application"
     - Description explaining the purpose
     - Text input for rejection reason
     - Cancel and Reject buttons

3. **Test Validation**
   - Try tapping "Reject" without entering a reason
   - Should show error: "Please provide a rejection reason"

4. **Enter Rejection Reason**
   - Type: "Photos do not meet quality standards. Please submit clearer images."
   - Tap "Reject"

5. **Verify Success**
   - Success alert should appear
   - Modal should close
   - User should disappear from pending list

6. **Verify Database**
   ```sql
   SELECT status, rejection_reason, reviewed_at, reviewed_by
   FROM pending_users
   WHERE name = 'Reject Test User';
   -- Should show: status = 'rejected', rejection_reason = your text, reviewed_at = current time
   ```

## Test Scenario 3: Multiple Pending Users

### Step 1: Create Multiple Applications

```sql
-- Create 5 test users
INSERT INTO pending_users (auth_user_id, name, age, city, state, status, submitted_at)
SELECT 
  (SELECT id FROM auth.users LIMIT 1),
  'Test User ' || generate_series,
  20 + (generate_series * 2),
  CASE 
    WHEN generate_series % 3 = 0 THEN 'New York'
    WHEN generate_series % 3 = 1 THEN 'Chicago'
    ELSE 'Miami'
  END,
  CASE 
    WHEN generate_series % 3 = 0 THEN 'NY'
    WHEN generate_series % 3 = 1 THEN 'IL'
    ELSE 'FL'
  END,
  'pending',
  NOW() - (generate_series || ' days')::interval
FROM generate_series(1, 5);
```

### Step 2: Test List Display

1. **Navigate to Pending Users**
   - Should see 5 users in the list
   - Should be sorted by submission date (newest first)

2. **Verify Stats**
   - Stats bar should show "5 Pending"

3. **Verify User Cards**
   - Each card should show correct information
   - Days waiting should be different for each user

4. **Test Scrolling**
   - List should scroll smoothly
   - All users should be accessible

## Test Scenario 4: Error Handling

### Test 1: Network Error

1. **Disconnect from Internet**
2. **Try to Approve a User**
   - Should show error alert
   - User should remain in pending list

### Test 2: Invalid Data

```sql
-- Create a pending user without required photos
INSERT INTO pending_users (auth_user_id, name, age, city, state, status)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'No Photos User',
  25,
  'Boston',
  'MA',
  'pending'
);
```

1. **Try to Approve This User**
   - Should handle gracefully
   - May show warning about missing photos

### Test 3: Permission Error

1. **Log in with a Non-Admin Account**
2. **Try to Navigate to `/admin/pending-users`**
   - Should be redirected or show access denied

## Test Scenario 5: Edge Cases

### Test 1: User with No Bio

```sql
INSERT INTO pending_users (auth_user_id, name, age, city, state, status, bio)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'No Bio User',
  28,
  'Seattle',
  'WA',
  'pending',
  NULL
);
```

- Should display without errors
- Bio section should handle null value

### Test 2: User with Many Badges

```sql
-- Create user
INSERT INTO pending_users (auth_user_id, name, age, city, state, status)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Many Badges User',
  32,
  'Austin',
  'TX',
  'pending'
) RETURNING id;

-- Add 9 badges (3 per tier)
-- Add your INSERT statements here for 9 different badges
```

- Should display all badges
- Should scroll if needed
- Each badge should be reviewable

### Test 3: Very Old Application

```sql
INSERT INTO pending_users (auth_user_id, name, age, city, state, status, submitted_at)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Old Application',
  27,
  'Portland',
  'OR',
  'pending',
  NOW() - INTERVAL '30 days'
);
```

- Should show "Submitted 30 days ago"
- Should be prioritized in the list

## Performance Testing

### Test 1: Large Number of Pending Users

```sql
-- Create 50 pending users
INSERT INTO pending_users (auth_user_id, name, age, city, state, status, submitted_at)
SELECT 
  (SELECT id FROM auth.users LIMIT 1),
  'Perf Test User ' || generate_series,
  18 + (generate_series % 50),
  'Test City',
  'CA',
  'pending',
  NOW() - (generate_series || ' hours')::interval
FROM generate_series(1, 50);
```

1. **Navigate to Pending Users**
   - Should load within 2-3 seconds
   - List should be responsive
   - Scrolling should be smooth

2. **Open and Close Multiple Applications**
   - Modal should open/close smoothly
   - No memory leaks
   - Images should load efficiently

## Cleanup

After testing, clean up test data:

```sql
-- Delete test pending users
DELETE FROM pending_users WHERE name LIKE 'Test%' OR name LIKE 'Perf Test%';

-- Delete test users (if any were approved)
DELETE FROM users WHERE name LIKE 'Test%';

-- Verify cleanup
SELECT COUNT(*) FROM pending_users WHERE status = 'pending';
```

## Checklist

Use this checklist to ensure all features are working:

- [ ] Pending users list displays correctly
- [ ] User cards show all information
- [ ] Application detail modal opens
- [ ] Profile information displays correctly
- [ ] Photos display and can be expanded
- [ ] Individual photo approval works
- [ ] Individual photo rejection works
- [ ] Status badges display correctly
- [ ] Individual badge approval works
- [ ] Individual badge rejection works
- [ ] User approval creates user account
- [ ] User approval copies approved photos
- [ ] User approval copies approved badges
- [ ] User rejection requires reason
- [ ] User rejection updates status
- [ ] Empty state displays when no pending users
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Admin permission check works
- [ ] Non-admins cannot access
- [ ] Stats display correctly
- [ ] Refresh functionality works

## Troubleshooting

### Photos Not Displaying
- Check image URLs are valid
- Verify Supabase Storage permissions
- Check browser console for CORS errors

### Approval Not Working
- Check Edge Function logs in Supabase
- Verify admin permissions
- Check browser console for errors
- Verify database RLS policies

### Modal Not Opening
- Check for JavaScript errors
- Verify React state management
- Check for conflicting styles

## Next Steps

After successful testing:
1. Deploy to production
2. Train admin team on the workflow
3. Monitor for any issues
4. Gather feedback from admins
5. Iterate on the UI/UX based on feedback


# Pending User Approvals - Deployment Checklist

## Pre-Deployment

### Database Setup
- [ ] Verify `pending_users` table exists
- [ ] Verify `pending_user_photos` table created
- [ ] Verify `pending_status_badges` table created
- [ ] Verify all RLS policies are active
- [ ] Verify indexes are created
- [ ] Test database queries for performance

### Edge Function
- [ ] Edge Function `approve-user` deployed
- [ ] Edge Function has correct permissions
- [ ] Edge Function JWT verification enabled
- [ ] Test Edge Function with sample data
- [ ] Verify Edge Function logs are accessible

### Frontend
- [ ] `usePendingUsers` hook implemented
- [ ] `pending-users.tsx` component complete
- [ ] All imports resolved
- [ ] No TypeScript errors
- [ ] No console errors in development

### Security
- [ ] RLS policies tested
- [ ] Admin permission checks working
- [ ] JWT authentication verified
- [ ] No sensitive data exposed in logs
- [ ] CORS configured correctly

### Documentation
- [ ] All documentation files created
- [ ] Documentation reviewed for accuracy
- [ ] Quick reference card available
- [ ] Testing guide complete
- [ ] Setup guide complete

## Deployment Steps

### Step 1: Database Migration
```bash
# Verify migration was successful
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('pending_user_photos', 'pending_status_badges');
```
- [ ] Migration executed successfully
- [ ] Tables created with correct schema
- [ ] RLS enabled on all tables
- [ ] Indexes created

### Step 2: Edge Function Deployment
```bash
# Verify Edge Function is deployed
# Check Supabase dashboard → Edge Functions
```
- [ ] Function shows as "ACTIVE"
- [ ] Function has correct version
- [ ] JWT verification enabled
- [ ] Test endpoint responds

### Step 3: Frontend Deployment
- [ ] Code pushed to repository
- [ ] Build successful (no errors)
- [ ] Assets compiled correctly
- [ ] Routes accessible

### Step 4: Create First Admin
```sql
-- Replace with actual user ID
INSERT INTO admin_users (auth_user_id, role, permissions, active)
VALUES (
  'YOUR-USER-ID',
  'super_admin',
  '{"can_approve_users": true, "can_view_analytics": true, "can_manage_promo_codes": true, "can_manage_notifications": true, "can_manage_admins": true}'::jsonb,
  true
);
```
- [ ] Admin user created
- [ ] Admin can log in
- [ ] Admin can access `/admin` route
- [ ] Admin can see pending users page

## Testing

### Functional Testing
- [ ] Create test pending user
- [ ] Add test photos
- [ ] Add test badges
- [ ] Admin can view pending user
- [ ] Admin can approve individual photos
- [ ] Admin can reject individual photos
- [ ] Admin can approve individual badges
- [ ] Admin can reject individual badges
- [ ] Admin can approve user
- [ ] User account created correctly
- [ ] Approved content copied correctly
- [ ] Admin can reject user
- [ ] Rejection reason stored correctly

### UI Testing
- [ ] Pending users list displays correctly
- [ ] User cards show correct information
- [ ] Modal opens and closes smoothly
- [ ] Photos display correctly
- [ ] Photos can be expanded
- [ ] Badges display correctly
- [ ] Buttons are responsive
- [ ] Loading states work
- [ ] Error states work
- [ ] Empty state displays correctly

### Cross-Platform Testing
- [ ] Web: Chrome
- [ ] Web: Firefox
- [ ] Web: Safari
- [ ] Web: Edge
- [ ] Mobile: iOS
- [ ] Mobile: Android

### Security Testing
- [ ] Non-admin cannot access admin portal
- [ ] Non-admin cannot call Edge Function
- [ ] RLS policies prevent unauthorized access
- [ ] JWT validation works
- [ ] Admin actions are logged

### Performance Testing
- [ ] Page loads in < 3 seconds
- [ ] Images load efficiently
- [ ] No memory leaks
- [ ] Smooth scrolling with 50+ users
- [ ] Database queries are fast

## Post-Deployment

### Monitoring
- [ ] Set up error monitoring
- [ ] Set up performance monitoring
- [ ] Set up database monitoring
- [ ] Set up Edge Function monitoring

### Documentation Distribution
- [ ] Share `ADMIN_FIRST_TIME_SETUP.md` with admins
- [ ] Share `ADMIN_WEB_PORTAL.md` with admins
- [ ] Share `ADMIN_QUICK_REFERENCE.md` with admins
- [ ] Share `PENDING_USERS_TESTING_GUIDE.md` with QA team
- [ ] Share `PENDING_USERS_IMPLEMENTATION_SUMMARY.md` with dev team

### Training
- [ ] Train admin team on workflow
- [ ] Demonstrate photo review standards
- [ ] Demonstrate badge verification
- [ ] Practice approval process
- [ ] Practice rejection process
- [ ] Review best practices

### Communication
- [ ] Notify team of deployment
- [ ] Share access instructions
- [ ] Provide support contact information
- [ ] Set up feedback channel

## Rollback Plan

If issues are encountered:

### Database Rollback
```sql
-- Disable new tables (don't delete, just in case)
ALTER TABLE pending_user_photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE pending_status_badges DISABLE ROW LEVEL SECURITY;

-- Or drop tables if necessary
DROP TABLE IF EXISTS pending_user_photos CASCADE;
DROP TABLE IF EXISTS pending_status_badges CASCADE;
```

### Edge Function Rollback
- [ ] Delete Edge Function from Supabase dashboard
- [ ] Or deploy previous version

### Frontend Rollback
- [ ] Revert to previous commit
- [ ] Redeploy previous version
- [ ] Verify old version works

## Success Criteria

Feature is considered successfully deployed when:

- [ ] All checklist items completed
- [ ] No critical bugs found
- [ ] Admin team trained
- [ ] Documentation distributed
- [ ] Monitoring in place
- [ ] First real user approved successfully
- [ ] Performance meets requirements
- [ ] Security verified
- [ ] Team satisfied with functionality

## Post-Launch

### Week 1
- [ ] Monitor for errors daily
- [ ] Collect admin feedback
- [ ] Track approval/rejection rates
- [ ] Monitor performance metrics
- [ ] Address any issues immediately

### Week 2-4
- [ ] Review analytics
- [ ] Optimize based on usage patterns
- [ ] Implement quick wins from feedback
- [ ] Plan future enhancements

### Month 2+
- [ ] Quarterly review of feature
- [ ] Plan major enhancements
- [ ] Update documentation as needed
- [ ] Train new admins

## Metrics to Track

### Usage Metrics
- Number of pending users per day
- Average review time
- Approval rate
- Rejection rate
- Photos approved/rejected
- Badges approved/rejected

### Performance Metrics
- Page load time
- API response time
- Database query time
- Edge Function execution time

### Quality Metrics
- User satisfaction (approved users)
- Admin satisfaction
- Error rate
- Bug reports

## Support Plan

### Immediate Support (Week 1)
- Development team on standby
- Daily check-ins with admin team
- Quick bug fixes
- Documentation updates

### Ongoing Support
- Weekly check-ins
- Monthly reviews
- Quarterly enhancements
- Continuous monitoring

## Sign-Off

### Development Team
- [ ] Lead Developer: _________________ Date: _______
- [ ] Backend Developer: _________________ Date: _______
- [ ] Frontend Developer: _________________ Date: _______

### QA Team
- [ ] QA Lead: _________________ Date: _______
- [ ] QA Tester: _________________ Date: _______

### Admin Team
- [ ] Admin Lead: _________________ Date: _______
- [ ] Admin User: _________________ Date: _______

### Product Team
- [ ] Product Manager: _________________ Date: _______
- [ ] Project Manager: _________________ Date: _______

---

**Deployment Date:** _________________  
**Deployed By:** _________________  
**Version:** 1.0.0  
**Status:** [ ] Ready [ ] In Progress [ ] Complete [ ] Rolled Back

## Notes

_Add any deployment notes, issues encountered, or special considerations here:_

---

**Last Updated:** December 2024

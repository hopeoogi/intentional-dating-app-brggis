
# Supabase Subscription Plan Guide

## Current Status

**Organization**: Intentional Dating App  
**Plan**: FREE  
**Project**: plnfluykallohjimxnja  
**Region**: us-west-2

## Free Plan Limits

### Database
- **Storage**: 500 MB
- **Connections**: Unlimited
- **Rows**: Unlimited (within storage limit)

### File Storage
- **Storage**: 1 GB
- **Bandwidth**: 2 GB/month
- **File uploads**: Unlimited (within storage limit)

### Authentication
- **Users**: 50,000 monthly active users (MAU)
- **Social OAuth**: Included
- **Email auth**: Included

### API
- **Requests**: Unlimited
- **Bandwidth**: 2 GB/month
- **Edge Functions**: 500,000 invocations/month

### Realtime
- **Concurrent connections**: 200
- **Messages**: 2 million/month

### Support
- **Community support**: Forum and Discord
- **Response time**: Best effort

## When to Upgrade

### Upgrade to Pro ($25/month) When:

1. **Database Size**
   - Approaching 500 MB
   - Need more than 8 GB storage

2. **Active Users**
   - Approaching 50,000 MAU
   - Need up to 100,000 MAU

3. **Bandwidth**
   - Exceeding 2 GB/month
   - Need up to 50 GB/month

4. **Features**
   - Need daily backups
   - Need point-in-time recovery
   - Need email support
   - Need custom domains

5. **Performance**
   - Need dedicated resources
   - Need faster query performance
   - Need priority support

## Pro Plan Benefits ($25/month)

### Increased Limits
- **Database**: 8 GB storage
- **File Storage**: 100 GB
- **Bandwidth**: 50 GB/month
- **MAU**: 100,000 users
- **Edge Functions**: 2 million invocations/month
- **Realtime**: 500 concurrent connections

### Additional Features
- ✅ Daily backups (7 days retention)
- ✅ Point-in-time recovery
- ✅ Email support
- ✅ Custom domains
- ✅ Compute credits
- ✅ Priority support

### Performance
- ✅ Dedicated resources
- ✅ Faster query performance
- ✅ Better reliability
- ✅ Lower latency

## Monitoring Your Usage

### How to Check Current Usage

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/plnfluykallohjimxnja

2. **Check Database Size**
   - Settings → Database → Database size
   - Should show current usage vs 500 MB limit

3. **Check File Storage**
   - Storage → Usage
   - Shows storage used and bandwidth

4. **Check Active Users**
   - Authentication → Users
   - Count monthly active users

5. **Check API Usage**
   - Settings → API → Usage
   - Shows request count and bandwidth

### Set Up Alerts

1. **Database Size Alert**
   - Alert when > 400 MB (80% of limit)

2. **MAU Alert**
   - Alert when > 40,000 users (80% of limit)

3. **Bandwidth Alert**
   - Alert when > 1.6 GB/month (80% of limit)

## Current App Usage Estimate

Based on your app structure:

### Database Size
- **Users table**: ~1 KB per user
- **Photos**: URLs only (not stored in DB)
- **Messages**: ~500 bytes per message
- **Other tables**: Minimal

**Estimate**: 
- 1,000 users = ~5 MB
- 10,000 users = ~50 MB
- 50,000 users = ~250 MB

**Conclusion**: Free plan sufficient for first 50,000 users

### File Storage
- **Profile photos**: Stored in Supabase Storage
- **Average photo**: 500 KB - 2 MB
- **Photos per user**: 4-7 photos

**Estimate**:
- 1,000 users × 5 photos × 1 MB = 5 GB
- **Conclusion**: Will need Pro plan once you have ~200 users with photos

### Bandwidth
- **API requests**: Minimal data transfer
- **Photo downloads**: Main bandwidth usage
- **Average session**: 10-20 MB

**Estimate**:
- 100 active users/day × 15 MB = 1.5 GB/month
- **Conclusion**: Free plan sufficient for ~130 daily active users

## Recommendation

### Immediate Action
✅ **Stay on Free Plan**
- Current usage is minimal
- No immediate need to upgrade
- Monitor usage weekly

### Upgrade Triggers

**Upgrade to Pro when ANY of these occur:**

1. **200+ users with photos** (storage limit)
2. **40,000+ monthly active users** (MAU limit)
3. **130+ daily active users** (bandwidth limit)
4. **400+ MB database size** (database limit)
5. **Need daily backups** (feature requirement)

### Monitoring Schedule

**Weekly** (First 3 months):
- Check database size
- Count active users
- Review bandwidth usage

**Monthly** (After 3 months):
- Review all metrics
- Project growth
- Plan upgrade if needed

## How to Upgrade

### When Ready to Upgrade:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/org/poapnxwrktrjlrwlethm/billing

2. **Select Pro Plan**
   - Click "Upgrade to Pro"
   - Review pricing ($25/month)

3. **Add Payment Method**
   - Enter credit card details
   - Confirm billing information

4. **Confirm Upgrade**
   - Review changes
   - Click "Upgrade"

5. **Verify Upgrade**
   - Check new limits in dashboard
   - Test increased performance

### Upgrade Process
- **Downtime**: None
- **Data migration**: Automatic
- **Time**: Instant
- **Billing**: Prorated for first month

## Cost Projections

### Growth Scenarios

**Scenario 1: Slow Growth**
- 100 users/month
- Stay on Free plan for 6-12 months
- Upgrade at ~1,000 users
- **Cost**: $0 for 6-12 months, then $25/month

**Scenario 2: Moderate Growth**
- 500 users/month
- Upgrade at 3-4 months
- **Cost**: $0 for 3-4 months, then $25/month

**Scenario 3: Rapid Growth**
- 2,000 users/month
- Upgrade at 1-2 months
- **Cost**: $0 for 1-2 months, then $25/month

### Annual Cost Estimate

**Year 1** (assuming moderate growth):
- Months 1-3: Free ($0)
- Months 4-12: Pro ($25 × 9 = $225)
- **Total**: $225

**Year 2** (assuming continued growth):
- All months: Pro ($25 × 12 = $300)
- **Total**: $300

## Alternative: Team Plan ($599/month)

Only consider if you need:
- 100 GB database
- 200 GB file storage
- 250 GB bandwidth
- 500,000 MAU
- SOC2 compliance
- Custom contracts

**Recommendation**: Not needed for dating app at this scale

## Summary

### Current Status
- ✅ Free plan is sufficient
- ✅ No immediate upgrade needed
- ✅ Monitor usage weekly

### Action Items
1. Set up usage monitoring
2. Create alerts at 80% of limits
3. Review usage monthly
4. Plan upgrade when approaching limits

### Upgrade Timeline
- **Estimated**: 3-6 months
- **Trigger**: 200+ users with photos OR 40K MAU
- **Cost**: $25/month
- **Benefit**: 40x more storage, 25x more bandwidth

---

**Last Updated**: January 1, 2025  
**Next Review**: February 1, 2025  
**Status**: ✅ FREE PLAN SUFFICIENT

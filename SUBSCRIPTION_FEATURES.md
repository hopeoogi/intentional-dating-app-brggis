
# Subscription Features Implementation

## Overview
This document outlines the subscription tiers and features implemented in the Intentional Dating App.

## Subscription Tiers

### Basic ($15/month)
- **Verification Badges**: 1 badge (blue)
- **Match Range**: 50 miles (changeable once every 6 months)
- **Daily Matches**: 3 per day
- **Match Access**: Basic status matches only
- **Daily Conversations**: 3 new conversations per day
- **Status Selections**: Up to 5 verification statuses

### Elite ($50/month)
- **Verification Badges**: Up to 3 badges (blue)
- **Match Range**: 100 miles (changeable once every 3 months)
- **Daily Matches**: 15 per day
- **Match Access**: Basic and Elite status matches
- **Daily Conversations**: 15 new conversations per day
- **Status Selections**: Up to 8 verification statuses
- **Advanced Filters**: Height, body type, ethnicity preferences

### Star ($125/month)
- **Verification Badges**: Up to 6 badges (gold)
- **Match Range**: 200 miles (changeable anytime)
- **Daily Matches**: 23 per day
- **Match Access**: Basic, Elite, and Star status matches
- **Daily Conversations**: 23 new conversations per day
- **Status Selections**: Up to 10 verification statuses
- **Premium Filters**: All advanced filters available
- **Priority Support**: Dedicated customer support

## Self-Service Settings

Users can manage the following settings on their own:

### Account Management
- Change password
- Change email (requires authentication)
- Change phone number (requires authentication)
- View previous invoices

### Profile Settings
- Remove from active pool (profile hidden but can continue active conversations)
- Toggle between dating and networking mode
- Toggle push notifications on/off

### Match Preferences
- Set daily match limit (Elite and Star only)
- Set daily conversation limit (Elite and Star only)
- Configure match filters based on subscription tier
- Select preferred verification statuses
- Set height, body type, and ethnicity preferences (Elite and Star only)

## Database Schema

The following tables have been created:

1. **users** - Core user information and subscription details
2. **status_badges** - User verification badges
3. **user_photos** - User profile photos
4. **match_preferences** - User matching preferences
5. **matches** - User matches
6. **messages** - Conversation messages
7. **pending_users** - Users awaiting admin approval
8. **invoices** - Payment history

All tables implement Row Level Security (RLS) policies for data protection.

## UI Updates

### Matches Screen
- Full-screen profile card design matching the uploaded example
- Name, age, and location displayed at bottom
- Multiple status badges shown horizontally with tier-specific colors:
  - Basic: Bright blue (#00BFFF)
  - Elite: Purple (#9370DB)
  - Star: Gold (#FFD700)
- Two action buttons: Pass (X) and Message
- Match counter at top of screen

### Settings Screen
- Comprehensive settings management
- Subscription tier display
- Account management options
- Profile visibility toggle
- Push notification toggle
- Dating/Networking mode toggle
- Daily limits display (Elite and Star)
- Location settings

### Subscription Screen
- Visual comparison of all three tiers
- Feature lists for each tier
- Current plan indicator
- Easy upgrade/downgrade options

### Match Filters Screen
- Tier-based filter availability
- Status preference selection (limited by tier)
- Match tier selection (Basic, Elite, Star)
- Advanced filters for Elite and Star:
  - Height preferences
  - Body type preferences
  - Ethnicity preferences
- Upgrade prompts for locked features

## Key Features

### Badge Design
- Angled badge design with skewed transform
- Uppercase text with letter spacing
- Color-coded by tier
- Multiple badges displayed per user

### Conversation Management
- No double messaging restriction (removed)
- Must clear conversations before viewing new matches
- Minimum 36 characters to start conversation
- "End Conversation" button for respectful closure

### Admin Approval
- All new users must be manually approved
- Upon approval, users are charged Basic tier subscription
- Pending users table for admin review

## Next Steps

### Admin Panel (To Be Implemented)
- User approval interface
- User management (edit, delete, view)
- Email collection for campaigns
- Data analytics and reporting
- Payment tracking
- Push notification management and scheduling
- Notification wording customization

### Payment Integration
- Integrate payment processor (Stripe/Superwall)
- Implement subscription billing
- Handle upgrades/downgrades
- Manage payment failures

### Authentication
- Email verification
- Password reset
- Email change with verification
- Phone number change with verification

### Additional Features
- Location-based matching algorithm
- Daily limit reset mechanism
- Distance change restrictions
- Badge verification workflow
- Photo approval workflow


# Conversation Flow Testing Guide

This document outlines the testing procedures for the three-option conversation flow: **Reply**, **End Conversation**, and **Not Now**.

## Overview

The Intentional dating app implements an anti-ghosting conversation system where users must actively manage their conversations. This guide ensures all scenarios are properly tested.

## Test Scenarios

### 1. Initial Conversation Start

**Scenario:** User A starts a conversation with User B

**Steps:**
1. User A views User B's profile
2. User A clicks "Start Conversation"
3. User A types a message (minimum 36 characters)
4. User A sends the message

**Expected Results:**
- Message is sent successfully
- User B receives a notification
- Conversation appears in User A's "Active Conversations"
- Conversation appears in User B's "Needs Your Response" with 24-hour deadline
- User B sees three options: Reply, End Conversation, Not Now

**Database Checks:**
```sql
-- Verify match record
SELECT * FROM matches WHERE id = 'match_id';
-- Should have:
-- conversation_started = true
-- pending_response_from = User B's ID
-- response_deadline = 24 hours from now

-- Verify message record
SELECT * FROM messages WHERE match_id = 'match_id';
-- Should have:
-- sender_id = User A's ID
-- receiver_id = User B's ID
-- content = message text
-- read = false
```

### 2. Reply Option

**Scenario:** User B replies to User A's message

**Steps:**
1. User B opens the conversation
2. User B types a reply (minimum 2 characters)
3. User B sends the reply

**Expected Results:**
- Reply is sent successfully
- User A receives a notification
- Conversation moves to "Active Conversations" for both users
- pending_response_from switches to User A
- New 24-hour deadline set for User A
- Both users can continue messaging freely

**Database Checks:**
```sql
-- Verify match updated
SELECT * FROM matches WHERE id = 'match_id';
-- Should have:
-- pending_response_from = User A's ID
-- response_deadline = 24 hours from reply time
-- last_message_date = current timestamp

-- Verify new message
SELECT * FROM messages WHERE match_id = 'match_id' ORDER BY timestamp DESC LIMIT 1;
-- Should have:
-- sender_id = User B's ID
-- receiver_id = User A's ID
```

### 3. End Conversation Option

**Scenario:** User B ends the conversation

**Steps:**
1. User B opens the conversation
2. User B clicks "End Conversation"
3. User B confirms the action

**Expected Results:**
- Conversation is marked as ended
- User A receives notification: "This person no longer wants to talk. It's time to move on."
- Conversation removed from both users' active lists
- Neither user can send further messages
- Conversation appears in "Ended Conversations" (if implemented)

**Database Checks:**
```sql
-- Verify match ended
SELECT * FROM matches WHERE id = 'match_id';
-- Should have:
-- conversation_ended = true
-- ended_by = User B's ID
-- ended_at = current timestamp
-- ended_reason = 'user_initiated'
```

### 4. Not Now Option

**Scenario:** User B selects "Not Now"

**Steps:**
1. User B opens the conversation
2. User B clicks "Not Now"
3. System confirms the action

**Expected Results:**
- Conversation stays pinned in "Needs Your Response"
- not_now_count increments by 1
- Deadline extends by 24 hours
- User B can browse matches but cannot start new conversations
- User B sees message: "This conversation will stay pinned. You can browse but cannot start new conversations until you respond or end this one."

**Database Checks:**
```sql
-- Verify match updated
SELECT * FROM matches WHERE id = 'match_id';
-- Should have:
-- not_now_count = previous count + 1
-- response_deadline = extended by 24 hours
-- pending_response_from = still User B's ID
```

### 5. Multiple "Not Now" Selections

**Scenario:** User B selects "Not Now" multiple times

**Steps:**
1. User B selects "Not Now" (first time)
2. Wait or simulate time passing
3. User B selects "Not Now" (second time)
4. User B selects "Not Now" (third time)

**Expected Results:**
- Each time, not_now_count increments
- Each time, deadline extends by 24 hours
- After 3 "Not Now" selections, consider auto-ending or warning user
- User B still cannot start new conversations

**Database Checks:**
```sql
-- Verify not_now_count
SELECT not_now_count, response_deadline FROM matches WHERE id = 'match_id';
-- Should show incremented count and extended deadline
```

### 6. Deadline Expiration

**Scenario:** User B doesn't respond within 24 hours

**Steps:**
1. User A sends message
2. Wait 24 hours (or simulate)
3. System checks for expired deadlines

**Expected Results:**
- Conversation automatically ends
- User A receives notification
- User B receives notification about missed response
- Conversation marked as ended with reason 'deadline_expired'

**Database Checks:**
```sql
-- Verify auto-ended conversation
SELECT * FROM matches WHERE id = 'match_id';
-- Should have:
-- conversation_ended = true
-- ended_reason = 'deadline_expired'
-- ended_at = deadline timestamp
```

### 7. Back-and-Forth Conversation

**Scenario:** Users have an active conversation

**Steps:**
1. User A sends message
2. User B replies
3. User A replies
4. User B replies
5. Continue for 10+ messages

**Expected Results:**
- All messages delivered successfully
- pending_response_from alternates between users
- Deadline resets with each reply
- No restrictions on message frequency
- Both users can send multiple messages in a row (no double-messaging restriction)

**Database Checks:**
```sql
-- Verify message count
SELECT COUNT(*) FROM messages WHERE match_id = 'match_id';
-- Should show all messages

-- Verify alternating senders (optional, since double-messaging is allowed)
SELECT sender_id, timestamp FROM messages WHERE match_id = 'match_id' ORDER BY timestamp;
```

### 8. Conversation Clearing

**Scenario:** User must clear conversations before starting new ones

**Steps:**
1. User A has 3 pending conversations
2. User A tries to start a new conversation
3. System blocks the action

**Expected Results:**
- User A sees message: "You must respond to or end your pending conversations before starting new ones"
- User A is directed to conversations screen
- New conversation is not started

**Database Checks:**
```sql
-- Check pending conversations
SELECT COUNT(*) FROM matches 
WHERE pending_response_from = 'User A ID' 
AND conversation_ended = false;
-- Should show count of pending conversations
```

### 9. Notification Delivery

**Scenario:** Test all notification types

**Test Cases:**
- New message notification
- Conversation ending notification
- Deadline reminder (6 hours before expiry)
- Deadline expired notification

**Expected Results:**
- All notifications delivered within 30 seconds
- Notifications contain correct information
- Deep links work correctly
- Notifications respect user preferences

### 10. Edge Cases

#### 10a. User Blocks Mid-Conversation

**Steps:**
1. Active conversation between User A and User B
2. User A blocks User B

**Expected Results:**
- Conversation ends immediately
- User B notified that conversation ended
- No further messages possible

#### 10b. User Deletes Account Mid-Conversation

**Steps:**
1. Active conversation between User A and User B
2. User A deletes account

**Expected Results:**
- Conversation ends
- User B notified
- User A's data handled per privacy policy

#### 10c. Simultaneous Actions

**Steps:**
1. User A and User B both try to end conversation at same time

**Expected Results:**
- First action processed
- Second action handled gracefully
- No errors or duplicate notifications

#### 10d. Network Interruption

**Steps:**
1. User A sends message
2. Network disconnects mid-send
3. Network reconnects

**Expected Results:**
- Message queued locally
- Message sent when connection restored
- User sees appropriate loading/error states

## Automated Testing

### Unit Tests

```typescript
describe('Conversation Flow', () => {
  test('should create conversation when first message sent', async () => {
    // Test implementation
  });

  test('should update pending_response_from on reply', async () => {
    // Test implementation
  });

  test('should end conversation when End Conversation clicked', async () => {
    // Test implementation
  });

  test('should extend deadline when Not Now clicked', async () => {
    // Test implementation
  });

  test('should prevent new conversations when pending exist', async () => {
    // Test implementation
  });
});
```

### Integration Tests

```typescript
describe('Conversation Integration', () => {
  test('full conversation flow from start to end', async () => {
    // Test complete flow
  });

  test('deadline expiration handling', async () => {
    // Test auto-ending
  });

  test('notification delivery', async () => {
    // Test all notification types
  });
});
```

## Manual Testing Checklist

### Pre-Testing Setup
- [ ] Test users created (User A, User B, User C)
- [ ] Test users have valid profiles
- [ ] Test users have active subscriptions
- [ ] Push notifications enabled for test devices
- [ ] Database access for verification

### Basic Flow Tests
- [ ] Start conversation (User A → User B)
- [ ] Reply to conversation (User B → User A)
- [ ] End conversation (User B ends)
- [ ] Not Now selection (User B)
- [ ] Multiple Not Now selections
- [ ] Deadline expiration

### Advanced Flow Tests
- [ ] Back-and-forth conversation (10+ messages)
- [ ] Multiple simultaneous conversations
- [ ] Conversation clearing requirement
- [ ] Block user mid-conversation
- [ ] Delete account mid-conversation

### UI/UX Tests
- [ ] Conversation list displays correctly
- [ ] Pending conversations highlighted
- [ ] Action buttons visible and functional
- [ ] Loading states shown appropriately
- [ ] Error messages clear and helpful
- [ ] Confirmation dialogs work correctly

### Notification Tests
- [ ] New message notification
- [ ] Conversation ended notification
- [ ] Deadline reminder notification
- [ ] Deadline expired notification
- [ ] Notification deep links work

### Performance Tests
- [ ] Conversation list loads quickly (<2s)
- [ ] Messages send quickly (<1s)
- [ ] No lag when scrolling messages
- [ ] App remains responsive during operations

### Edge Case Tests
- [ ] Network interruption handling
- [ ] Simultaneous actions
- [ ] Very long messages
- [ ] Special characters in messages
- [ ] Emoji support

## Bug Reporting Template

When reporting bugs, include:

```
**Bug Title:** [Brief description]

**Severity:** [Critical/High/Medium/Low]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots/Videos:**
[Attach if applicable]

**Device Info:**
- Device: [iPhone 14 Pro / Samsung Galaxy S23]
- OS Version: [iOS 17.0 / Android 14]
- App Version: [1.0.0]

**Database State:**
[Relevant database records if applicable]

**Additional Notes:**
[Any other relevant information]
```

## Success Criteria

The conversation flow is considered fully tested and ready for production when:

- [ ] All test scenarios pass
- [ ] No critical or high-severity bugs
- [ ] All notifications deliver correctly
- [ ] Performance meets requirements
- [ ] Edge cases handled gracefully
- [ ] User feedback is positive
- [ ] Analytics tracking works
- [ ] Database integrity maintained

## Monitoring in Production

After launch, monitor:

- Conversation completion rate
- Average response time
- "Not Now" usage frequency
- Deadline expiration rate
- User complaints about ghosting
- Notification delivery rate
- App crash rate during conversations

## Resources

- Conversation Flow Diagram: [Link to diagram]
- Database Schema: [Link to schema]
- API Documentation: [Link to API docs]
- User Feedback Form: [Link to form]

---

**Last Updated:** December 2024
**Version:** 1.0
**Tested By:** QA Team

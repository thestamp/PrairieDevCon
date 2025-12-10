# Incident Communication Playbook
## Hybrid Rapid-Response Transparency Model

**Last Updated:** December 9, 2025  
**Version:** 1.0  
**Owner:** Incident Response Team

---

## Overview

This playbook implements a three-pronged approach combining speed, relationship management, and transparency for service outage communications.

### Core Principles
1. **Speed First:** Initial notification within 10 minutes
2. **Relationship Awareness:** VIP customers receive enhanced communication
3. **Transparency Hub:** Single source of truth for ongoing updates
4. **Multi-Channel Consistency:** Coordinated messaging across all platforms

---

## Timeline & Execution Steps

### T+0 to T+5 Minutes: Detection & Assessment

**Actions:**
- [ ] Automated monitoring triggers incident alert
- [ ] On-call engineer confirms impact scope
- [ ] Incident commander classifies severity (P0-P4)
- [ ] Activate incident response team

**Outputs:**
- Severity classification
- Estimated affected user count
- Initial impact statement (1-2 sentences)

---

### T+5 to T+10 Minutes: Rapid Notification Launch

**Actions:**
1. [ ] Trigger automated multi-channel broadcast (all channels simultaneously)
2. [ ] Deploy in-app banner notification
3. [ ] Update status page to "Investigating"
4. [ ] Send initial email to all affected users
5. [ ] Post initial social media update

**Channels:**
- Email (all users)
- In-app banner (persistent)
- Status page (status.company.com)
- Twitter/X (@CompanyStatus)
- Slack community channel

**Message Type:** Use Template A1 (Initial Alert - General)

---

### T+10 to T+20 Minutes: Hub Launch & VIP Outreach

**Actions:**
1. [ ] Launch dedicated incident hub page (incidents.company.com/[incident-id])
2. [ ] Populate hub with:
   - Real-time status ticker
   - Component status dashboard
   - Initial technical summary
   - Estimated resolution timeline
   - Workaround documentation (if available)
3. [ ] Send secondary notification with hub link to all channels
4. [ ] **VIP Protocol:** Dedicated account managers call top 5 enterprise customers
5. [ ] Post technical deep-dive to status page for technical subscribers

**Message Types:**
- Template A2 (Hub Announcement - General)
- Template B1 (VIP Phone Script)
- Template C1 (Technical Deep-Dive)

---

### T+20 Minutes Onward: Sustained Transparency

**Actions (Every 30 Minutes):**
- [ ] Update incident hub with latest status
- [ ] Post brief update to status page
- [ ] Social media progress update (if significant change)

**Actions (Hourly):**
- [ ] Email update to all affected users with hub link
- [ ] Internal stakeholder briefing

**Actions (As Events Occur):**
- [ ] Workaround discovered → Immediate hub update + push notification
- [ ] Resolution ETA change → All-channel update within 5 minutes
- [ ] Partial restoration → Immediate notification with component details

---

### Resolution Phase

**Actions:**
- [ ] Confirm full service restoration with engineering team
- [ ] Update all channels within 5 minutes of confirmation
- [ ] Send "All Clear" email to all affected users
- [ ] Update status page to "Operational"
- [ ] Post resolution notice on social media
- [ ] Schedule post-mortem (within 48 hours)
- [ ] Update incident hub with final timeline and resolution summary

**Message Type:** Template A3 (Resolution Announcement)

---

### Post-Incident (Within 48 Hours)

**Actions:**
- [ ] Publish detailed post-mortem to incident hub
- [ ] Email post-mortem link to all affected users
- [ ] Hold VIP customer debrief calls (top 5 accounts)
- [ ] Internal lessons-learned session
- [ ] Update runbooks based on findings

**Message Type:** Template D1 (Post-Mortem)

---

## Communication Templates

### Template A1: Initial Alert - General
**Channel:** Email, In-App, Status Page, Social Media  
**Timing:** T+10 minutes  
**Audience:** All users

```
Subject: [URGENT] Service Disruption - We're Investigating

We're currently experiencing an unexpected service disruption affecting [FEATURE/SERVICE]. 

⚠️ Impact: [BRIEF DESCRIPTION]
🕐 Started: [TIME] EST
📊 Status: Investigating
⏱️ ETA: Updates every 30 minutes

Our engineering team is actively working to resolve this issue.

🔗 Real-time updates: [INCIDENT HUB LINK]
📧 Questions: support@company.com

We apologize for the disruption and appreciate your patience.

- The [Company] Team
```

---

### Template A2: Hub Announcement - General
**Channel:** Email, Push Notification  
**Timing:** T+15 minutes  
**Audience:** All users

```
Subject: Service Disruption Update - Live Status Hub Now Available

We've launched a dedicated incident hub for real-time updates:

🔗 [INCIDENT HUB LINK]

This hub provides:
✓ Live status updates every 10-15 minutes
✓ Component-level system status
✓ Technical details and root cause analysis
✓ Workarounds and alternative solutions
✓ Direct Q&A with our response team

Current Status: [STATUS UPDATE]
Next Update: [TIME]

Bookmark this page for the latest information.

- The [Company] Team
```

---

### Template B1: VIP Phone Script
**Channel:** Phone Call  
**Timing:** T+10 minutes  
**Audience:** Top 5 enterprise accounts

```
[ACCOUNT MANAGER SCRIPT]

"Hi [CUSTOMER NAME], this is [YOUR NAME] from [COMPANY]. I'm calling to personally 
inform you of a service disruption we're currently experiencing.

SITUATION:
- Our [SERVICE] went down at [TIME] EST
- Root cause: [TECHNICAL SUMMARY if known, otherwise "under investigation"]
- Impact on your account: [SPECIFIC IMPACT]
- Current status: [STATUS]

TIMELINE:
- Engineering team engaged: [TIME]
- Estimated resolution: [ETA or "still determining"]
- Next update to you personally: [TIME]

SUPPORT:
- I'm your dedicated point of contact throughout this incident
- Direct line: [YOUR PHONE]
- We've also launched an incident hub: [LINK]

WORKAROUNDS:
[IF AVAILABLE: Describe alternative workflows]
[IF NOT: "We're actively working on workarounds and will update you immediately"]

Do you have any immediate questions or concerns about business impact?"

[LISTEN AND DOCUMENT CUSTOMER RESPONSE]

"I'll call you back in [30/60] minutes with an update, or sooner if the situation changes. 
Thank you for your patience and partnership."
```

---

### Template C1: Technical Deep-Dive
**Channel:** Status Page, Incident Hub  
**Timing:** T+15 minutes  
**Audience:** Technical subscribers, engineers

```
# Technical Incident Report
**Incident ID:** INC-[DATE]-[NUMBER]  
**Severity:** P[0-4]  
**Started:** [TIMESTAMP] EST  
**Status:** Investigating

## Component Status
| Component | Status | Impact |
|-----------|--------|--------|
| Database (Primary) | ❌ Down | Read/Write operations failing |
| Database (Replica) | ⚠️ Degraded | Read-only queries delayed |
| Application Servers | ✅ Operational | Queueing requests |
| Cache Layer | ✅ Operational | Serving stale data |
| API Gateway | ✅ Operational | Returning 503 errors |

## Impact Analysis
- **Affected Users:** ~10,000 active sessions
- **Failed Requests:** ~45,000 (and counting)
- **Degraded Features:** [List specific features]
- **Unaffected Features:** [List working features]

## Technical Summary
At [TIME] EST, our monitoring detected connection pool exhaustion on the primary 
PostgreSQL database cluster. Initial investigation indicates [TECHNICAL DETAILS].

Error signature: `[ERROR MESSAGE/STACK TRACE SNIPPET]`

## Current Actions
1. Database team analyzing connection metrics and slow query logs
2. Network team investigating potential infrastructure issues
3. Prepared failover to replica cluster (evaluating data consistency impact)
4. Rolling restart of application servers to clear stale connections

## Workarounds
**For Read Operations:** 
- Use [ALTERNATIVE ENDPOINT] for read-only queries (may return stale data up to 5 min old)

**For Write Operations:**
- Currently no workaround available
- Requests are being queued and will process upon restoration

## Next Update
[TIME] EST (15 minutes) or upon significant status change

## Response Team
- Incident Commander: [NAME]
- Database Lead: [NAME]
- Communications Lead: [NAME]
```

---

### Template A3: Resolution Announcement
**Channel:** All Channels  
**Timing:** Upon confirmation of full restoration  
**Audience:** All users

```
Subject: ✅ RESOLVED - Service Fully Restored

Good news! We've fully restored service as of [TIME] EST.

✅ Status: All systems operational
⏱️ Duration: [DURATION]
🔧 Resolution: [BRIEF DESCRIPTION]

All features are now functioning normally. If you continue experiencing issues, 
please contact support@company.com.

WHAT'S NEXT:
📝 Detailed post-mortem: Within 48 hours
🔗 Final incident report: [INCIDENT HUB LINK]

We sincerely apologize for the disruption and appreciate your patience.

- The [Company] Team
```

---

### Template D1: Post-Mortem
**Channel:** Email, Incident Hub  
**Timing:** Within 48 hours of resolution  
**Audience:** All affected users

```
Subject: Incident Post-Mortem - [DATE] Service Disruption

We're committed to transparency. Here's our detailed analysis of [DATE]'s incident.

## Incident Summary
- **Duration:** [START TIME] to [END TIME] EST ([DURATION])
- **Impact:** [AFFECTED USERS] users, [AFFECTED FEATURES]
- **Root Cause:** [DETAILED TECHNICAL EXPLANATION]

## Timeline of Events
| Time (EST) | Event |
|------------|-------|
| [TIME] | Initial trigger: [EVENT] |
| [TIME] | Monitoring alert fired |
| [TIME] | Engineering team engaged |
| [TIME] | Root cause identified |
| [TIME] | Mitigation deployed |
| [TIME] | Service restored |
| [TIME] | Full verification complete |

## Root Cause Analysis
[DETAILED TECHNICAL EXPLANATION - 2-3 paragraphs]

The underlying cause was [SPECIFIC TECHNICAL ISSUE]. This occurred because 
[CHAIN OF EVENTS]. Our existing monitoring detected the issue, but our 
automated failover did not trigger because [REASON].

## Resolution Steps
1. [ACTION TAKEN]
2. [ACTION TAKEN]
3. [ACTION TAKEN]

## What We're Doing to Prevent This
**Immediate Actions (Completed):**
- [ACTION 1]
- [ACTION 2]

**Short-Term Improvements (Next 30 Days):**
- [IMPROVEMENT 1] - Owner: [TEAM], ETA: [DATE]
- [IMPROVEMENT 2] - Owner: [TEAM], ETA: [DATE]

**Long-Term Infrastructure Changes (Next Quarter):**
- [STRATEGIC CHANGE 1]
- [STRATEGIC CHANGE 2]

## Lessons Learned
**What Went Well:**
- [POSITIVE ASPECT 1]
- [POSITIVE ASPECT 2]

**What We'll Improve:**
- [AREA FOR IMPROVEMENT 1]
- [AREA FOR IMPROVEMENT 2]

## Our Commitment
We take service reliability seriously. We're investing in [SPECIFIC IMPROVEMENTS] 
to ensure this type of incident doesn't happen again.

Questions? Reply to this email or contact support@company.com.

Full technical report: [INCIDENT HUB LINK]

Thank you for your continued trust.

- [EXECUTIVE NAME], [TITLE]
```

---

## Incident Hub Technical Specification

### Required Components

**1. Real-Time Status Ticker**
```html
<!-- Live-updating status bar -->
<div class="status-ticker">
  <span class="status-indicator status-down"></span>
  <strong>INVESTIGATING:</strong> Database connectivity issues affecting core features
  <span class="timestamp">Last updated: 2:47 PM EST</span>
</div>
```

**2. Component Status Dashboard**
- Visual traffic-light system (Green/Yellow/Red)
- Individual component cards with real-time status
- Auto-refresh every 30 seconds

**3. Live Update Stream**
- Chronological feed of engineering updates
- Timestamps for each update
- Ability to subscribe to notifications

**4. Workaround Documentation**
- Step-by-step alternative workflows
- API endpoint alternatives for developers
- Export functionality status

**5. Q&A Section**
- Moderated comment system
- Pre-populated FAQ
- Active response commitment (15-minute SLA)

**6. Subscription Options**
- Email notifications for major updates
- SMS alerts (opt-in)
- Webhook notifications for API customers

---

## Severity Classification Matrix

| Level | Name | Example | TTN* | VIP Contact | Hub Required |
|-------|------|---------|------|-------------|--------------|
| P0 | Critical | Complete platform down | 10 min | Phone + Email | Yes |
| P1 | High | Core feature unavailable | 15 min | Email | Yes |
| P2 | Medium | Degraded performance | 30 min | Email (Optional) | Recommended |
| P3 | Low | Minor feature issue | 60 min | No | Optional |
| P4 | Informational | Planned maintenance | 24 hours | No | No |

*TTN = Time to Notification (from detection)

---

## Communication Channel Matrix

| Channel | P0 | P1 | P2 | P3 | P4 |
|---------|----|----|----|----|-----|
| Email | ✅ All users | ✅ Affected users | ✅ Affected users | ⚠️ On request | ✅ Scheduled notice |
| In-App Banner | ✅ Persistent | ✅ Dismissible | ⚠️ Optional | ❌ | ✅ Advance notice |
| Status Page | ✅ | ✅ | ✅ | ✅ | ✅ |
| Social Media | ✅ | ✅ | ⚠️ If trending | ❌ | ⚠️ Optional |
| Phone (VIP) | ✅ Top 5 | ⚠️ Top 2 | ❌ | ❌ | ❌ |
| SMS | ⚠️ Opt-in only | ❌ | ❌ | ❌ | ❌ |
| Incident Hub | ✅ Required | ✅ Required | ✅ Recommended | ⚠️ Optional | ❌ |

---

## Success Metrics

### Response Time Targets
- **Detection to Assessment:** < 5 minutes
- **Assessment to First Notification:** < 10 minutes
- **Incident Hub Launch:** < 20 minutes
- **Update Frequency:** Every 30 minutes minimum

### Communication Quality Metrics
- **User Satisfaction Score:** Target > 7/10 (post-incident survey)
- **Support Ticket Deflection:** Target > 60% (via hub self-service)
- **VIP Satisfaction:** Target > 9/10
- **Message Clarity Score:** Target > 8/10 (readability analysis)

### Operational Efficiency
- **Staff Hours per Incident:** Baseline measurement for optimization
- **Template Utilization Rate:** Target > 90%
- **Hub Traffic vs. Support Tickets:** Ratio tracking

---

## Roles & Responsibilities

### Incident Commander
- Declares incident severity
- Authorizes initial notification
- Coordinates cross-functional response
- Approves all external communications

### Communications Lead
- Executes notification playbook
- Manages incident hub updates
- Monitors social media mentions
- Coordinates with customer success for VIP outreach

### Technical Lead
- Provides technical summaries for communications
- Reviews technical deep-dive content for accuracy
- Determines workaround feasibility
- Leads post-mortem analysis

### Account Managers (VIP Outreach)
- Execute phone script for assigned enterprise accounts
- Document customer-specific impact concerns
- Provide personalized updates every 30-60 minutes
- Conduct post-incident debrief calls

---

## Tools & Systems Required

**Communication Platforms:**
- Email service (SendGrid/AWS SES)
- Status page platform (Statuspage.io/custom)
- In-app notification system
- Social media management tool
- SMS gateway (Twilio)

**Incident Management:**
- Incident hub CMS (custom React app recommended)
- PagerDuty/Opsgenie for alerting
- Slack/Teams for internal coordination
- Zoom/Google Meet for war rooms

**Analytics & Monitoring:**
- Google Analytics (hub traffic)
- Sentiment analysis tool (social media)
- Survey platform (post-incident feedback)
- Ticket system integration (Zendesk/Intercom)

---

## Appendix: Decision Tree

```
[Incident Detected]
       |
       v
[Severity Assessment]
       |
       ├──[P0/P1]──> Execute Full Playbook (10 min notification + Hub + VIP)
       |
       ├──[P2]────> Execute Standard Playbook (30 min notification + Optional Hub)
       |
       └──[P3/P4]──> Simplified Communication (No VIP, No Hub)

[During Incident]
       |
       ├──[Severity Escalation]──> Upgrade playbook level + Retroactive VIP outreach
       |
       ├──[Workaround Found]────> Immediate all-channel push notification
       |
       └──[Resolution]──────────> Resolution template + Schedule post-mortem
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Dec 9, 2025 | Initial playbook creation | Incident Response Team |

---

**Next Review Date:** March 9, 2026  
**Feedback:** incident-feedback@company.com

# Team Management System - KashiBnB

## 🎯 Overview

The Team Management System allows main admins to promote users to team members who can help manage the platform. Team members have elevated access to promote users to hotel owners and manage listings.

## 🏗️ Architecture

### User Roles Hierarchy
```
Admin (Full Access)
├── Can promote/demote team members
├── Can manage all users
└── Can access all admin features

Team Member (Elevated Access)
├── Can promote users to hotel/restaurant owners
├── Can view and manage user listings
└── Cannot promote/demote other team members

Hotel Owner (Property Management)
├── Can manage their own hotels
└── Can view their bookings

Restaurant Owner (Restaurant Management)
├── Can manage their own restaurants
└── Can view their bookings

Regular User (Basic Access)
└── Can browse and book properties
```

## 🗄️ Database Schema

### Users Table Updates
```sql
-- New column added
ALTER TABLE "users" ADD COLUMN "is_team_member" BOOLEAN NOT NULL DEFAULT false;
```

### Updated User Model
```prisma
model users {
  id                   String     @id @default(uuid())
  email                String?    @unique
  name                 String
  // ... other fields
  is_admin             Boolean    @default(false)
  is_team_member       Boolean    @default(false)  // NEW FIELD
  has_hotel            Boolean    @default(false)
  has_restr            Boolean    @default(false)
  // ... other fields
}
```

## 🔌 API Endpoints

### Admin Endpoints (Admin Only)
```javascript
// Promote user to team member
PATCH /api/v1/admin/users/:userId/promote
Body: { role: 'team_member' }

// Demote team member to regular user
PATCH /api/v1/admin/users/:userId/demote
Body: { role: 'user' }

// View all users (includes team member status)
GET /api/v1/admin/users
```

### Team Member Endpoints (Team Member or Admin)
```javascript
// View users that team members can manage (excludes admins)
GET /api/v1/team/users

// Promote user to hotel owner
PATCH /api/v1/team/users/:userId/promote-hotel

// Promote user to restaurant owner
PATCH /api/v1/team/users/:userId/promote-restaurant
```

## 🎨 Frontend Components

### Admin Users Page (`AdminUsers.jsx`)
- **Promote/Demote Buttons**: Purple "+" and orange "-" buttons
- **Team Member Badge**: Purple badge with users icon
- **Filter Option**: "Team Members" filter in dropdown
- **Info Section**: Purple info box explaining team management

### Team Member Dashboard (`TeamMemberDashboard.jsx`)
- **Dedicated Route**: `/team/dashboard`
- **Hotel Owner Promotion**: Team members can promote users to hotel owners
- **User Management**: View and manage regular users
- **Professional UI**: Purple theme with team member branding

## 🔐 Security & Middleware

### Authentication Middleware
```javascript
// Check if user is team member or admin
const isTeamMember = async (req, res, next) => {
    const user = req.user;
    if (user.is_team_member === true || user.is_admin === true) {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "not team member or admin"
        });
    }
};
```

### Role-Based Access Control
- **Admins**: Can promote/demote team members, manage all users
- **Team Members**: Can promote users to hotel/restaurant owners, view user listings
- **Regular Users**: Basic access only

## 📧 Email Notifications

### Team Member Promotion Email
```javascript
// Automatic email sent when user is promoted to team member
await sendPromotionEmail(
    userEmail, 
    'team member', 
    userName
);
```

### Email Content Includes:
- Congratulations message
- List of new permissions
- Next steps for getting started
- Contact information for support

## 🚀 Setup Instructions

### 1. Database Migration
```bash
# Run the setup script
node backend/setup-team-management.js

# Or manually run the migration
node backend/scripts/migrate-team-member.js
```

### 2. Backend Setup
```bash
# Install dependencies (if needed)
npm install

# Regenerate Prisma client
npx prisma generate

# Start the server
npm start
```

### 3. Frontend Setup
The frontend components are already integrated:
- Admin users page updated with team management
- Team member dashboard created
- Routes added to App.jsx

## 🧪 Testing

### Test Scenarios
1. **Admin promotes user to team member**
   - Login as admin
   - Go to `/admin/users`
   - Click purple "+" button next to a user
   - Verify user receives team member badge
   - Check email notification sent

2. **Team member promotes user to hotel owner**
   - Login as team member
   - Go to `/team/dashboard`
   - Click blue "+" button next to a user
   - Verify user becomes hotel owner

3. **Admin demotes team member**
   - Login as admin
   - Go to `/admin/users`
   - Click orange "-" button next to team member
   - Verify team member becomes regular user

### API Testing
```bash
# Test admin endpoints
curl -X PATCH "http://localhost:3000/api/v1/admin/users/USER_ID/promote" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "team_member"}'

# Test team member endpoints
curl -X GET "http://localhost:3000/api/v1/team/users" \
  -H "Authorization: Bearer TEAM_MEMBER_TOKEN"
```

## 🎨 UI Features

### Color Coding
- 🔴 **Red**: Admin
- 🟣 **Purple**: Team Member
- 🔵 **Blue**: Hotel Owner
- 🟢 **Green**: Restaurant Owner
- ⚪ **Gray**: Regular User

### Interactive Elements
- **Hover Effects**: Buttons have hover states
- **Tooltips**: Action buttons have descriptive tooltips
- **Responsive Design**: Works on all screen sizes
- **Professional Layout**: Clean, modern interface

## 🔧 Configuration

### Environment Variables
```env
# Email configuration (already set up)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# JWT configuration (already set up)
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=30d
```

### Database Configuration
```env
# Database URL (already configured)
DATABASE_URL="postgresql://username:password@localhost:5432/kashibnb"
```

## 📊 Monitoring & Logging

### Console Logs
- User promotion/demotion actions
- Email sending status
- Database operations
- Error handling

### Error Handling
- Graceful error messages
- User-friendly feedback
- Detailed logging for debugging

## 🚨 Troubleshooting

### Common Issues

1. **"is_team_member column not found"**
   ```bash
   # Run the migration script
   node backend/setup-team-management.js
   ```

2. **"not team member or admin" error**
   - Check if user has `is_team_member: true` in database
   - Verify JWT token includes team member status
   - Check middleware configuration

3. **Email notifications not working**
   - Verify EMAIL_USER and EMAIL_PASS environment variables
   - Check Gmail app password configuration
   - Review email service logs

4. **Frontend not showing team member features**
   - Check if user object includes `is_team_member` field
   - Verify route protection logic
   - Check browser console for errors

## 📈 Future Enhancements

### Potential Features
- **Team Member Permissions**: Granular permission system
- **Audit Logs**: Track all role changes
- **Bulk Operations**: Promote/demote multiple users
- **Team Member Analytics**: Dashboard with statistics
- **Role Expiration**: Temporary team member access
- **Approval Workflow**: Request-based promotions

## 📞 Support

For issues or questions:
- 📧 Email: support@kashibnb.com
- 📱 Phone: +91-XXXXXXXXXX
- 💬 Live Chat: Available on website

---

**🎉 Team Management System is now fully operational!**

The system provides a scalable way to manage platform operations with trusted team members while maintaining security and proper access controls.

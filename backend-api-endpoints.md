# Backend API Endpoints for Team Management

## Required API Endpoints

### 1. Admin User Management
```
GET /api/v1/admin/users
- Get all users with their roles
- Response should include: is_admin, is_team_member, has_hotel, has_restr

PATCH /api/v1/admin/users/:userId/promote
- Promote user to team member
- Body: { role: 'team_member' }
- Response: Updated user object

PATCH /api/v1/admin/users/:userId/demote
- Demote team member to regular user
- Body: { role: 'user' }
- Response: Updated user object
```

### 2. Team Member Management
```
GET /api/v1/team/users
- Get users that team members can manage (exclude admins)
- Response should include: has_hotel, has_restr

PATCH /api/v1/team/users/:userId/promote-hotel
- Promote user to hotel owner
- Body: {}
- Response: Updated user object

PATCH /api/v1/team/users/:userId/promote-restaurant
- Promote user to restaurant owner
- Body: {}
- Response: Updated user object
```

### 3. Database Schema Updates

#### Users Table
Add new column:
```sql
ALTER TABLE users ADD COLUMN is_team_member BOOLEAN DEFAULT FALSE;
```

#### Role Permissions
- **Admin**: Can promote/demote team members, manage all users
- **Team Member**: Can promote users to hotel/restaurant owners, view user listings
- **Hotel Owner**: Can manage their own hotels
- **Restaurant Owner**: Can manage their own restaurants
- **Regular User**: Basic access only

### 4. Middleware Updates

#### Authentication Middleware
```javascript
// Check if user is team member
const isTeamMember = (req, res, next) => {
  if (req.user.is_team_member || req.user.is_admin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Team member access required.' });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.is_admin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin access required.' });
  }
};
```

### 5. Frontend Route Protection

#### Admin Routes
```javascript
// Protect admin routes
if (!user?.is_admin) {
  nav('/');
  return;
}
```

#### Team Member Routes
```javascript
// Protect team member routes
if (!user?.is_team_member && !user?.is_admin) {
  nav('/');
  return;
}
```

### 6. Navigation Updates

Add team member navigation in Navbar:
```javascript
// Show team member dashboard link
{user?.is_team_member && (
  <Link to="/team/dashboard" className="nav-link">
    Team Dashboard
  </Link>
)}
```

## Implementation Notes

1. **Security**: Ensure only admins can promote/demote team members
2. **Validation**: Validate user roles before allowing actions
3. **Logging**: Log all role changes for audit purposes
4. **Notifications**: Send email notifications when roles change
5. **UI Feedback**: Show success/error messages for all actions

## Testing

1. Test admin can promote users to team members
2. Test admin can demote team members to users
3. Test team members can promote users to hotel owners
4. Test role-based access control
5. Test UI updates reflect role changes immediately

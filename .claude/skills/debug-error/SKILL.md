# Debug Error

## Purpose
Quickly diagnose and fix errors in the Facebook Clone project.

## When to Use
- Getting error messages
- Features not working as expected
- API calls failing
- Database queries returning wrong results

## Steps

### 1. Identify Error Type

**Frontend Error?**
- Check browser console (F12)
- Check Network tab for API responses
- Look for React errors in terminal

**Backend Error?**
- Check terminal where `npm run dev` is running
- Look for error stack trace
- Check Prisma query logs

**Database Error?**
- Check MySQL connection
- Verify schema matches code
- Check Prisma error codes

### 2. Common Errors & Solutions

#### Frontend Errors

**"Cannot read property of undefined"**
```javascript
// Problem: Data not loaded yet
const name = user.name; // user is null

// Solution: Optional chaining
const name = user?.name;

// Or check loading state
if (loading) return <CircularProgress />;
if (!user) return null;
```

**"useEffect missing dependency"**
```javascript
// Problem
useEffect(() => {
  fetchData(id);
}, []); // missing 'id'

// Solution
useEffect(() => {
  fetchData(id);
}, [id]);
```

**CORS Error**
```javascript
// Problem: Backend not allowing frontend origin

// Solution: Add to server/index.js
const cors = require('cors');
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

#### Backend Errors

**"PrismaClientKnownRequestError"**
```javascript
// P2002: Unique constraint failed
if (error.code === 'P2002') {
  return res.status(400).json({
    success: false,
    error: `${error.meta.target} already exists`
  });
}

// P2025: Record not found
if (error.code === 'P2025') {
  return res.status(404).json({
    success: false,
    error: 'Record not found'
  });
}
```

**"jwt malformed"**
```javascript
// Problem: Invalid token format

// Solution: Check token is being sent correctly
const token = req.headers.authorization?.split(' ')[1];
if (!token) {
  return res.status(401).json({ error: 'No token' });
}
```

**"Unknown arg `field`"**
```javascript
// Problem: Prisma schema doesn't match code

// Solution: Run migration
npx prisma migrate dev
npx prisma generate
```

#### Database Errors

**"Can't connect to MySQL"**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check .env file
DATABASE_URL="mysql://user:password@localhost:3306/facebook_clone"
```

### 3. Debugging Checklist

**Frontend:**
- [ ] Check browser console
- [ ] Check Network tab (status code, response body)
- [ ] Verify API endpoint URL
- [ ] Check if token is being sent (Authorization header)
- [ ] Verify component state

**Backend:**
- [ ] Check terminal output
- [ ] Verify request body/params
- [ ] Check middleware order
- [ ] Verify database connection
- [ ] Check Prisma query logs

**Database:**
- [ ] MySQL server running?
- [ ] Correct credentials in .env?
- [ ] Schema migrated?
- [ ] Data exists in database?

### 4. Useful Debug Commands

```bash
# Check Prisma schema
npx prisma validate

# View database
npx prisma studio

# Reset database
npx prisma migrate reset

# Check MySQL tables
mysql -u root -p
USE facebook_clone;
SHOW TABLES;
```

## Output
- Identified error cause
- Fixed code
- Explanation of what went wrong

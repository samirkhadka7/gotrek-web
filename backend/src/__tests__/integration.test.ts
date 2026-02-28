import request from 'supertest';
import mongoose from 'mongoose';
import app from './app';
import User from '../models/user.model';
import Trail from '../models/trail.model';
import jwt from 'jsonwebtoken';

// Helper to create a user and return token
const createUserAndToken = async (overrides: Record<string, unknown> = {}) => {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    phone: '1234567890',
    ...overrides,
  };
  const user = await User.create(userData);
  const token = jwt.sign(
    { _id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.SECRET!,
    { expiresIn: '7d' }
  );
  return { user, token };
};

const createAdminAndToken = async () => {
  return createUserAndToken({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  });
};

const createTrail = async (overrides: Record<string, unknown> = {}) => {
  return Trail.create({
    name: 'Everest Base Camp',
    location: 'Nepal',
    distance: 130,
    elevation: 5364,
    difficulty: 'Hard',
    description: 'Famous trek to Everest Base Camp',
    ...overrides,
  });
};

// =============================================
// AUTH: Registration Tests
// =============================================
describe('POST /api/auth/register', () => {
  it('1. should register a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '9876543210',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User registered successfully');
    expect(res.body.data.email).toBe('john@example.com');
    expect(res.body.data).not.toHaveProperty('password');
  });

  it('2. should not register a user with duplicate email', async () => {
    await User.create({
      name: 'Existing',
      email: 'dup@example.com',
      password: 'password123',
      phone: '1111111111',
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'New User',
      email: 'dup@example.com',
      password: 'password123',
      phone: '2222222222',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('already exists');
  });

  it('3. should fail registration with missing required fields', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'No Email',
    });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

// =============================================
// AUTH: Login Tests
// =============================================
describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await User.create({
      name: 'Login User',
      email: 'login@example.com',
      password: 'password123',
      phone: '1234567890',
    });
  });

  it('4. should login with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.data.email).toBe('login@example.com');
  });

  it('5. should reject login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('6. should reject login with non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'noone@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('7. should reject login with missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('provide both');
  });
});

// =============================================
// AUTH: Change Password Tests
// =============================================
describe('POST /api/auth/change-password', () => {
  it('8. should change password with valid current password', async () => {
    const { token } = await createUserAndToken();

    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'password123',
        newPassword: 'newpassword123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Password changed successfully');
  });

  it('9. should reject change password with wrong current password', async () => {
    const { token } = await createUserAndToken();

    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('10. should reject change password with short new password', async () => {
    const { token } = await createUserAndToken();

    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'password123',
        newPassword: 'short',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('at least 8');
  });

  it('11. should reject change password without authentication', async () => {
    const res = await request(app).post('/api/auth/change-password').send({
      currentPassword: 'password123',
      newPassword: 'newpassword123',
    });

    expect(res.status).toBe(401);
  });
});

// =============================================
// AUTH: Forgot & Reset Password Tests
// =============================================
describe('POST /api/auth/forgot-password', () => {
  it('12. should return success even for non-existent email (security)', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({
      email: 'nonexistent@example.com',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('13. should reject forgot password without email', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('provide your email');
  });
});

describe('POST /api/auth/reset-password', () => {
  it('14. should reject reset with missing fields', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({
      email: 'test@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('provide email, OTP');
  });

  it('15. should reject reset with short password', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({
      email: 'test@example.com',
      otp: '123456',
      newPassword: 'short',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('at least 8');
  });

  it('16. should reject reset with invalid OTP', async () => {
    await createUserAndToken();

    const res = await request(app).post('/api/auth/reset-password').send({
      email: 'test@example.com',
      otp: '000000',
      newPassword: 'newpassword123',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid or expired OTP');
  });
});

// =============================================
// TRAILS: Public & Admin Tests
// =============================================
describe('GET /api/trail', () => {
  it('17. should fetch all trails (public)', async () => {
    await createTrail();
    await createTrail({ name: 'Annapurna Circuit', distance: 160, elevation: 5416 });

    const res = await request(app).get('/api/trail');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.total).toBe(2);
  });

  it('18. should paginate trail results', async () => {
    for (let i = 0; i < 5; i++) {
      await createTrail({ name: `Trail ${i}`, distance: 10 + i, elevation: 100 + i });
    }

    const res = await request(app).get('/api/trail?page=1&limit=2');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination.totalPages).toBe(3);
  });

  it('19. should search trails by name', async () => {
    await createTrail({ name: 'Langtang Valley' });
    await createTrail({ name: 'Annapurna Base Camp', distance: 110, elevation: 4130 });

    const res = await request(app).get('/api/trail?search=Langtang');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Langtang Valley');
  });
});

describe('GET /api/trail/:id', () => {
  it('20. should fetch a single trail by ID', async () => {
    const { token } = await createUserAndToken();
    const trail = await createTrail();

    const res = await request(app)
      .get(`/api/trail/${trail._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Everest Base Camp');
  });

  it('21. should return 404 for non-existent trail', async () => {
    const { token } = await createUserAndToken();
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/trail/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('DELETE /api/trail/:id (Admin)', () => {
  it('22. should allow admin to delete a trail', async () => {
    const { token } = await createAdminAndToken();
    const trail = await createTrail();

    const res = await request(app)
      .delete(`/api/trail/${trail._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('deleted');
  });

  it('23. should reject non-admin trail deletion', async () => {
    const { token } = await createUserAndToken();
    const trail = await createTrail();

    const res = await request(app)
      .delete(`/api/trail/${trail._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});

// =============================================
// USER: Profile & Admin Management Tests
// =============================================
describe('GET /api/user/me', () => {
  it('24. should return the authenticated user profile', async () => {
    const { token } = await createUserAndToken();

    const res = await request(app)
      .get('/api/user/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Test User');
  });

  it('25. should reject unauthenticated profile access', async () => {
    const res = await request(app).get('/api/user/me');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('PUT /api/user/me', () => {
  it('26. should update user profile', async () => {
    const { token } = await createUserAndToken();

    const res = await request(app)
      .put('/api/user/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Name',
        bio: 'I love hiking!',
        hikerType: 'experienced',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Updated Name');
    expect(res.body.data.bio).toBe('I love hiking!');
  });
});

describe('DELETE /api/user/me', () => {
  it('27. should deactivate user account', async () => {
    const { user, token } = await createUserAndToken();

    const res = await request(app)
      .delete('/api/user/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('deactivated');

    const updatedUser = await User.findById(user._id).select('+active');
    expect(updatedUser!.active).toBe(false);
  });
});

describe('Admin: GET /api/user', () => {
  it('28. should allow admin to list all users', async () => {
    const { token } = await createAdminAndToken();
    await createUserAndToken({ email: 'user1@test.com' });
    await createUserAndToken({ email: 'user2@test.com' });

    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(3); // admin + 2 users
    expect(res.body.pagination).toBeDefined();
  });

  it('29. should reject non-admin listing users', async () => {
    const { token } = await createUserAndToken();

    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe('Admin: GET /api/user/:id', () => {
  it('30. should allow admin to get a user by ID', async () => {
    const { token } = await createAdminAndToken();
    const { user: targetUser } = await createUserAndToken({ email: 'target@test.com' });

    const res = await request(app)
      .get(`/api/user/${targetUser._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('target@test.com');
  });

  it('31. should return 404 for non-existent user', async () => {
    const { token } = await createAdminAndToken();
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/api/user/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe('Admin: DELETE /api/user/:id', () => {
  it('32. should allow admin to delete a user', async () => {
    const { token } = await createAdminAndToken();
    const { user: targetUser } = await createUserAndToken({ email: 'delete@test.com' });

    const res = await request(app)
      .delete(`/api/user/${targetUser._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const deleted = await User.findById(targetUser._id);
    expect(deleted).toBeNull();
  });
});

describe('Admin: PUT /api/user/role/:userToUpdateId', () => {
  it('33. should allow admin to update user role', async () => {
    const { token } = await createAdminAndToken();
    const { user: targetUser } = await createUserAndToken({ email: 'rolechange@test.com' });

    const res = await request(app)
      .put(`/api/user/role/${targetUser._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ newRoles: 'guide' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe('guide');
  });

  it('34. should reject invalid role values', async () => {
    const { token } = await createAdminAndToken();
    const { user: targetUser } = await createUserAndToken({ email: 'badrole@test.com' });

    const res = await request(app)
      .put(`/api/user/role/${targetUser._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ newRoles: 'superadmin' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

// =============================================
// TRAIL: Join & Complete Tests
// =============================================
describe('POST /api/trail/:id/join-with-date', () => {
  it('35. should allow authenticated user to join a trail', async () => {
    const { token } = await createUserAndToken();
    const trail = await createTrail();

    const res = await request(app)
      .post(`/api/trail/${trail._id}/join-with-date`)
      .set('Authorization', `Bearer ${token}`)
      .send({ scheduledDate: '2026-06-15' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('scheduled');
  });

  it('36. should reject joining the same trail twice', async () => {
    const { token, user } = await createUserAndToken();
    const trail = await createTrail();

    // Join once
    await request(app)
      .post(`/api/trail/${trail._id}/join-with-date`)
      .set('Authorization', `Bearer ${token}`)
      .send({ scheduledDate: '2026-06-15' });

    // Try joining again
    const res = await request(app)
      .post(`/api/trail/${trail._id}/join-with-date`)
      .set('Authorization', `Bearer ${token}`)
      .send({ scheduledDate: '2026-07-15' });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('already scheduled');
  });

  it('37. should reject joining without scheduledDate', async () => {
    const { token } = await createUserAndToken();
    const trail = await createTrail();

    const res = await request(app)
      .post(`/api/trail/${trail._id}/join-with-date`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('scheduled date');
  });
});

// =============================================
// AUTH: Token Verification Tests
// =============================================
describe('Authentication middleware', () => {
  it('38. should reject requests with invalid token', async () => {
    const res = await request(app)
      .get('/api/user/me')
      .set('Authorization', 'Bearer invalid-token-here');

    expect(res.status).toBe(401);
    expect(res.body.message).toContain('token failed');
  });

  it('39. should reject requests with expired token', async () => {
    const { user } = await createUserAndToken();
    const expiredToken = jwt.sign(
      { _id: user._id },
      process.env.SECRET!,
      { expiresIn: '0s' }
    );

    const res = await request(app)
      .get('/api/user/me')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
  });
});

// =============================================
// Admin: Update User by Admin
// =============================================
describe('Admin: PUT /api/user/:id', () => {
  it('40. should allow admin to update a user', async () => {
    const { token } = await createAdminAndToken();
    const { user: targetUser } = await createUserAndToken({ email: 'adminupdate@test.com' });

    const res = await request(app)
      .put(`/api/user/${targetUser._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Admin Updated Name',
        hikerType: 'experienced',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Admin Updated Name');
  });
});

// =============================================
// Edge Cases & Search
// =============================================
describe('Admin: User search', () => {
  it('41. should search users by name', async () => {
    const { token } = await createAdminAndToken();
    await createUserAndToken({ name: 'Alice Hiker', email: 'alice@test.com' });
    await createUserAndToken({ name: 'Bob Walker', email: 'bob@test.com' });

    const res = await request(app)
      .get('/api/user?search=Alice')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Alice Hiker');
  });
});

describe('Trail filter by difficulty', () => {
  it('42. should filter trails by search query', async () => {
    await createTrail({ name: 'Easy Walk', difficulty: 'Easy', distance: 5, elevation: 100 });
    await createTrail({ name: 'Hard Climb', difficulty: 'Hard', distance: 50, elevation: 3000 });

    const res = await request(app).get('/api/trail?search=Easy');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Easy Walk');
  });
});

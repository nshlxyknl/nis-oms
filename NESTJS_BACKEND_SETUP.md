# 🚀 NestJS Backend Setup for Session-Based Authentication

This guide helps you set up a NestJS backend that works with your Next.js frontend. The frontend has been cleaned up to remove all Prisma dependencies - all database operations should be handled by your NestJS backend.

## Frontend Changes Made

✅ **Removed from Frontend:**
- All Prisma dependencies (`@prisma/client`, `@prisma/adapter-pg`, `prisma`)
- Database connection strings and Prisma configuration
- `src/lib/prisma.ts` file
- `prisma/` folder and schema files
- Email fields from all interfaces and components

✅ **Frontend Now Uses:**
- TanStack Query for API calls to your NestJS backend
- Session-based authentication (no JWT in localStorage)
- HTTP-only cookies for session management
- API calls to `http://localhost:3003` (your NestJS backend)

## 1. Install Required Packages in Your NestJS Backend

```bash
npm install express-session @types/express-session
npm install bcryptjs @types/bcryptjs
npm install @prisma/client prisma
```

## 2. Configure Session in main.ts

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for your frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // Important: allows cookies
  });

  // Configure sessions
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true, // Prevents XSS
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax',
      },
    }),
  );

  await app.listen(3003);
}
bootstrap();
```

## 3. Create Prisma Service

```typescript
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

```typescript
// src/prisma/prisma.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

## 4. Auth Service

```typescript
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    name: string;
  }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    const { password, ...result } = user;
    return result;
  }
}
```

## 5. Auth Controller

```typescript
// src/auth/auth.controller.ts
import { Controller, Post, Body, Req, Get, HttpCode, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: { username: string; password: string },
    @Req() req: Request,
  ) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Store user in session
    req.session['user'] = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase(),
    };

    return { message: 'Login successful', user: req.session['user'] };
  }

  @Post('register')
  async register(@Body() registerDto: {
    username: string;
    email: string;
    password: string;
    name: string;
  }) {
    return this.authService.register(registerDto);
  }

  @Get('me')
  getProfile(@Req() req: Request) {
    if (!req.session['user']) {
      throw new UnauthorizedException('Not authenticated');
    }
    return req.session['user'];
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Req() req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(new Error('Could not log out'));
        } else {
          resolve({ message: 'Logged out successfully' });
        }
      });
    });
  }
}
```

## 6. Session Guard

```typescript
// src/auth/session.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    if (!request.session || !request.session.user) {
      throw new UnauthorizedException('Not authenticated');
    }
    
    return true;
  }
}
```

## 7. Auth Module

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

## 8. Protected Controllers Example

```typescript
// src/employees/employees.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/session.guard';
import { EmployeesService } from './employees.service';

@Controller('employees')
@UseGuards(SessionGuard)
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }
}
```

## 9. App Module

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeesModule } from './employees/employees.module';
// ... other modules

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EmployeesModule,
    // ... other modules
  ],
})
export class AppModule {}
```

## 10. Environment Variables

Create `.env` file in your NestJS project:

```env
DATABASE_URL="your-postgres-connection-string"
SESSION_SECRET="your-session-secret-key"
NODE_ENV="development"
```

## 11. Start Your Backend

```bash
npm run start:dev
```

Your NestJS backend will now be running on `http://localhost:3003` with session-based authentication!

## API Endpoints

- `POST /auth/login` - Login with username/password
- `POST /auth/register` - Register new user
- `GET /auth/me` - Get current user profile
- `POST /auth/logout` - Logout user
- All other endpoints require authentication via session

## Testing the Integration

1. Start your NestJS backend: `npm run start:dev`
2. Start your Next.js frontend: `npm run dev`
3. Navigate to `http://localhost:3000`
4. Try registering and logging in
5. Verify dashboard loads with user data

The session-based approach is much simpler and more secure than JWT tokens stored in localStorage!
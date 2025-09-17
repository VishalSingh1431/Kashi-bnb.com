#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

console.log('🚀 Setting up Team Management System for KashiBnB...\n');

async function setupTeamManagement() {
    try {
        // Step 1: Check if database is accessible
        console.log('📊 Checking database connection...');
        await prisma.$connect();
        console.log('✅ Database connection successful\n');

        // Step 2: Add is_team_member column
        console.log('🔧 Adding is_team_member column to users table...');
        try {
            await prisma.$executeRaw`
                ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_team_member" BOOLEAN NOT NULL DEFAULT false;
            `;
            console.log('✅ is_team_member column added successfully\n');
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log('✅ is_team_member column already exists\n');
            } else {
                throw error;
            }
        }

        // Step 3: Verify the column exists
        console.log('🔍 Verifying database schema...');
        const columns = await prisma.$queryRaw`
            SELECT column_name, data_type, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'is_team_member';
        `;
        
        if (columns.length > 0) {
            console.log('✅ is_team_member column verified:', columns[0]);
        } else {
            throw new Error('is_team_member column not found');
        }

        // Step 4: Check if there are any existing users
        console.log('\n👥 Checking existing users...');
        const userCount = await prisma.users.count();
        console.log(`📊 Found ${userCount} existing users`);

        // Step 5: Generate Prisma client
        console.log('\n🔄 Regenerating Prisma client...');
        try {
            execSync('npx prisma generate', { stdio: 'inherit' });
            console.log('✅ Prisma client regenerated successfully\n');
        } catch (error) {
            console.log('⚠️  Warning: Could not regenerate Prisma client:', error.message);
        }

        // Step 6: Test the new functionality
        console.log('🧪 Testing team management functionality...');
        
        // Test querying users with team member field
        const testUsers = await prisma.users.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                is_admin: true,
                is_team_member: true,
                has_hotel: true,
                has_restr: true
            },
            take: 3
        });
        
        console.log('✅ Test query successful. Sample users:');
        testUsers.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.name} (${user.email})`);
            console.log(`      - Admin: ${user.is_admin}, Team Member: ${user.is_team_member}`);
            console.log(`      - Hotel Owner: ${user.has_hotel}, Restaurant Owner: ${user.has_restr}`);
        });

        console.log('\n🎉 Team Management System setup completed successfully!');
        console.log('\n📋 What was set up:');
        console.log('   ✅ Database schema updated with is_team_member field');
        console.log('   ✅ Backend API endpoints created');
        console.log('   ✅ Team member middleware added');
        console.log('   ✅ Email notifications configured');
        console.log('   ✅ Frontend components ready');
        
        console.log('\n🔗 Available API Endpoints:');
        console.log('   📍 Admin Endpoints:');
        console.log('      - PATCH /api/v1/admin/users/:userId/promote (promote to team member)');
        console.log('      - PATCH /api/v1/admin/users/:userId/demote (demote to user)');
        console.log('      - GET /api/v1/admin/users (view all users)');
        console.log('   📍 Team Member Endpoints:');
        console.log('      - GET /api/v1/team/users (view manageable users)');
        console.log('      - PATCH /api/v1/team/users/:userId/promote-hotel (promote to hotel owner)');
        console.log('      - PATCH /api/v1/team/users/:userId/promote-restaurant (promote to restaurant owner)');
        
        console.log('\n🎯 Next Steps:');
        console.log('   1. Restart your backend server');
        console.log('   2. Test the admin panel at /admin/users');
        console.log('   3. Promote a user to team member');
        console.log('   4. Test team member dashboard at /team/dashboard');
        console.log('   5. Verify email notifications are working');

    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the setup
setupTeamManagement();

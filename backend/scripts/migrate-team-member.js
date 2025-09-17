import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addTeamMemberColumn() {
    try {
        console.log('Adding is_team_member column to users table...');
        
        // Add the column using raw SQL
        await prisma.$executeRaw`
            ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_team_member" BOOLEAN NOT NULL DEFAULT false;
        `;
        
        console.log('✅ Successfully added is_team_member column to users table');
        
        // Verify the column was added
        const result = await prisma.$queryRaw`
            SELECT column_name, data_type, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'is_team_member';
        `;
        
        console.log('✅ Column verification:', result);
        
    } catch (error) {
        console.error('❌ Error adding is_team_member column:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the migration
addTeamMemberColumn()
    .then(() => {
        console.log('🎉 Migration completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Migration failed:', error);
        process.exit(1);
    });

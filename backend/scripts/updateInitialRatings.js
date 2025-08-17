import { prisma } from '../utils/client.js';

async function updateInitialRatings() {
    try {
        console.log('Starting to update initial ratings for existing hotels...');
        
        // First, let's check what fields are available
        const sampleHotel = await prisma.hotels.findFirst();
        console.log('Sample hotel fields:', Object.keys(sampleHotel || {}));
        
        // Try to get all hotels first
        const hotels = await prisma.hotels.findMany();
        console.log(`Found ${hotels.length} total hotels`);
        
        // Update each hotel with initial 5-star rating
        for (const hotel of hotels) {
            try {
                // Try to update with new fields, fallback to basic update if needed
                await prisma.hotels.update({
                    where: { id: hotel.id },
                    data: {
                        // Try to set these fields if they exist
                        ...(hotel.hasOwnProperty('averageRating') && { averageRating: 5.0 }),
                        ...(hotel.hasOwnProperty('totalRatings') && { totalRatings: 1 })
                    }
                });
                console.log(`Updated hotel: ${hotel.name} (${hotel.id})`);
            } catch (updateError) {
                console.log(`Could not update hotel ${hotel.name}: ${updateError.message}`);
            }
        }
        
        console.log('Finished updating hotels!');
        
    } catch (error) {
        console.error('Error updating initial ratings:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
updateInitialRatings();

// backend/src/workers/postingWorker.js

const cron = require('node-cron');
const ScheduledPost = require('../models/ScheduledPost'); // Your Post Model
const { postToTwitter, postToLinkedIn, postToInstagram } = require('../services/socialMedia');

// The main function that runs every minute
const startPostingWorker = () => {
    // Schedule a job to run every minute (This runs constantly in the background)
    cron.schedule('* * * * *', async() => {
        console.log('Running posting worker check...');

        // Find all posts that should have been published by now (scheduled time is past or current)
        const postsToPublish = await ScheduledPost.find({
            status: 'Scheduled',
            scheduledDateTime: { $lte: new Date() }
        });

        // Use Promise.allSettled to process posts in parallel, but wait for all to finish
        const results = await Promise.allSettled(postsToPublish.map(async(post) => {
            let platformsPosted = [];
            let platformsFailed = [];

            // Loop through selected platforms and attempt to post
            for (const platform of post.platforms) {
                try {
                    switch (platform) {
                        case 'twitter':
                            await postToTwitter(post);
                            platformsPosted.push(platform);
                            break;
                        case 'linkedin':
                            await postToLinkedIn(post);
                            platformsPosted.push(platform);
                            break;
                        case 'instagram':
                            await postToInstagram(post);
                            platformsPosted.push(platform);
                            break;
                    }
                } catch (error) {
                    console.error(`Post ${post._id} failed on ${platform}:`, error.message);
                    platformsFailed.push(platform);
                    // Continue to next platform even if one fails
                }
            }

            // Update the post status based on the attempt
            if (platformsFailed.length === post.platforms.length) {
                post.status = 'Failed'; // All platforms failed
            } else if (platformsFailed.length > 0) {
                // If some failed but others succeeded, you might use 'Partially Published' (optional)
                post.status = 'Published';
            } else {
                post.status = 'Published';
            }

            await post.save();
        }));

        // Log overall results
        console.log(`Worker completed cycle. Total posts processed: ${results.length}`);
    });
};

module.exports = startPostingWorker;
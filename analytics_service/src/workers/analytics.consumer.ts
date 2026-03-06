import redisClient from '../configs/redis.config';
import { prisma } from '../configs/database.config';
import { commandOptions } from 'redis';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

const STREAM_KEY = 'url_clicks_stream';
const CONSUMER_GROUP = 'analytics_group';
const CONSUMER_NAME = 'analytics_consumer_1';

export class AnalyticsConsumer {
    public static async initConsumerGroup() {
        try {
            // Create the consumer group, start reading from the beginning ('0') or from now ('$')
            // MKSTREAM will create the stream if it doesn't exist
            await redisClient.xGroupCreate(STREAM_KEY, CONSUMER_GROUP, '0', {
                MKSTREAM: true
            });
            console.log(`Consumer group ${CONSUMER_GROUP} created.`);
        } catch (err: any) {
            if (!err.message.includes('BUSYGROUP')) {
                console.error('Error creating consumer group:', err);
            }
        }
    }

    public static async startConsuming() {
        await this.initConsumerGroup();
        console.log('Started listening for analytics events...');

        while (true) {
            try {
                // XREADGROUP block for 5 seconds waiting for new messages ('>')
                const response = await redisClient.xReadGroup(
                    commandOptions({
                        isolated: true
                    }),
                    CONSUMER_GROUP,
                    CONSUMER_NAME,
                    [{ key: STREAM_KEY, id: '>' }],
                    {
                        COUNT: 10,
                        BLOCK: 5000
                    }
                );

                if (response && response.length > 0) {
                    const streamData = response[0];
                    for (const message of streamData.messages) {
                        await this.processMessage(message);
                    }
                }
            } catch (error) {
                console.error('Error reading from redis stream:', error);
                // Add a small delay so we don't spam errors in a tight loop
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    private static async processMessage(message: any) {
        const { id, message: data } = message;

        try {
            console.log(`Processing event ${id} for shortCode: ${data.shortCode}`);

            let country = null;
            let city = null;
            if (data.ipAddress) {
                const geo = geoip.lookup(data.ipAddress);
                if (geo) {
                    country = geo.country;
                    city = geo.city;
                }
            }

            let browser = null;
            let os = null;
            let device = null;
            if (data.userAgent) {
                const parser = new UAParser(data.userAgent);
                const parsedResults = parser.getResult();
                browser = parsedResults.browser.name || null;
                os = parsedResults.os.name || null;
                device = parsedResults.device.type || 'desktop'; // default to desktop if unknown
            }

            await prisma.clickEvent.create({
                data: {
                    shortCode: data.shortCode,
                    ipAddress: data.ipAddress || null,
                    userAgent: data.userAgent || null,
                    referer: data.referer || null,
                    country,
                    city,
                    browser,
                    os,
                    device
                }
            });

            // Acknowledge the message so it's removed from the pending list
            await redisClient.xAck(STREAM_KEY, CONSUMER_GROUP, id);
            console.log(`Successfully processed and acknowledged event ${id}`);

        } catch (error) {
            console.error(`Failed to process message ${id}:`, error);
            // We don't acknowledge. It stays in pending list to be retried
        }
    }
}

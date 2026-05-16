import { envVars } from "../config/env";
import { Redis } from "@upstash/redis";

class RedisService {
    private client: Redis | null = null;
    private isConnected: boolean = false;

    async connect(): Promise<void> {
        try {
            this.client = new Redis({
                url: envVars.UPSTASH_REDIS_REST_URL,
                token: envVars.UPSTASH_REDIS_REST_TOKEN,
            });

            // Upstash does not support events, so we simulate it
            this.isConnected = true;
            console.log("Redis Client Ready (Upstash)");

        } catch (error) {
            console.log({ error }, "Error connecting to Redis");
            this.isConnected = false;
        }
    }

    private ensureConnection(): Redis {
        if (!this.client) {
            throw new Error("Redis client not initialized. call connect() first.");
        }
        if (!this.isConnected) {
            throw new Error("Redis client not connected");
        }
        return this.client;
    }

    async get(key: string): Promise<any> {
        try {
            const client = this.ensureConnection();
            return await client.get(key);
        } catch (error) {
            console.error({ error }, "Redis get error");
            return null;
        }
    }

    async set(key: string, value: any, ttlInSecond: number): Promise<void> {
        try {
            const client = this.ensureConnection();

            const stringValue =
                typeof value === "string"
                    ? value
                    : JSON.stringify(value);

            await client.set(key, stringValue, {
                ex: ttlInSecond,
            });
        } catch (err) {
            console.error({ error: err }, "Redis set error");
        }
    }

    async update(
        key: string,
        value: any,
        ttlInSeconds: number
    ): Promise<void> {
        await this.set(key, value, ttlInSeconds);
    }

    async delete(key: string): Promise<void> {
        try {
            const client = this.ensureConnection();
            await client.del(key);
        } catch (error) {
            console.error({ error }, "Redis delete error");
        }
    }

    async isAvailable(): Promise<boolean> {
        try {
            const client = this.ensureConnection();
            const res = await client.ping();
            return res === "PONG";
        } catch (error) {
            console.error({ error }, "Redis ping error");
            return false;
        }
    }

    async disconnect(): Promise<void> {
        // Upstash does not require manual disconnect
        this.client = null;
        this.isConnected = false;
        console.info("Redis Client Disconnected (virtual)");
    }
}

export const redisService = new RedisService();
import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()
export async function connectRedis() {
  const redisClient = createClient({
    url: process.env.REDIS_URL as string
  })

  redisClient.on('error', (error) => {
    console.error('Error connecting to Redis:', error)
  })

  await redisClient.connect()
  console.log('Redis connected')
  return redisClient
}

export const redisClient = connectRedis()

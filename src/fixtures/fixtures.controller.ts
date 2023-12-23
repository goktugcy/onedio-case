import { RequestHandler } from 'express'
import { FixtureModel } from './model'
import { redisClient } from '../database/redis'

interface IFixture {
  getFixtures: RequestHandler
}

class Fixture implements IFixture {
  getFixtures: RequestHandler = async (req, res) => {
    const league = req.query.league as string
    const season = req.query.season as string
    const limit = parseInt(req.query.limit as string) || 10
    const page = parseInt(req.query.page as string) || 1

    const cacheKey = `fixtures:${league}:${season}:${page}:${limit}`

    try {
      const cachedData = await (await redisClient).get(cacheKey)
      if (cachedData) {
        return res.json({ source: 'redis-cache', data: JSON.parse(cachedData) })
      } else {
        const fixtures = await FixtureModel.find({ league, season })
          .skip((page - 1) * limit)
          .limit(limit)

        if (!fixtures || fixtures.length === 0) {
          return res.status(404).json({ message: 'No fixtures found for the specified criteria' })
        }

        await (await redisClient).setEx(cacheKey, 3600, JSON.stringify(fixtures))
        return res.json({ source: 'mongodb', data: fixtures })
      }
    } catch (error) {
      console.error('Server Error:', error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}

export const fixture = new Fixture()

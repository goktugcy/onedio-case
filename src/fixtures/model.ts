import mongoose, { Document } from 'mongoose'
import { fixtureSchema } from './schema'
import { redisClient } from '../database/redis'

export interface IFixture extends Document {
  date: string
  homeTeam: string
  awayTeam: string
  homeGoals: number
  awayGoals: number
  Referee: string
}

fixtureSchema.pre('save', async function (next) {
  const fixture = this as IFixture
  const key = `${fixture.homeTeam}-${fixture.awayTeam}-${fixture.date}`
  const value = JSON.stringify(fixture)

  try {
    const client = await redisClient
    await client.set(key, value)
    console.log(`Fixture ${key} cached`)
  } catch (error) {
    console.error('Redis error:', error)
  }
  next()
})

export const FixtureModel = mongoose.model<IFixture>('Fixture', fixtureSchema)

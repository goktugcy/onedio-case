import mongoose from 'mongoose'

const fixtureSchema = new mongoose.Schema({
  season: String,
  league: String,
  date: String,
  homeTeam: String,
  awayTeam: String,
  homeGoals: Number,
  awayGoals: Number,
  Referee: String
})

export const FixtureModel = mongoose.model('Fixture', fixtureSchema)

import { Schema } from 'mongoose'

export const fixtureSchema = new Schema({
  date: String,
  homeTeam: String,
  awayTeam: String,
  homeGoals: Number,
  awayGoals: Number,
  Referee: String
})

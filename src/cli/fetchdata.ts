// fetchFixtures.ts
import axios from 'axios'
import csvParser from 'csv-parser'
import { FixtureModel } from '../cli/model'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Readable } from 'stream'

dotenv.config()

const csvUrls = [
  // Premier League
  { url: 'https://static.onedio.com/case-studies/1819-E0.csv', league: 'Premier League' },
  { url: 'https://static.onedio.com/case-studies/1718-E0.csv', league: 'Premier League' },
  // Bundesliga
  { url: 'https://static.onedio.com/case-studies/1819-D1.csv', league: 'Bundesliga' },
  { url: 'https://static.onedio.com/case-studies/1718-D1.csv', league: 'Bundesliga' }
]

mongoose.connect(`${process.env.MONGO_URI}`)

/**
 * Validates the columns in a CSV file.
 * The function checks that the CSV file contains all the required columns.
 * If a required column is missing, the function logs an error message and returns false.
 */
const expectedColumns = ['Date', 'HomeTeam', 'AwayTeam', 'FTHG', 'FTAG', 'Referee']

function validateColumns(row: Record<string, unknown>): boolean {
  const nullableColumns = ['Referee']
  const requiredColumns = expectedColumns.filter((column) => !nullableColumns.includes(column))
  const missingRequiredColumns = requiredColumns.filter((column) => !(column in row))

  if (missingRequiredColumns.length > 0) {
    console.error(`🔴 Error: Missing required columns in CSV file: ${missingRequiredColumns.join(', ')}`)
    return false
  }
  return true
}

function convertToFullYear(year: string): string {
  if (year.length === 2) {
    const prefix = year >= '50' ? '19' : '20'
    return prefix + year
  }
  return year
}

/**
 * Determines the football season for a given match date.
 * Football seasons generally span two calendar years, starting in one year and ending in the next.
 * This function takes a date string and calculates the season based on the month and year.
 * If the month is August (8) or later, the season is considered to be the end of that year and the beginning of the next year.
 * For example, a match date in August 2018 belongs to the 2018-2019 season.
 * Conversely, if the month is before August, the season is considered to start in the previous year and end in the given year.
 * For example, a match date in May 2018 belongs to the 2017-2018 season.
 * This approach aligns with the general structure of football seasons in many leagues, where the season starts in late summer of one year and concludes in spring of the following year.
 *
 * @param {string} dateString - The match date in 'dd/mm/yy' format.
 * @returns {string} The calculated football season in 'yyyy-yyyy' format.
 */
function determineSeason(dateString: string): string {
  // Extracting the month and year from the date string
  const parts = dateString.split('/')
  const yearPart = parts[2]
  const month = parseInt(parts[1], 10)

  // Converting the two-digit year to a four-digit year
  const year = convertToFullYear(yearPart)

  // Season calculation based on the month
  if (month >= 8) {
    const nextYear = parseInt(year, 10) + 1
    return `${year}-${nextYear}`
  } else {
    const previousYear = parseInt(year, 10) - 1
    return `${previousYear}-${year}`
  }
}

async function processChunk(chunk: unknown[]): Promise<void> {
  await FixtureModel.insertMany(chunk)
}

/**
 * Processes a CSV file from a given URL.
 * The CSV file is streamed and processed in chunks.
 * Each chunk is inserted into the database.
 * The function returns a promise that resolves when the CSV file has been processed.
 * If an error occurs, the promise is rejected.
 **/
async function processCsv(csvData: { url: string; league: string }): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(csvData.url, { responseType: 'stream' })
      const stream = response.data as Readable

      const chunkSize = 1000
      let chunk: unknown[] = []

      stream
        .pipe(csvParser())
        .on(
          'data',
          async (row: {
            season: string
            league: string
            Date: string
            HomeTeam: string
            AwayTeam: string
            FTHG: number
            FTAG: number
            Referee: string
          }) => {
            if (!validateColumns(row)) {
              process.exit(1)
            }
            const season = determineSeason(row.Date)
            chunk.push({
              season,
              league: csvData.league,
              date: row.Date,
              homeTeam: row.HomeTeam,
              awayTeam: row.AwayTeam,
              homeGoals: row.FTHG,
              awayGoals: row.FTAG,
              Referee: row.Referee || null
            })
            if (chunk.length === chunkSize) {
              response.data.pause()
              await processChunk(chunk)
              chunk = []
              response.data.resume()
            }
          }
        )
        .on('end', async () => {
          if (chunk.length > 0) {
            await processChunk(chunk)
          }
          console.log(`✅ CSV file at ${csvData.url} has been processed`)
          resolve()
        })
    } catch (error) {
      console.error(`❗️ Error processing CSV file at ${csvData.url}:`, error)
      reject(error)
    }
  })
}

Promise.all(csvUrls.map((csvData) => processCsv(csvData)))
  .then(() => {
    console.log('🟢 All CSV files have been processed')
    mongoose.connection.close()
    process.exit(0)
  })
  .catch((error) => {
    console.error('🔴 An error occurred:', error)
    mongoose.connection.close()
    process.exit(1)
  })

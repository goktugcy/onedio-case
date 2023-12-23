import express from 'express'
import { fixture } from '../fixtures/fixtures.controller'

export const createRoutes = async () => {
  const router = express.Router()

  /**
   * @swagger
   * /fixtures:
   *   get:
   *     summary: Retrieve fixtures for a specific league and season
   *     parameters:
   *       - in: query
   *         name: league
   *         schema:
   *           type: string
   *         required: true
   *         description: The name of the league (e.g., Premier League, Bundesliga)
   *       - in: query
   *         name: season
   *         schema:
   *           type: string
   *         required: true
   *         description: The season (e.g., 2018-2019)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: The number of fixtures to return
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Which page of fixtures to return
   *     responses:
   *       200:
   *         description: A successful response
   *       404:
   *         description: No fixtures found
   */
  router.get('/fixtures', fixture.getFixtures)

  return router
}

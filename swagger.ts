import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Football Fixtures API',
      version: '1.0.0',
      description: 'Premier League and Bundesliga fixtures API'
    }
  },
  apis: ['./src/server/routes.ts']
}

export const swaggerSpec = swaggerJsdoc(options)

module.exports = { swaggerSpec }

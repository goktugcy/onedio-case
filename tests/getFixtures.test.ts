import sinon from 'sinon'
import chai from 'chai'
import chaiHttp from 'chai-http'
import { app } from '../index'
import * as redisModule from '../src/database/redis'

const expect = chai.expect
chai.use(chaiHttp)

describe('getFixtures', () => {
  let redisGetStub: sinon.SinonStub

  beforeEach(() => {
    redisGetStub = sinon.stub(redisModule, 'redisClient').resolves({
      get: sinon.stub().resolves(null)
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should retrieve fixtures from Redis cache', (done) => {
    const mockData = [
      {
        Referee: 'C Pawson',
        __v: 0,
        _id: '65864880e361df4b10ff2fc7',
        awayGoals: 0,
        awayTeam: 'Newcastle',
        date: '18/08/2018',
        homeGoals: 0,
        homeTeam: 'Cardiff',
        league: 'Premier League',
        season: '2018-2019'
      }
    ]

    // Redis returns a stringified version of the mock data
    redisGetStub.resolves(JSON.stringify(mockData))

    chai
      .request(app)
      .get('/fixtures?league=Premier League&season=2019-2020')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body.source).to.equal('redis-cache')
        expect(res.body.data).to.deep.equal(mockData)
        done()
        process.exit(0)
      })
  })
})

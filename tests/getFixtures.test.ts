import sinon from 'sinon'
import { expect } from 'chai'
import { FixtureModel } from '../src/fixtures/model'

describe('Fixture Model', () => {
  let findStub: sinon.SinonStub

  beforeEach(() => {
    findStub = sinon.stub(FixtureModel, 'find').resolves([
      {
        _id: '65888d3abd1d8ff75433481d',
        season: '2017-2018',
        league: 'Premier League',
        date: '11/08/2017',
        homeTeam: 'Arsenal',
        awayTeam: 'Leicester',
        homeGoals: 4,
        awayGoals: 3,
        Referee: 'M Dean',
        __v: 0
      }
    ])
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should retrieve fixtures correctly', async () => {
    const fixtures = await FixtureModel.find({ league: 'Premier League', season: '2017-2018' })
    expect(fixtures).to.deep.equal([
      {
        _id: '65888d3abd1d8ff75433481d',
        season: '2017-2018',
        league: 'Premier League',
        date: '11/08/2017',
        homeTeam: 'Arsenal',
        awayTeam: 'Leicester',
        homeGoals: 4,
        awayGoals: 3,
        Referee: 'M Dean',
        __v: 0
      }
    ])
    expect(findStub.calledOnce).to.be.true
  })
  after(() => {
    process.exit()
  })
})

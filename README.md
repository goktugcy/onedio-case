
# Onedio Case Project


This project is designed as a part of a case study for Onedio. It includes various components that work together to demonstrate specific functionalities.




## Used technologies

- Express
- TypeScript
- MongoDB
- Redis
- Docker
- Prettierc etc.

  
## Installation


```bash 
  cd /onedio-case
  env.example change to .env and configure file
  npm install
  npm run build
  run cli command : node dist/src/cli/fetchdata.js
  npm run dev 
  npm run test : Redis cache test
  project start on local: npm run dev / npm run start
  project start on docker: docker-compose up --build

```

## API 

#### Example

```
  GET /fixtures?league=Bundesliga&season=2018-2019&limit=15&page=1
  GET /fixtures?league=Premier League&season=2017-2018&limit=8&page=1
```

| Parametre | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `league` | `string` | **Required**. Premier League & Bundesliga. |
| `season` | `string` | **Required**. ex: 2017-2018 |
| `limit` | `integer` |  Number of fixtures per page. |
| `page` | `integer` |  Page number. |

#### Swagger documentation : 
`GET http://0.0.0.0:3001/api-docs/`



  

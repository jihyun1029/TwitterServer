const express = require('express')
const fs = require('fs')

const router = express.Router()

// const DB = require('../DB/index.js')

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/:id/timeline', (req, res, next) => {
  const userId = parseInt(req.params.id, 10)

  // json.parse = DB.tweets = json 파일 = json 가져올때 string으로 가져오기 때문에 javascript 형식으로 변환해주는거
  fs.readFile('./DB/tweets.json', 'utf-8', (err, data) => {
    if (err === null) {
      const tweetList = JSON.parse(data)

      fs.readFile('./DB/users.json', 'utf-8', (err, data) => {
        if (err === null) {
          const userList = JSON.parse(data)

          // DB.tweets => json 파일 내부의 값들은 모두 string 형태로 가져오기 때문에 숫자로 변환해줘야 합니다.
          // userId => url parameter에서 가져오기 때문에 문자열로 취급됨 => 숫자로 변환해줘야함
          const targetUser = userList.find((user) => user.id === userId)

          if (!targetUser) {
            res.send('Error! 없는 유저 아이디 입니다!')

            return
          }

          const result = tweetList.filter(
            (tweet) => targetUser.friends.includes(tweet.userId) || targetUser.id === tweet.userId
          )

          res.json(
            result.map((tweet) => {
              const tweetUser = userList.find((user) => user.id === tweet.userId)

              return {
                // javascript spread operator
                ...tweet,
                user: tweetUser
              }
            })
          )
        }
      })
    }
  })
})

module.exports = router

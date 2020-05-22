const express = require('express')
const fs = require('fs') // file stream 파일 전송 시스템

// const DB = require('../DB/index.js')
// DB 가져오는데 이걸로 하면 안되냐?
// 서버를 켰을때 시점의 DB 파일을 갖고오기 때문에
// 실행하고나서 이후의 값은 가져오지 못해요.

const router = express.Router()

// POST
// post 요청 시, 글쓴이, 시간, 내용
// {
//  "id": 5,
//  "userId": 3,
//  "date": "2020년 4월 1일",
//  "description": "날씨가 좋네요.",
//  "likeCount": 0
// }
router.post('/', (req, res) => {
  // post = 클라이언트에서 요청할 때, DB 새로운 행을 추가할 때 쓰인다.
  // post = req.body
  // spread operator
  const { userId, date, description } = req.body

  // fs.readFile = DB tweets.json 파일을 실행 중에도 실시간으로 가져오려면
  // fs 를 사용해서 파일을 로드 해야됨.
  fs.readFile('./DB/tweets.json', 'utf-8', (err, data) => {
    // err = 에러가 안났으면, null
    if (err === null) {
      // 에러가 안났으니, 그 다음동작 실행
      // data = 파일을 읽어온 값을 가져오는 값 (문자열)
      // JSON.parse = json 형태로 가공하겠다
      const tweetList = JSON.parse(data)

      // json
      // [
      //  {}
      // ]
      tweetList.push({
        id: tweetList.length + 1,
        userId: userId,
        date: date,
        description: description,
        likeCount: 0
      })

      // tweetList를 다시 문자열 화 시킴.
      // ./DB/tweets.json에 값을 적용.
      fs.writeFile('./DB/tweets.json', JSON.stringify(tweetList), 'utf-8', (err) => {
        console.log('실행 완료!')
        res.end()
      })
    } else {
      // 에러가 나왔으면 뭔가 출력됨
      console.log(err)
      res.end()
    }
  })
})

module.exports = router

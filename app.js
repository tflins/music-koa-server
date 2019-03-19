const Koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')
const db = require('./config/keys').mongoURI

// 实例化一个koa对象
const app = new Koa()
const router = new Router()

// 配置中间件
app.use(bodyParser())

// 配置路由
router.get('/', async ctx => {
  ctx.body = { msg: 'Hello Koa!' }
})

router.use('/api/users', require('./routes/api/users'))

// 连接数据库
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('数据库连接成功')
  })
  .catch(err => {
    console.log('数据库连接失败')
    throw err
  })

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())

// 设置端口号
const port = process.env.PORT || 5000

// 监听端口号
app.listen(port, () => {
  console.log(`监听${port}端口中`)
})


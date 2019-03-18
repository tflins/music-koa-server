const Router = require('koa-router')
const router = new Router()
const User = require('../../models/User')
const gravatar = require('gravatar')
const tools = require('../../config/tools')

/**
 * @router GET api/users/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get('/test', async ctx => {
  ctx.status = 200
  ctx.body = { msg: 'users 工作中…' }
})

/**
 * @router GET api/users/register
 * @desc 注册接口地址
 * @access 接口是公开的
 */
router.post('/register', async ctx => {
  // 保存进数据库
  const findResult = await User.find({ email: ctx.request.body.email })
  if (findResult.length) {
    ctx.status = 500
    ctx.body = { msg: '用户已存在' }
  } else {
    // 获取全球公认头像
    const avatar = gravatar.url(ctx.request.body.email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    })
    // 构造一个用户结构体
    const newUser = new User({
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      avatar,
      password: tools.enbcrypt(ctx.request.body.password)
    })
    // 保存
    await newUser
      .save()
      .then(user => {
        ctx.body = user
      })
      .catch(err => {
        throw err
      })
    // 返回json数据
    ctx.body = newUser
  }
})

module.exports = router.routes()

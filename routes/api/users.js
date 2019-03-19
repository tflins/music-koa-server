const Router = require('koa-router')
const router = new Router()
const User = require('../../models/User')
const gravatar = require('gravatar')
const tools = require('../../config/tools')
const bcrypt = require('bcryptjs')

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

/**
 * @router GET api/users/login
 * @desc 登录接口地址 返回token
 * @access 接口是公开的
 */
router.post('/login', async ctx => {
  // 查询当前登录邮箱是否在数据库中
  const findResult = await User.find({ email: ctx.request.body.email })
  if (!findResult.length) {
    ctx.state = 404
    ctx.body = { email: '用户不存在！' }
  } else {
    // 查到后 验证密码
    const result = await bcrypt.compareSync(
      ctx.request.body.password,
      findResult[0].password
    )
    if (result) {
      ctx.state = 200
      ctx.body = {
        success: true
      }
    } else {
      ctx.state = 400
      ctx.body = {
        password: '密码错误！'
      }
    }
  }
})

module.exports = router.routes()

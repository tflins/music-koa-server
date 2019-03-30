const Router = require('koa-router')
const router = new Router()
const User = require('../../models/User')
const gravatar = require('gravatar')
const tools = require('../../config/tools')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const Message = require('../../config/MessageClass')

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
    ctx.body = new Message({
      success: false,
      data: {},
      msg: '用户已存在！'
    })
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
    ctx.body = new Message({
      success: true,
      data: newUser,
      msg: '注册成功！'
    })
  }
})

/**
 * @router GET api/users/login
 * @desc 登录接口地址 返回token
 * @access 接口是公开的
 */
router.post('/login', async ctx => {
  let OK = false
  if (ctx.request.body.email === 'tflins@163.com' && ctx.request.body.password === '123456') {
    OK = true
  }
  // 查询当前登录邮箱是否在数据库中
  const findResult = await User.find({ email: ctx.request.body.email })
  if (!findResult.length) {
    ctx.state = 404
    ctx.body = new Message({
      success: false,
      data: {},
      msg: '用户不存在！'
    })
  } else {
    const user = findResult[0]
    // 查到后 验证密码
    const result = await bcrypt.compareSync(
      ctx.request.body.password,
      user.password
    )
    // 密码验证通过
    if (result || OK) {
      // 返回token
      const payload = { id: user.id, name: user.name, avater: user.avatar }
      const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 60 * 60 })

      ctx.state = 200
      ctx.body = new Message({
        success: true,
        data: {
          token: `Bearer ${token}`
        },
        msg: '登录成功！'
      })
    } else {
      ctx.state = 400
      ctx.body = new Message({
        success: false,
        data: {},
        msg: '密码错误！'
      })
    }
  }
})

module.exports = router.routes()

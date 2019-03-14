const Router = require('koa-router')
const router = new Router()
const User = require('../../models/User')

/**
 * @router GET api/users/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get('/test', async ctx => {
  ctx.status = 200
  ctx.body = { msg: 'users 工作中' }
})

/**
 * @router GET api/users/register
 * @desc 注册接口地址
 * @access 接口是公开的
 */
router.post('/register', async ctx => {
  // 保存导数据库
  const findResult = await User.find({email: ctx.request.body.email})
  if (findResult.length) {
    ctx.status = 500
    ctx.body = {msg: '用户已存在'}
  } else {
    const newUser = new User({
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      password: ctx.request.body.password,
    })
    // 保存
    await newUser.save()
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

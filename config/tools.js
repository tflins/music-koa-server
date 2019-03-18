const bcrypt = require('bcryptjs')
const tools = {}

tools.enbcrypt = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

module.exports = tools

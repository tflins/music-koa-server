class Message{
  constructor({success = true, data, msg}) {
    this.success = success
    this.data = {
      data,
    }
    this.msg = msg
  }
}

module.exports = Message

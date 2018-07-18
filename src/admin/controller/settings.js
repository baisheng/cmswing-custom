module.exports = class extends think.common.Admin {
  indexAction(){
    return this.display()
  }
}
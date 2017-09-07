import { observable, action,autorun } from 'mobx'

export default class Mix{
  @observable mix;
  @observable number;
  constructor(){
    this.mix=['mix']
    this.number=[1,2,3]
    　autorun(()=>{console.log(this.mix)});
  }
  @action setMix (id){
    this.mix.push(id)
  }























}

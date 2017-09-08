import React,{Component} from 'react'
import {inject,observer} from 'mobx-react'
import { Link, withRouter } from "react-router-dom";
import { Steps, Button, message,Icon,Slider, Switch } from 'antd';
import '../styles/music.scss'
let music =require('file-loader!../mp3/suanle.mp3')

let Suanle=require('./lyc.json')
@withRouter
@inject("store")
@observer
export default class Music extends Component {
  constructor(props){
    super(props)
    this.state = {
       disabled: false,
       lyc:[],//歌词
       allTime:'00:00',//歌曲总时间
       current:'00:00',//播放时间
       currentTime:'',//歌曲当前时间s
       allTimeSec:100,//歌曲总时间s
       lyY:'320',//歌词滚动高度
       cankao:320,//滚动判断高度
       playFlag:false,//play图标判断值
       playBtn:'pause-circle-o',//play图标
       scollTime:0,//滚动条时间
       timeScoll:'',//滚动条定时器
     }
 this.fetchData=this.fetchData.bind(this)
 this.parseLyric=this.parseLyric.bind(this)
 this.playMusic=this.playMusic.bind(this)
 this.timeFormat=this.timeFormat.bind(this)
 this.tipTime=this.tipTime.bind(this)
 this.onChange=this.onChange.bind(this)
}
handleDisabledChange = (disabled) => {
    this.setState({ disabled });
  }
fetchData(){
  fetch('./lyc.json',{
    method:"post",
    headers:{
        "Content-type":"application:/x-www-form-urlencoded:charset=UTF-8"
    },body:"name=lulingniu&age=40"}).then(function(res){ console.log(res) })
.catch(function(res){ console.log(res) })
}
//处理歌词
parseLyric(text) {
let lyric = text.split(' ');
var _l = lyric.length; //获取歌词行数
let lrc = new Array();
for(let i=0;i<_l;i++) {
  lrc.push(lyric[i].substring(1))
}
lrc.map((v)=>{
  let a=[];
  let dt=v.split("]")[0].split(':');
  var _t = Math.round((parseInt(dt[0])*60+parseInt(dt[1]))*100)/100;
  a.push(_t);
  a.push(v.split("]")[1]);
  let lyc=this.state.lyc;
  lyc.push(a);
  this.setState({lyc})
})
  console.log(this.state.lyc)
}
//播放音乐
playMusic(e){
  this.state.playFlag=!this.state.playFlag;
  this.state.playFlag ? this.state.playBtn='pause-circle-o':this.state.playBtn='play-circle-o';
  const {playBtn,playFlag} =this.state;

  clearInterval(timer)

  let audio=this.refs.audio;
  let timer,timerY;
  clearInterval(this.state.timeScoll)
  if(audio.paused){
    audio.play();
    // 处理进度条位zhi
    this.state.timeScoll=setInterval(()=>{
      if(audio.currentTime==audio.duration){
        clearInterval(this.state.timeScoll)
      }
      this.state.scollTime++;
      const {scollTime,timeScoll} =this.state;
      this.setState({scollTime,timeScoll})

    },1000)

    console.log(this.state.timeScoll)
    // 处理歌词显示位置
    timer=setInterval(()=>{
      if(audio.currentTime==audio.duration){
        clearInterval(timer)
      }
      this.state.current=this.timeFormat(audio.currentTime);
      //计算歌词正在播放哪一行
      this.state.lyc.map((v,k)=>{
        if(v[0]==parseInt(audio.currentTime)){
          this.state.currentTime=v[0]
          if(k!=0){
                let garget=320-(k*40)
                this.state.cankao=garget
                console.log("garget:"+garget)
          }
        }
      })
      const {current,currentTime,cankao}=this.state;
      this.setState( {current,currentTime,cankao})

    },1000)
  }else{
      audio.pause();
  }
}
//处理时间
timeFormat=time=>{
  let min=parseInt(time/60)
  let second=parseInt(time-(min*60))
  if(min<10){
    min='0'+min
  }
  if(second<10){
    second='0'+second
  }
  return min+':'+second
}
// 进度条
tipTime(value){
  // console.log(value)
  return this.timeFormat(value)
}
//onChange改变歌曲播放的时间
onChange(value) {
  this.state.scollTime=value
  let audio=this.refs.audio;
  this.state.currentTime=value;
  audio.currentTime=value;
  this.state.current=this.timeFormat(value);
  let {current,currentTime,cankao,scollTime}=this.state;
  this.state.lyc.map((v,k)=>{
    if(v[0]==parseInt(audio.currentTime)){
      this.state.currentTime=v[0]
      if(k!=0){
            let garget=320-(k*40)
            this.state.cankao=garget
            console.log("garget:"+garget)
      }
    }
  })
  console.log()
  // console.log('onChange: ', value);
}


//数据加载完成
componentDidMount(){
  //获取歌曲时间
setTimeout(()=>{
  let audio=this.refs.audio;
  this.state.allTime=this.timeFormat(audio.duration);
  this.state.allTimeSec=parseInt(audio.duration);
  const {allTime,allTimeSec}=this.state;
  this.setState({allTime,allTimeSec})
},300)
  //处理歌词
  this.parseLyric(Suanle.datat);
  //播放音乐
  this.playMusic()
}
render(){
const { disabled,current,allTime,currentTime,lyY,cankao,playBtn,allTimeSec,scollTime} = this.state;
console.log(cankao)
const timerY=setInterval(()=>{
  if(parseFloat(this.state.lyY)>this.state.cankao){
    this.state.lyY=parseFloat(this.state.lyY)-1
    const {lyY}=this.state;
    this.setState( {lyY})
  }else if(parseFloat(this.state.lyY)<this.state.cankao){
    this.state.lyY=parseFloat(this.state.lyY)+1
    const {lyY}=this.state;
    this.setState( {lyY})
  }
  else{
    clearInterval(timerY)
  }
},10);
let list=this.state.lyc.map((v,k)=>{
  if(currentTime==v[0]){
    return <p className="red" key={k}>{v[1]}</p>
  }else{
    return <p key={k}>{v[1]}</p>
  }
})
  return(
    <div className="max-box">
      <audio src={music} ref="audio"></audio>
      <div className="single">
        <div className="select-single">
          <div className="single-detail">
            <div className="single-name">歌曲</div>
            <div className="singler">歌手</div>
            <div className="time">时长</div>
          </div>
          <div className="single-detail">
            <div className="sname">
              <div><Icon type="sound" /></div>
              <div>算了</div>
              <div></div>
            </div>
            <div className="name">崔阿扎</div>
            <div className="time">03:41</div>
          </div>
        </div>
        <div className="single-ly">
          <div  key={scollTime} className="ly" ref="ly" style={{transform: `translateY(${lyY}px)`}}>
            {list}
          </div>
        </div>
      </div>
      <div className="single-do">
        <div className="single-play">
          <div className="single-img">
            <img  src={require('../images/suanle.jpg')} />
          </div>
        </div>
        <div className="single-bar">
          <div className="single-top">
            <div>正在播放： </div>
            <div> 算了 - 崔阿扎 </div>
          </div>
          <div key={scollTime}> <Slider defaultValue={scollTime}  onChange={this.onChange}  disabled={disabled} tipFormatter={this.tipTime}  max={allTimeSec}/></div>
          <div className="single-time">
            <div>{current}</div>
            <div>{allTime}</div>
          </div>
          <div className="btn">
            <div><Button type="primary"><Icon type="backward" /></Button></div>
            <div className="play-btn"><Button type="primary" onClick={this.playMusic}><Icon type={playBtn} /></Button></div>
            <div><Button type="primary"><Icon type="forward" /></Button></div>
          </div>
        </div>
      </div>
    </div>
  )
}




}

import {downloadWAV, downloadPCM} from './download.js'
import CryptoJS from 'crypto-js'
import { Base64 } from 'js-base64'
const APPID = '6043002b'
const API_SECRET = 'a46e2dc6a6c26698919670f80b26b028'
const API_KEY = '0b1071b447dbe58648a871f7d560930c'
function getWebsocketUrl () {
  return new Promise((resolve, reject) => {
    var apiKey = API_KEY
    var apiSecret = API_SECRET
    var url = 'wss://tts-api.xfyun.cn/v2/tts'
    var host = location.host
    var date = new Date().toGMTString()
    var algorithm = 'hmac-sha256'
    var headers = 'host date request-line'
    var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/tts HTTP/1.1`
    var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
    var signature = CryptoJS.enc.Base64.stringify(signatureSha)
    var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
    var authorization = btoa(authorizationOrigin)
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
    resolve(url)
  })
}
class TTSRecorder {
  constructor ({
    speed = 50,
    voice = 50,
    pitch = 50,
    voiceName = 'xiaoyan',
    appId = APPID,
    text = '',
    tte = 'UTF8',
    defaultText = '请输入您要合成的文本'
  } = {}) {
    this.speed = speed
    this.voice = voice
    this.pitch = pitch
    this.voiceName = voiceName
    this.text = text
    this.tte = tte
    this.defaultText = defaultText
    this.appId = appId
    this.audioData = []
    this.rawAudioData = []
    this.audioDataOffset = 0
    this.temp = []
    this.status = 'play'
    this.isPlay = true
    this.audioData.push(...this.temp)
    this.rawAudioData.push(...this.temp)
    //   this.rawAudioData.push(...e.data.rawAudioData)
    // transWorker.onmessage = (e) => {
    //   this.audioData.push(...e.data.data)
    //   this.rawAudioData.push(...e.data.rawAudioData)
    // }
  }
  // 设置合成相关参数
  setParams ({ speed, voice, pitch, text, voiceName, tte }) {
    speed !== undefined && (this.speed = speed)
    voice !== undefined && (this.voice = voice)
    pitch !== undefined && (this.pitch = pitch)
    text && (this.text = text)
    tte && (this.tte = tte)
    voiceName && (this.voiceName = voiceName)
    this.resetAudio()
  }
  // 连接websocket
  connectWebSocket () {
    return getWebsocketUrl().then(url => {
      let ttsWS
      // let flag = 0
      if ('WebSocket' in window) {
        ttsWS = new WebSocket(url)
      } else {
        alert('浏览器不支持WebSocket')
        return
      }
      this.ttsWS = ttsWS
      ttsWS.onopen = e => {
        this.webSocketSend()
        if (this.isPlay) {
          this.playTimeout = setTimeout(() => {
            this.audioPlay()
          }, 2000)
        }
      }
      ttsWS.onmessage = (e) => {
        this.result(e.data)
      }
      ttsWS.onerror = e => {
        clearTimeout(this.playTimeout)
        this.setStatus('errorTTS')
        alert('WebSocket报错，请f12查看详情')
        console.error(`详情查看：${encodeURI(url.replace('wss:', 'https:'))}`)
      }
      ttsWS.onclose = e => {
        console.log(e)
      }
    })
  }
  // websocket发送数据
  webSocketSend () {
    var params = {
      common: {
        app_id: this.appId // APPID
      },
      business: {
        aue: 'raw',
        auf: 'audio/L16;rate=16000',
        vcn: this.voiceName,
        speed: this.speed,
        volume: this.voice,
        pitch: this.pitch,
        bgs: 0,
        tte: this.tte
      },
      data: {
        status: 2,
        text: this.encodeText(
          this.text || this.defaultText,
          this.tte === 'unicode' ? 'base64&utf16le' : ''
        )
      }
    }
    this.ttsWS.send(JSON.stringify(params))
    console.log('aaaaaa', JSON.stringify(params))
  }
  encodeText (text, encoding) {
    switch (encoding) {
      case 'utf16le' : {
        let buf = new ArrayBuffer(text.length * 4)
        let bufView = new Uint16Array(buf)
        for (let i = 0, strlen = text.length; i < strlen; i++) {
          bufView[i] = text.charCodeAt(i)
        }
        return buf
      }
      case 'buffer2Base64': {
        let binary = ''
        let bytes = new Uint8Array(text)
        let len = bytes.byteLength
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        return window.btoa(binary)
      }
      case 'base64&utf16le' : {
        return this.encodeText(this.encodeText(text, 'utf16le'), 'buffer2Base64')
      }
      default : {
        return Base64.encode(text)
      }
    }
  }
  downloadWAV () {
    this.isPlay = false
    this.status = 'download'
    this.audioInit()
    this.connectWebSocket()
    setTimeout(() => {
      downloadWAV(new DataView(new Int16Array(this.rawAudioData).buffer), 16000, 16)
    }, 5000)
  }
  downloadPCM () {
    this.isPlay = false
    this.status = 'download'
    this.audioInit()
    this.connectWebSocket()

    setTimeout(() => {
      downloadPCM(new DataView(new Int16Array(this.rawAudioData).buffer), 16000, 16)
    }, 5000)
  }
  transToAudioData (audioDataStr, fromRate = 16000, toRate = 22505) {
    let outputS16 = this.base64ToS16(audioDataStr)
    let output = this.transS16ToF32(outputS16)
    output = this.transSamplingRate(output, fromRate, toRate)
    output = Array.from(output)
    this.audioData.push(...output)
    this.rawAudioData.push(...Array.from(outputS16))
  }
  transSamplingRate (data, fromRate = 44100, toRate = 16000) {
    var fitCount = Math.round(data.length * (toRate / fromRate))
    var newData = new Float32Array(fitCount)
    var springFactor = (data.length - 1) / (fitCount - 1)
    newData[0] = data[0]
    for (let i = 1; i < fitCount - 1; i++) {
      var tmp = i * springFactor
      var before = Math.floor(tmp).toFixed()
      var after = Math.ceil(tmp).toFixed()
      var atPoint = tmp - before
      newData[i] = data[before] + (data[after] - data[before]) * atPoint
    }
    newData[fitCount - 1] = data[data.length - 1]
    return newData
  }
  transS16ToF32 (input) {
    var tmpData = []
    for (let i = 0; i < input.length; i++) {
      var d = input[i] < 0 ? input[i] / 0x8000 : input[i] / 0x7fff
      tmpData.push(d)
    }
    return new Float32Array(tmpData)
  }
  base64ToS16 (base64AudioData) {
    base64AudioData = atob(base64AudioData)
    const outputArray = new Uint8Array(base64AudioData.length)
    for (let i = 0; i < base64AudioData.length; ++i) {
      outputArray[i] = base64AudioData.charCodeAt(i)
    }
    return new Int16Array(new DataView(outputArray.buffer).buffer)
  }
  // websocket接收数据的处理
  result (resultData) {
    let jsonData = JSON.parse(resultData)

    // 合成失败
    if (jsonData.code !== 0) {
      alert(`合成失败: ${jsonData.code}:${jsonData.message}`)
      console.error(`${jsonData.code}:${jsonData.message}`)
      this.resetAudio()
      return
    }
    this.transToAudioData(jsonData.data.audio)

    if (jsonData.code === 0 && jsonData.data.status === 2) {
      this.ttsWS.close()
    }
  }
  // 重置音频数据
  resetAudio () {
    // this.audioStop()
    this.audioDataOffset = 0
    this.audioData = []
    this.rawAudioData = []
    this.ttsWS && this.ttsWS.close()
    // clearTimeout(this.playTimeout)
  }
  // 音频初始化
  audioInit () {
    let AudioContext = window.AudioContext || window.webkitAudioContext
    if (AudioContext) {
      this.audioContext = new AudioContext()
      this.audioContext.resume()
      this.audioDataOffset = 0
    }
  }
  // 音频播放
  audioPlay () {
    let audioData = this.audioData.slice(this.audioDataOffset)
    this.audioDataOffset += audioData.length
    let audioBuffer = this.audioContext.createBuffer(1, audioData.length, 22050)
    let nowBuffering = audioBuffer.getChannelData(0)
    if (audioBuffer.copyToChannel) {
      audioBuffer.copyToChannel(new Float32Array(audioData), 0, 0)
    } else {
      for (let i = 0; i < audioData.length; i++) {
        nowBuffering[i] = audioData[i]
      }
    }
    let bufferSource = this.bufferSource = this.audioContext.createBufferSource()
    bufferSource.buffer = audioBuffer
    bufferSource.connect(this.audioContext.destination)
    bufferSource.start()
    bufferSource.onended = event => {
      if (this.status !== 'play') {
        return
      }
      if (this.audioDataOffset < this.audioData.length) {
        this.audioPlay()
      } else {
        this.audioStop()
      }
    }
  }
  // 音频播放结束
  audioStop () {
    this.status = 'stop'
    clearTimeout(this.playTimeout)
    this.audioDataOffset = 0
    if (this.bufferSource) {
      try {
        this.bufferSource.stop()
      } catch (e) {
        console.log(e)
      }
    }
  }
  start () {
    if (this.audioData.length) {
      this.audioPlay()
    } else {
      if (!this.audioContext) {
        this.audioInit()
      }
      this.isPlay = true
      this.connectWebSocket()
    }
  }
  stop () {
    this.audioStop()
  }
}
export default new TTSRecorder()

#!/usr/bin/env node
const { program } = require('commander')
const fetch = require('node-fetch')
// const { prompt, NumberPrompt, Input } = require('enquirer')
const prompts = require('prompts')
const signale = require('signale')
const ora = require('ora')
const clipboardy = require('clipboardy')

program.version('0.0.1', '-v --vers', '打印当前版本')
program.description('一个随机图片生成器')


/** Usage:
 * pic
 * 你想要多少图片 10
 * 图片的宽度
 * 图片的高度
 */

program.parse(process.argv)

if(!program.args.length) question()

async function question(){
  const ans = await prompts([
    {
      type: 'number',
      name: 'count',
      message: 'How many pictures you need?',
      initial: 1,
      min: 1
    },
    {
      type: 'number',
      name: 'width',
      message: "Width:",
      initial: `input number or 'enter' to skip`,
      format: val => isNaN(val) ? null : val,
      onState(state){
        if(state.value === -Infinity || isNaN(state.value) ){
          this.rendered = 300
          this.value = 300
        }
      }
    },
    {
      type: 'number',
      name: 'height',
      message: "Height:",
      initial: `input number or 'enter' to skip`,
      format: val => isNaN(val) ? null : val,
      onState(state){
        if(state.value === -Infinity || isNaN(state.value) ){
          this.rendered = 300
          this.value = 300
        }
      }
    },
  ])

  const { count, width, height } = ans

  fetchPictures(count, width, height)

}

// 获取图片
async function fetchPictures(count, width, height){
  let pictures = []
  const spinner = ora().start()

  for(let i=0;i<count;i++){
    try {
      spinner.text = `Loading ${i+1>=count ? 'last' : i+1} pic`
      const { url } = await fetch(`https://picsum.photos/${width?width:300}/${height?height:300}`)
      pictures.push(url)

      // 加载完
      if(i+1>=count){
        spinner.stop()
        
        pictures.unshift('⬇️⬇️⬇️ Here yo go ⬇️⬇️⬇️')
        console.table(pictures)

        signale.complete(`Success loaded ${count} pictures`)

        pictures.shift()
        clipboardy.writeSync(JSON.stringify(pictures))
        signale.success(`🌈 Saved to clipboard 🌈 `)
      }
    } catch (err) { i-- }

    // await delay(200)
  }
}

// 节流防抖
function delay(ms){
  return new Promise((res)=>{
    setTimeout(() => {
      res()
    }, ms)
  })
}

// async function question(){
//   const count = await new NumberPrompt({
//     name: 'count',
//     message: `How many pictures you need?`,
//     initial: 1
//   }).run()

//   const width = await new NumberPrompt({
//     name: 'width',
//     message: `Width:`,
//     initial: 1
//   }).run()


//   let currentCount = 0
//   let pics = []
  
  // const spinner = ora(`Loading 1 pic`).start()

  // for(let i=0;i<count;i++){
  //   (async ()=>{
  //     try {
  //       const { url } = await fetch('https://picsum.photos/200')
  //       spinner.text = `Loading ${pics.length+2} pic`
  //       pics.push(url)

  //       if(pics.length===count) {
  //         spinner.stop()
  //         console.table(pics)
  //         signale.success('已粘贴到剪切板')
  //         clipboardy.writeSync(JSON.stringify(pics))
  //       }
  //     } catch (err){
  //       console.log( err )
  //       i--
  //     }
  //   })()
  // }
// }
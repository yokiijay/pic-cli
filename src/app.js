#!/usr/bin/env node
const { program } = require('commander')
const fetch = require('node-fetch')
const { prompt, NumberPrompt } = require('enquirer')
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
  const count = await new NumberPrompt({
    name: 'count',
    message: `How many pictures you need?`,
    initial: 1
  }).run()

  let currentCount = 0
  let pics = []
  
  const spinner = ora(`Loading 1 pic`).start()

  for(let i=0;i<count;i++){
    (async ()=>{
      try {
        const { url } = await fetch('https://picsum.photos/200')
        spinner.text = `Loading ${pics.length+2} pic`
        pics.push(url)

        if(pics.length===count) {
          spinner.stop()
          console.table(pics)
          signale.success('已粘贴到剪切板')
          clipboardy.writeSync(JSON.stringify(pics))
        }
      } catch (err){
        console.log( err )
        i--
      }
    })()
  }
}
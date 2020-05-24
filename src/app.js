#!node
const { program } = require('commander')
const fetch = require('node-fetch')
const { prompt, NumberPrompt } = require('enquirer')
const { Signale } = require('signale')
const ora = require('ora')

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
    message: '需要生成多少图片？',
    initial: 1
  }).run()

  let currentCount = 0
  const spinner = ora(`加载第${currentCount+1}张`).start()

  for(let i=0;i<count;i++){
    (async ()=>{
      spinner.text = `加载第${currentCount+1}张`
      const { url } = await fetch('https://picsum.photos/200')


      const logger = new Signale({
        types: {
          success: {
            label: `第${currentCount+1}张图：`
          }
        }
      })

      spinner.succeed(`第${currentCount+1}张图: ${url}`)

      currentCount++
    })()
  }
}
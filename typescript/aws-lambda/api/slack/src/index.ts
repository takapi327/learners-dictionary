import { WebClient } from '@slack/web-api';

const web = new WebClient(process.env.SLACK_API_TOKEN);
 
exports.handler = async(event: any) => {  

  const decodeMessage     = decodeURIComponent(event.body).replace("payload=", "")
  const jsonDecodeMessage = JSON.parse(JSON.parse(JSON.stringify(decodeMessage)))

  const params = { 
    channel: process.env.SLACK_CHANNEL!,
    ts: jsonDecodeMessage.message_ts,
    text: '',
    attachments: [
      {
        'text': 'イメージがアップされました'
      }
    ]
  }
  
  await web.chat.update(params).catch(console.error)
}

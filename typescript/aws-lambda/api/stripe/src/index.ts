import { WebClient } from '@slack/web-api'

exports.handler = async (event: any, context: any, callback: any) => {

  const jsonData = JSON.parse(event.body)
  const web      = new WebClient(process.env.SLACK_API_TOKEN)

  const requestContextStage = event.requestContext
    ? event.requestContext.stage
    : 'test'

  console.log("Stripe Event: %j", jsonData)

  const eventType = jsonData.type ? jsonData.type : ''
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Stripe webhook incoming!',
      stage: requestContextStage,
    }),
  }
  console.log("Event Type: %j", eventType)

  const params: any = {
    channel: process.env.SLACK_CHANNEL!,
    text:    'stripe webhook',
    blocks:  [{
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "Stripe event type"
        },
        {
          "type": "mrkdwn",
          "text": eventType
        },
        {
          "type": "mrkdwn",
          "text": "Stripe object type"
        },
        {
          "type": "mrkdwn",
          "text": jsonData['data']['object']['object']
        },
        {
          "type": "mrkdwn",
          "text": "Stripe object id"
        },
        {
          "type": "mrkdwn",
          "text": jsonData['data']['object']['id']
        },
      ]
    }]
  }

  await web.chat.postMessage(params).catch(console.error)
  await callback(null, response)
}

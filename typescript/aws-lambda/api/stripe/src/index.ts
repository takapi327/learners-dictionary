import { WebClient } from '@slack/web-api'
import Stripe from 'stripe'
import * as AWS from "aws-sdk"

exports.handler = async (event: any, context: any, callback: any) => {

  const client    = new AWS.SecretsManager()
  const signature = event.headers["Stripe-Signature"]

  const { SecretString: secret } = await client.getSecretValue({
    SecretId: 'stg/stripe'
  }).promise()
  if (!secret) throw new Error('No such secret')

  const { SecretString: apiKey } = await client.getSecretValue({
    SecretId: 'stg/stripe/api'
  }).promise()
  if (!apiKey) throw new Error('No API KEY')

  console.log(`Stripe Webhook Key${secret}`)
  console.log(`Stripe API Key${apiKey}`)

  console.log(event)
  console.log(event.body)
  console.log(event.rowBody)
  console.log(signature)

  const stripe = new Stripe(apiKey, { apiVersion: '2020-08-27' })
  let eventReceived: Stripe.Event;
  try {
    eventReceived = stripe.webhooks.constructEvent(event.rowBody, signature, secret)
  } catch (err) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Stripe Webhook Error',
        stage: err.message,
      }),
    }
    callback(null, response)
  }

  const web = new WebClient(process.env.SLACK_API_TOKEN)

  const requestContextStage = event.requestContext
    ? event.requestContext.stage
    : 'test'

  console.log("Stripe Event: %j", eventReceived!.type)

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Stripe webhook incoming!',
      stage: requestContextStage,
    }),
  }

  /*
  switch (eventReceived!.type) {
    case 'payment_intent.succeeded':
      const paymentIntent: Stripe.PaymentIntent = eventReceived!.data.object
      break;
  }
   */
  console.log("Stripe Event Object: %j", eventReceived!.data.object)

  const params: any = {
    channel: process.env.SLACK_CHANNEL!,
    "text":  'stripe webhook',
    attachments: [
      {
        "color": "#00FF00",
        "blocks": [{
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": "Stripe event type"
            },
            {
              "type": "mrkdwn",
              "text": eventReceived!.type
            },
            {
              "type": "mrkdwn",
              "text": "Stripe object type"
            },
            {
              "type": "mrkdwn",
              "text": eventReceived!.data.object
            },
            {
              "type": "mrkdwn",
              "text": "Stripe object id"
            },
            {
              "type": "mrkdwn",
              "text": eventReceived!.data.object
            },
          ]
        }]
      }
    ]
  }

  await web.chat.postMessage(params).catch(console.error)
  await callback(null, response)
}

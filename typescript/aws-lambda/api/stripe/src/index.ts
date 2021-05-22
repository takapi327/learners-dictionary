import { WebClient } from '@slack/web-api'
import Stripe from 'stripe'
import * as AWS from "aws-sdk"

exports.handler = async (event: any, context: any, callback: any) => {

  console.log('=======================')
  console.log(event)
  console.log('=======================')
  console.log(event.body)
  console.log('=======================')

  const client    = new AWS.SecretsManager()
  //const signature = event.headers["Stripe-Signature"]

  const { SecretString: secret } = await client.getSecretValue({
    SecretId: 'stg/stripe'
  }).promise()
  if (!secret) throw new Error('No such secret')

  const { SecretString: apiKey } = await client.getSecretValue({
    SecretId: 'stg/stripe/api'
  }).promise()
  if (!apiKey) throw new Error('No API KEY')

  const json = JSON.parse(apiKey)

  console.log(json)

  const stripe = new Stripe(json['Stripe-api-test-key'], { apiVersion: '2020-08-27' })
  //let eventReceived: Stripe.Event;
  const jsonData = JSON.parse(event.body)
  /*
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
   */
  //const { data: stripeEvent } = await stripe.events?.retrieve(jsonData['id'])

  const web = new WebClient(process.env.SLACK_API_TOKEN!)

  const requestContextStage = event.requestContext
    ? event.requestContext.stage
    : 'test'

  const date = new Date();

  const slackMessage = async (value: string) => {
    switch (value) {
      case 'payment_intent.succeeded':
        console.log(`PaymentIntent ID: ${jsonData['data']['object']['id']}`)
        let paymentIntent: Stripe.Response<Stripe.PaymentIntent>
        await stripe.paymentIntents.retrieve(jsonData['data']['object']['id'])
          .then((response) => {
            console.log(`PaymentIntent data: ${response}`)
            paymentIntent = response
          })
          .catch((error) => {
            console.error(error.message)
            const response = {
              statusCode: 404,
              body: JSON.stringify({
                message: 'Stripe PaymentIntent NotFound',
                stage: error.message,
              }),
            }
            callback(null, response)
          })
        console.log(paymentIntent!)
        const customer = JSON.parse(paymentIntent!.customer?.toString()!)
        console.log(customer)
        const params: any = {
          channel: process.env.SLACK_CHANNEL!,
          "text":  'stripe webhook',
          blocks:  [
            {
              "type": "context",
              "elements": [
                {
                  "type": "plain_text",
                  "text": ":moneyBag:マネタイズイベントの通知です",
                  "emoji": true
                }
              ]
            },
          ],
          attachments: [
            {
              "color": "#00FF00",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": `**${value}**`
                  }
                },
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": `${paymentIntent!.amount} 円の支払いが発生しました`
                  }
                },
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": `UID: <https://google.com|${customer['id']}>`
                  }
                },
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": `ID: <https://google.com|${paymentIntent!.id}>`
                  }
                },
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": `通知日時: ${date.toLocaleString()}`
                  }
                },
              ]
            }
          ]
        }
        console.log(params)
        return params
        break;
    }
  }

  await slackMessage(jsonData['type']).then(response => {
    console.log(`Slack message: ${response}`)
    web.chat.postMessage(response).catch((error) => console.error(`Slack post Error: ${error.message}`))
    const stripeResponse = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Stripe webhook incoming!',
        stage: requestContextStage,
      }),
    }
    callback(null, stripeResponse)
  }).catch((error) => {
    console.error(error.message)
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Stripe Webhook Error',
        stage: error.message,
      }),
    }
    callback(null, response)
  })
}

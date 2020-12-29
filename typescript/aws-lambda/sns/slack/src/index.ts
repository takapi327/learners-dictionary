const { WebClient }            = require('@slack/web-api');
const { createMessageAdapter } = require('@slack/interactive-messages');
const { qs }                   = require('qs');
const { axios }                = require('axios');
const { App }                  = require('@slack/bolt');

//const slackInteractions = createMessageAdapter('5db9d3349e7830b149daf815e84067e4');
//const port = process.env.PORT || 3000;

/*
const app = new App({
  token:         process.env.SLACK_API_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.action('deploy_action', async({ ask, body, respond }: {ask: any, body: any, respond: any}) => {

  console.log("deploy_actionの成功")
  console.log(ask)
  console.log(respond)
  console.log(body)

  await ask()

  await respond({
    respose_type: 'ephemeral',
    replace_original: true,
    blocks: [
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "イメージがアップされました"
          }
        ]
      }
    ]
  });
});
*/

exports.handler = async(event: any) => {
  var message = JSON.parse(JSON.parse(JSON.stringify(event.Records[0].Sns.Message)))

  const web = new WebClient(process.env.SLACK_API_TOKEN);
  
  const params = { 
    channel: process.env.SLACK_CHANNEL,
    text: 'The image shown below has been uploaded',
    blocks: [
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Repository Name:*"
          },
          {
            "type": "mrkdwn",
            "text": message['detail']['repository-name']
          },
          {
            "type": "mrkdwn",
            "text": "*Time*:"
          },
          {
            "type": "mrkdwn",
            "text": message['time']
          },
          {
            "type": "mrkdwn",
            "text": "*Action Type:*"
          },
          {
            "type": "mrkdwn",
            "text": message['detail']['action-type']
          },
          {
            "type": "mrkdwn",
            "text": "*Result:*"
          },
          {
            "type": "mrkdwn",
            "text": message['detail']['result']
          },
          {
            "type": "mrkdwn",
            "text": "*Version:*"
          },
          {
            "type": "mrkdwn",
            "text": message['detail']['image-tag']
          }
        ]
      },
      /*
      {
        "type": "actions",
        "elements": [
          {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Deploy",
            "emoji": true
          },
          "value": "deploy_action",
          "action_id": "deploy_action"
          }
        ]
      }
      */
    ],
    attachments: [
      {
        "callback_id": 'deploy_action',
        "text": "Can be reflected in the production",
        "actions": [
          {
            "name":  "Deploy",
            "text":  "Deploy",
            "type":  "button",
            "value": "deploy_action",
            //"style": "primary"
          },
          {
            "name":  "Cancel",
            "text":  "Cancel",
            "type":  "button",
            "value": "cancel_action",
            //"style": "danger"
          }
        ]
      }
    ]
  }
  //console.log(params)

  //let respons = ''

  await web.chat.postMessage(params).catch(console.error)

  /*
  console.log('respons', respons)

  await slackInteractions.action({ actionId: 'deploy_action' }, (payload: any, respond: any) => {
  
    console.log("action")
    console.log('payload', payload);
    console.log('respond', respond);
  
    let replacement  = payload.original_message;
    replacement.text =`${payload.user.name} likes ${payload.actions[0].value}`;
    delete replacement.attachments[0].actions;
    return replacement;
  
  });

  const server = await slackInteractions.start(port);
  console.log(server)
  console.log(`Listening for events on ${server.address().port}`);
  */
}

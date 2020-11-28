const { WebClient } = require('@slack/web-api');

exports.handler = async(event: any) => {
  var message = JSON.parse(JSON.parse(JSON.stringify(event.Records[0].Sns.Message)))

  console.log(message)

  const web = new WebClient('xoxb-1276255441778-1526109750944-B60PbQbvoeAzusHX51CthpnH');
  
  const params = { 
    channel: 'C017PFW6D1D',
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
      }
    ],
    attachments: [
      {
        "callback_id": "deploy-action",
        "text": "Can be reflected in the production",
        "actions": [
          {
            "name":  "Deploy",
            "text":  "Deploy",
            "type":  "button",
            "style": "primary"
          },
          {
            "name":  "Cancel",
            "text":  "Cancel",
            "type":  "button",
            "style": "danger"
          }
        ]
      }
    ]
  }
  console.log(params)

  await web.chat.postMessage(params).then(console.log).catch(console.error)
}

//import Slack from 'slack';
const { WebClient } = require('@slack/web-api');

//const token:   string = 'xoxb-1276255441778-1526109750944-ubOUX1DEpP5Sc1G3DlMEcgUJ'
//const channel: string = 'C017PFW6D1D'
//const text:    string = 'The image shown below has been uploaded'

exports.handler = async(event: any) => {
  var message = JSON.parse(JSON.parse(JSON.stringify(event.Records[0].Sns.Message)))

  console.log(message)

  const web = new WebClient('xoxb-1276255441778-1526109750944-ubOUX1DEpP5Sc1G3DlMEcgUJ');
  
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
//const Slack = require('slack');
//const slack = new Slack();
//import { WebClient } from '@slack/web-api';

//const webClient = new WebClient(token);

//exports.handler = async(event: any) => {
//
//  //var rp = require('request-promise');
//
//  //const API_URL: string = 'https://slack.com/api/chat.postMessage'
//  const token:   string = 'xoxb-1276255441778-1526109750944-ubOUX1DEpP5Sc1G3DlMEcgUJ'
//  const channel: string = 'C017PFW6D1D'
//  const text:    string = 'The image shown below has been uploaded'
//
//  var message = JSON.parse(JSON.parse(JSON.stringify(event.Records[0].Sns.Message)))
//  console.log(message)
//
//  /*
//  var repositoryName: string = message['detail']['repository-name']
//  var time:           string = message['time']
//  var actionType:     string = message['detail']['action-type']
//  var resultType:     string = message['detail']['result']
//  var imageTag:       string = message['detail']['image-tag']
//  */
//
//  let params = {
//    'token': token,
//    'channel': channel,
//    'text': text,
//    'blocks': [
//      {
//        "type": "section",
//        "fields": [
//          {
//            "type": "mrkdwn",
//            "text": "*Repository Name:*"
//          },
//          {
//            "type": "mrkdwn",
//            "text": message['detail']['repository-name']
//          },
//          {
//            "type": "mrkdwn",
//            "text": "*Time*:"
//          },
//          {
//            "type": "mrkdwn",
//            "text": message['time']
//          },
//          {
//            "type": "mrkdwn",
//            "text": "*Action Type:*"
//          },
//          {
//            "type": "mrkdwn",
//            "text": message['detail']['action-type']
//          },
//          {
//            "type": "mrkdwn",
//            "text": "*Result:*"
//          },
//          {
//            "type": "mrkdwn",
//            "text": message['detail']['result']
//          },
//          {
//            "type": "mrkdwn",
//            "text": "*Version:*"
//          },
//          {
//            "type": "mrkdwn",
//            "text": message['detail']['image-tag']
//          }
//        ]
//      }
//    ],
//    'attachments': [
//      {
//        "callback_id": "deploy-action",
//        "text": "Can be reflected in the production",
//        "actions": [
//          {
//            "name":  "Deploy",
//            "text":  "Deploy",
//            "type":  "button",
//            "style": "primary"
//          },
//          {
//            "name":  "Cancel",
//            "text":  "Cancel",
//            "type":  "button",
//            "style": "danger"
//          }
//        ]
//      }
//    ]
//  }
//
//  console.log(params)
//  Slack.chat.postMessage(params).then(console.log).catch(console.error);

/*
  let option = {
    'url': API_URL + "?token=" + token + "&channel=" + channel + "&text=" + text,
    'header': {
      'Content-Type': 'application/json;charset=UTF-8'
      //'Authorization': 'Bearer xoxp-1276255441778-1288881016257-1519379760519-6154c5297fc1917860dfc026c3c02b10'
    },
    'method': 'POST',
    'json': true,
    //'body': slack
  }

  let result = await rp(option).promise();
  console.log(result);
*/
//}

//exports.handler = async(event: any) => {
//  var rp      = require('request-promise');
//  var message = JSON.parse(JSON.parse(JSON.stringify(event.Records[0].Sns.Message)))
//  console.log(JSON.stringify(event));
//  console.log(event)
//  //const URL:     string = 'https://hooks.slack.com/services/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';
//  const URL:      string = 'https://hooks.slack.com/services/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';
//  const API_URL:  string = 'https://kagxd4svs7.execute-api.ap-northeast-1.amazonaws.com/slack/';
//  const POST_API: string = 'https://kagxd4svs7.execute-api.ap-northeast-1.amazonaws.com/slack';
//
//  let API_POST = {
//    'url': POST_API,
//    'header': {
//      'Content-Type': 'application/json',
//      'Authorization': 'Bearer xoxb-1276255441778-1526109750944-ubOUX1DEpP5Sc1G3DlMEcgUJ'
//    },
//    'method': 'POST',
//    'json': true,
//    'body': {
//      'blocks': [
//        {
//          'type': 'section',
//          'text': {
//            'type': 'mrkdwn',
//            'text': message
//          }
//        }
//      ]
//    }
//  }
//
//  let option = {
//    'url': URL,
//    'header': {
//      'Content-Type': 'application/json'
//    },
//    'method': 'POST',
//    'json': true,
//    'body': {
//      'blocks': [
//        {
//         'type': 'section',
//         'fields': [
//           {
//             'type': 'mrkdwn',
//             'text': '*Repository Name:*'
//           },
//           {
//             'type': 'mrkdwn',
//             'text': message['detail']['repository-name']
//           },
//           {
//             'type': 'mrkdwn',
//             'text': '*Time*:'
//           },
//           {
//             'type': 'mrkdwn',
//             'text': message['time']
//           },
//           {
//             'type': 'mrkdwn',
//             'text': '*Action Type:*'
//           },
//           {
//             'type': 'mrkdwn',
//             'text': message['detail']['action-type']
//           },
//           {
//             'type': 'mrkdwn',
//             'text': '*Result:*'
//           },
//           {
//             'type': 'mrkdwn',
//             'text': message['detail']['result']
//           },
//           {
//             'type': 'mrkdwn',
//             'text': '*Version:*'
//           },
//           {
//             'type': 'mrkdwn',
//             'text': message['detail']['image-tag']
//           }
//         ]
//        },
//        /*
//        {
//          'type': 'section',
//          'text': {
//            'type': 'mrkdwn',
//            'text': 'Reflect in the production environment.'
//          },
//          'accessory': {
//            'type': 'button',
//            'text': {
//              'type': 'plain_text',
//              'text': 'Deploy',
//              'emoji': true
//            },
//            'style': 'primary',
//            'value': 'deploy-action',
//            'action_id': 'deploy-action'
//          }
//        },
//        {
//         'type': 'section',
//         'text': {
//           'type': 'mrkdwn',
//           'text': 'Cancellation of updates.'
//         },
//         'accessory': {
//           'type': 'button',
//           'text': {
//             'type': 'plain_text',
//             'text': 'Cancel',
//             'emoji': true
//           },
//           'style': 'danger',
//           'value': 'cancel_123',
//           'action_id': 'cancel-action'
//         }
//        }
//        */
//       {
//         "type": "section",
//         "text": {
//           "type": "mrkdwn",
//           "text": "Can be reflected in the production"
//         }
//       },
//       {
//         "type": "actions",
//         "elements": [
//           {
//             "type": "button",
//             "text": {
//               "type": "plain_text",
//               "text": "Deploy",
//               "emoji": true
//             },
//             "style": "primary",
//             "action_id": "deploy-action"
//           },
//           {
//             "type": "button",
//             "text": {
//               "type": "plain_text",
//               "text": "Cancel",
//               "emoji": true
//             },
//             "style": "danger",
//             "action_id": "cancel-action"
//           }
//         ]
//        }
//      ]
//    }
//  };
//
//  let result = await rp(option).promise();
//  console.log(result);
//}

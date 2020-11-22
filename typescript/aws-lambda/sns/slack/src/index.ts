exports.handler = async(event: any) => {
  var rp      = require('request-promise');
  var message = JSON.parse(JSON.parse(JSON.stringify(event.Records[0].Sns.Message)))
  console.log(JSON.stringify(event));
  console.log(event)
  const URL:     string = 'https://hooks.slack.com/services/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';
  const API_URL: string = 'https://kagxd4svs7.execute-api.ap-northeast-1.amazonaws.com/Slack/';

  let option = {
    'url': URL,
    'header': {
      'Content-Type': 'application/json'
    },
    'method': 'POST',
    'json': true,
    'body': {
      'blocks': [
        {
         'type': 'section',
         'fields': [
           {
             'type': 'mrkdwn',
             'text': '*Repository Name:*'
           },
           {
             'type': 'mrkdwn',
             'text': message['detail']['repository-name']
           },
           {
             'type': 'mrkdwn',
             'text': '*Time*:'
           },
           {
             'type': 'mrkdwn',
             'text': message['time']
           },
           {
             'type': 'mrkdwn',
             'text': '*Action Type:*'
           },
           {
             'type': 'mrkdwn',
             'text': message['detail']['action-type']
           },
           {
             'type': 'mrkdwn',
             'text': '*Result:*'
           },
           {
             'type': 'mrkdwn',
             'text': message['detail']['result']
           },
           {
             'type': 'mrkdwn',
             'text': '*Version:*'
           },
           {
             'type': 'mrkdwn',
             'text': message['detail']['image-tag']
           }
         ]
        },
        {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': 'Reflect in the production environment.'
          },
          'accessory': {
            'type': 'button',
            'text': {
              'type': 'plain_text',
              'text': 'Deploy',
              'emoji': true
            },
            'style': 'primary',
            'value': 'deploy_123',
            'url': API_URL,
            'action_id': 'button-action'
          }
        },
        {
         'type': 'section',
         'text': {
           'type': 'mrkdwn',
           'text': 'Cancellation of updates.'
         },
         'accessory': {
           'type': 'button',
           'text': {
             'type': 'plain_text',
             'text': 'Cancel',
             'emoji': true
           },
           'style': 'danger',
           'value': 'cancel_123',
           'url': API_URL,
           'action_id': 'button-action'
         }
        }
      ]
    }
  };

  let result = await rp(option).promise();
  console.log(result);
}

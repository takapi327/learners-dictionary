exports.handler = async(event: any) => {
  var rp = require('request-promise');
  console.log(JSON.stringify(event));
  const URL: string = 'https://hooks.slack.com/services/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';

  let option = {
    'url': URL,
    'header': {
      'Content-Type': 'application/json'
    },
    'method': 'POST',
    'json': true,
    'body': {
      'text': event.Records[0].Sns.Message
    }
  };

  let result = await rp(option).promise();
  console.log(result);
}

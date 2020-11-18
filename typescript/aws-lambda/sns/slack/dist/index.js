"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
exports.handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var rp = require('request-promise');
    var message = JSON.parse(JSON.parse(JSON.stringify(event.Records[0].Sns.Message)));
    console.log(JSON.stringify(event));
    console.log(event);
    const URL = 'https://hooks.slack.com/services/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';
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
                        'url': 'https://google.com',
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
                        'url': 'https://google.com',
                        'action_id': 'button-action'
                    }
                }
            ]
        }
    };
    let result = yield rp(option).promise();
    console.log(result);
});

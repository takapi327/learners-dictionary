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
const { WebClient } = require('@slack/web-api');
const { createMessageAdapter } = require('@slack/interactive-messages');
const { qs } = require('qs');
const { axios } = require('axios');
const { App } = require('@slack/bolt');
const slackInteractions = createMessageAdapter('5db9d3349e7830b149daf815e84067e4');
const port = process.env.PORT || 3000;
const app = new App({
    token: process.env.SLACK_API_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});
exports.handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var message = JSON.parse(JSON.parse(JSON.stringify(event.Records[0].Sns.Message)));
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
        ],
        attachments: [
            {
                "callback_id": 'deploy_action',
                "text": "Can be reflected in the production",
                "actions": [
                    {
                        "name": "Deploy",
                        "text": "Deploy",
                        "type": "button",
                        "value": "deploy_action",
                    },
                    {
                        "name": "Cancel",
                        "text": "Cancel",
                        "type": "button",
                        "value": "cancel_action",
                    }
                ]
            }
        ]
    };
    yield web.chat.postMessage(params).catch(console.error);
});

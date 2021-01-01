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
Object.defineProperty(exports, "__esModule", { value: true });
const web_api_1 = require("@slack/web-api");
exports.handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var message = JSON.parse(JSON.parse(JSON.stringify(event.Records[0].Sns.Message)));
    const web = new web_api_1.WebClient(process.env.SLACK_API_TOKEN);
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
                        "value": "deploy_action"
                    },
                    {
                        "name": "Cancel",
                        "text": "Cancel",
                        "type": "button",
                        "value": "cancel_action"
                    }
                ]
            }
        ]
    };
    yield web.chat.postMessage(params).catch(console.error);
});

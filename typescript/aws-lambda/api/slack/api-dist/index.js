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
//const { WebClient } = require('@slack/bolt');
const web = new web_api_1.WebClient(process.env.SLACK_API_TOKEN);
exports.handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeMessage = decodeURIComponent(event.body).replace("payload=", "");
    const jsonDecodeMessage = JSON.parse(JSON.parse(JSON.stringify(decodeMessage)));
    const params = {
        channel: process.env.SLACK_CHANNEL,
        //ts: '1606633279.001200',
        ts: jsonDecodeMessage.message_ts,
        text: '',
        attachments: [
            {
                'text': 'イメージがアップされました'
            }
        ]
    };
    /*
    const params = {
      channel: process.env.SLACK_CHANNEL!,
      text: 'test',
      attachments: [
        {
          'text': 'ボタンアクションのテスト'
        }
      ]
    }
    */
    yield web.chat.update(params).catch(console.error);
    //await web.chat.postMessage(params).catch(console.error)
});

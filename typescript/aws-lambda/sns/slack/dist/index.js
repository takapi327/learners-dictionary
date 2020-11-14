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
    console.log(JSON.stringify(event));
    const URL = 'https://hooks.slack.com/services/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';
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
    let result = yield rp(option).promise();
    console.log(result);
});

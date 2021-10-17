"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitter = void 0;
const twitter_script_1 = require("../__vendor/twitter-script");
const twitter = ({ shouldRun }) => ({
    shouldRun,
    name: 'twitter',
    insertSnippet: twitter_script_1.twitterScript,
});
exports.twitter = twitter;

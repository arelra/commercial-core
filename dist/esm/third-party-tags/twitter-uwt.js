import { twitterScript as insertSnippet } from '../__vendor/twitter-script';
export const twitter = ({ shouldRun }) => ({
    shouldRun,
    name: 'twitter',
    insertSnippet,
});

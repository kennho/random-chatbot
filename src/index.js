/* Start of bootstrap code */
import 'babel-polyfill';
import bunyan from 'bunyan';
import express from 'express';
import botbuilder from 'botbuilder';

import config from './config';
import botConnector from './botConnector';

const server = express();
const log = bunyan.createLogger({
  name: 'index.js',
  serializers: bunyan.stdSerializers,
});
/* End of bootstrap code */

const chatBotName = 'Studious Potato';

log.info(`My chatbot: ${chatBotName}`);
log.info(`current environment ${process.env.NODE_ENV}`)

if (process.env.NODE_ENV == 'production') {
    server.post('/api/messages', botConnector.listen());
}

const bot = new botbuilder.UniversalBot(botConnector.listen());

bot.dialog('/', [
    function(session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    }, function(session) {
        session.send(`Hello ${session.userData.name}, I'm ${chatBotName}`);
    }
]);

bot.dialog("/profile", [
    function(session) {
        botbuilder.Prompts.text(session, "Hi! What is your name?");
    },
    function(session, results, next) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  log.info(`listening on port ${port}`);
});

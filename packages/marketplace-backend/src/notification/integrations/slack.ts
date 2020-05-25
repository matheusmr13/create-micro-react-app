const { WebClient } = require('@slack/web-api');

class SlackMessage {
  static async sendSimple(token: string, channelId: string, text: string) {
    SlackMessage.send(token, channelId, [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: text,
        },
      },
    ]);
  }
  static async send(token: string, channelId: string, blocks: any[]) {
    const web = new WebClient(token);
    const res = await web.chat.postMessage({
      channel: channelId,
      blocks,
    });
    return res;
  }

  blocks: any[];
  constructor(public token: string, public channelId: string) {
    this.blocks = [];
  }

  addText = (text: string) => {
    this.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: text,
      },
    });
    return this;
  };
  addSeparator = () => {
    this.blocks.push({
      type: 'divider',
    });
    return this;
  };

  send = () => {
    SlackMessage.send(this.token, this.channelId, this.blocks);
  };
}

export default SlackMessage;

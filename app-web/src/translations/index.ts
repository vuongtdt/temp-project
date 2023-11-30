let localMessages: {[key:string]: string};

export function setMessages(messages: {[key:string]: string}): void{
    localMessages = messages;
}
/**
 * @description use useIntl hook for functional component or context.intl.formatMessage for class component instead
 * @param key 
 * @param defaultMessage 
 */

export default function translate(key: string, defaultMessage: string){
    if(!localMessages) return '';
    const message = localMessages[key] || defaultMessage;
    // if(!localMessages[key])
    // console.error('DEFAULT MESSAGE USED FOR KEY','\n\n',key);
    return message;
}
import { info as InfoNotification } from '@global/NotificationPlugin';

export default function useClipboard() {
  const copyTo = (value: string, message = 'Copied to clipboard') => {
    const el = document.createElement('textarea');
    el.value = value;

    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    InfoNotification(message);
  };

  return {
    copyTo,
  };
}

import { useEffect } from 'react';
import { EventCallback, listen } from '@tauri-apps/api/event';

export const useListenTauriEvent = (eventName: string, callback: EventCallback<unknown>) =>
  useEffect(() => {
    const unListen = listen(eventName, callback);
    return () => {
      unListen.then((f) => f());
    };
  }, []);

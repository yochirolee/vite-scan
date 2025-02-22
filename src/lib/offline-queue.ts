interface QueueItem {
  type: string;
  data: any;
  timestamp: string;
}

export function createOfflineQueue() {
  const QUEUE_KEY = 'offline_queue';
  
  function getQueue(): QueueItem[] {
    const queue = localStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  }

  function saveQueue(queue: QueueItem[]) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  return {
    add(item: QueueItem) {
      const queue = getQueue();
      queue.push(item);
      saveQueue(queue);
    },

    async processQueue() {
      if (!navigator.onLine) return;

      const queue = getQueue();
      if (!queue.length) return;

      const newQueue = [];

      for (const item of queue) {
        try {
          await api[item.type](item.data);
        } catch (error) {
          newQueue.push(item);
        }
      }

      saveQueue(newQueue);
    },

    clear() {
      localStorage.removeItem(QUEUE_KEY);
    }
  };
} 
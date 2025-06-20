import { AdvisorMessage, AdvisorThread } from '../types';

export interface AdvisorService {
  openThread: () => Promise<AdvisorThread>;
  sendMessage: (threadId: string, content: string) => Promise<AdvisorMessage>;
  subscribeToThread: (
    threadId: string,
    onMessage: (msg: AdvisorMessage) => void
  ) => () => void; // returns unsubscribe
}

class MockAdvisorService implements AdvisorService {
  private threads: AdvisorThread[] = [];

  async openThread(): Promise<AdvisorThread> {
    const thread: AdvisorThread = {
      id: 'thread-' + Math.random().toString(36).substring(2),
      userId: 'user-mock',
      messages: [],
      isEscalated: false,
    };
    this.threads.push(thread);
    return thread;
  }

  async sendMessage(
    threadId: string,
    content: string
  ): Promise<AdvisorMessage> {
    const thread = this.threads.find((t) => t.id === threadId);
    if (!thread) throw new Error('Thread not found');
    const msg: AdvisorMessage = {
      id: 'msg-' + Math.random().toString(36).substring(2),
      sender: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    thread.messages.push(msg);
    return msg;
  }

  subscribeToThread(
    _threadId: string,
    _onMessage: (msg: AdvisorMessage) => void
  ): () => void {
    // mock – returns noop unsubscribe
    return () => {};
  }
}

export const advisorService: AdvisorService = new MockAdvisorService();

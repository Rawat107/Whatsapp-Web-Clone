const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiService = {
  async getConversations() {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations`);
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },

  async getMessages(conversationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`);
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  async sendMessage(conversationId, text) {
    try {
      const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};
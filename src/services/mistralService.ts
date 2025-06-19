
interface MistralMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface MistralResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

class MistralService {
  private apiKey = 'EpIboBOjtlU82c9Fn3YeaaXDpFBz2ymg';
  private apiUrl = 'https://api.mistral.ai/v1/chat/completions';

  async sendMessage(userMessage: string, conversationHistory: MistralMessage[] = []): Promise<string> {
    try {
      const messages: MistralMessage[] = [
        {
          role: 'system',
          content: 'Você é o Chat-Boy, o assistente inteligente oficial do Chathy. Você é amigável, prestativo e sempre disponível para ajudar os usuários com suas dúvidas sobre o app ou conversas em geral. Responda de forma natural e conversacional em português brasileiro.'
        },
        ...conversationHistory,
        {
          role: 'user',
          content: userMessage
        }
      ];

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-small-latest',
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data: MistralResponse = await response.json();
      return data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';
    } catch (error) {
      console.error('Erro ao comunicar com Mistral:', error);
      return 'Ops! Estou com problemas para responder agora. Tente novamente em alguns instantes.';
    }
  }
}

export const mistralService = new MistralService();

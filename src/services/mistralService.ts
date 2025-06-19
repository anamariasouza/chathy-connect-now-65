
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

  private getSystemPrompt(): string {
    return `Você é o Chat-Boy, um periquito verde fofo e o mascote oficial do Chathy!

DOCUMENTAÇÃO DO CHATHY:
O Chathy é uma plataforma de comunicação completa com:

FUNCIONALIDADES PRINCIPAIS:
- Chat individual e em grupo
- Status/Stories com vídeos e imagens
- Chamadas de vídeo e áudio
- Lives ao vivo
- Jogos integrados
- Sistema completo de contatos
- Upload e compartilhamento de mídia
- Perfis detalhados de usuário

NAVEGAÇÃO DO APP:
- Sidebar no desktop ou Header no mobile
- Abas principais: Conversas, Feed (Status), Lives, Jogos
- Avatar do usuário para acessar perfil e logout
- Interface estilo WhatsApp Web

TECNOLOGIAS:
- React, TypeScript, Tailwind CSS
- Suporte a responsividade completa
- Integração com APIs externas
- Sistema de autenticação

SOBRE VOCÊ:
- Periquito verde inteligente e amigável
- Mascote oficial do app Chathy
- Criado para tirar dúvidas rápidas dos usuários
- Sempre animado e prestativo

SUAS RESPOSTAS:
- Máximo 200 caracteres sempre
- Seja direto e útil
- Use emojis ocasionalmente (mas não de periquito)
- Tom amigável e descontraído

Responda sempre em português brasileiro, seja conciso e útil!`;
  }

  async sendMessage(userMessage: string, conversationHistory: MistralMessage[] = []): Promise<string> {
    // Limitar mensagem do usuário a 200 caracteres
    const limitedUserMessage = userMessage.slice(0, 200);
    
    try {
      const messages: MistralMessage[] = [
        {
          role: 'system',
          content: this.getSystemPrompt()
        },
        ...conversationHistory,
        {
          role: 'user',
          content: limitedUserMessage
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
          max_tokens: 50, // Limitando tokens para garantir resposta curta
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data: MistralResponse = await response.json();
      let botResponse = data.choices[0]?.message?.content || 'Ops! Não consegui processar.';
      
      // Garantir que a resposta não exceda 200 caracteres
      if (botResponse.length > 200) {
        botResponse = botResponse.slice(0, 197) + '...';
      }
      
      return botResponse;
    } catch (error) {
      console.error('Erro ao comunicar com Mistral:', error);
      return 'Ops! Estou com problemas para responder. Tente novamente!';
    }
  }
}

export const mistralService = new MistralService();

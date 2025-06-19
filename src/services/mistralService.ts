
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
    return `Você é o Chat-Boy, o assistente inteligente oficial do Chathy. Você é amigável, prestativo e sempre disponível para ajudar os usuários com suas dúvidas sobre o app ou conversas em geral. Responda de forma natural e conversacional em português brasileiro.

DOCUMENTAÇÃO DO APP CHATHY:

O Chathy é um aplicativo de mensagens moderno similar ao WhatsApp, com as seguintes funcionalidades principais:

FUNCIONALIDADES:
- Chat individual e em grupo
- Status/Stories (Feed de vídeos)
- Chamadas de vídeo e voz (Lives)
- Jogos integrados
- Sistema de contatos
- Upload de mídia
- Perfis de usuário

NAVEGAÇÃO:
- Sidebar com menu principal (Desktop) ou Header (Mobile)
- Abas: Conversas, Status, Calls, Jogos
- Perfil do usuário acessível pelo avatar
- Botão de logout disponível

RECURSOS ESPECIAIS:
- Chat-Boy (você) sempre disponível como contato fixo
- Interface adaptável (responsiva)
- Tema claro (estilo WhatsApp Web)
- Sistema de autenticação

COMO USAR:
- Para iniciar uma conversa: selecionar contato na lista
- Para ver status: aba "Status" com vídeos dos contatos
- Para fazer chamadas: aba "Calls"
- Para jogar: aba "Jogos"
- Para ver perfil: clicar no avatar
- Para sair: botão de logout

Sempre ajude os usuários com dúvidas sobre estas funcionalidades e seja prestativo em conversas gerais.`;
  }

  async sendMessage(userMessage: string, conversationHistory: MistralMessage[] = []): Promise<string> {
    try {
      const messages: MistralMessage[] = [
        {
          role: 'system',
          content: this.getSystemPrompt()
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

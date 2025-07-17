import axios from 'axios';

interface AIResponse {
  answer: string;
  confidence: number;
  sources?: string[];
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AIService {
  private apiKey: string;
  private model: string;
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey: string, model: string = 'gpt-3.5-turbo') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateAnswer(question: string, category: string): Promise<AIResponse> {
    try {
      const prompt = this.createPrompt(question, category);
      
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: '学生の学習支援を行うAI教師です。分かりやすく、教育的な回答を心がけてください。回答は日本語で、高校生や大学生にとって理解しやすい内容にしてください。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
          presence_penalty: 0.6,
          frequency_penalty: 0.5,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const answer = response.data.choices[0].message.content;
      const confidence = this.calculateConfidence(response.data.choices[0]);

      return {
        answer,
        confidence,
      };
    } catch (error: any) {
      console.error('AI Service Error:', error.response?.data || error.message);
      throw new Error('AI回答の生成に失敗しました');
    }
  }

  async categorizeQuestion(question: string): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'あなたは質問を分類する専門家です。質問を以下のカテゴリーのいずれかに分類してください: study(学習), career(キャリア), exam(大学受験), other(その他)。カテゴリー名のみを回答してください。'
            },
            {
              role: 'user',
              content: question
            }
          ],
          temperature: 0.3,
          max_tokens: 10,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const category = response.data.choices[0].message.content.trim().toLowerCase();
      return ['study', 'career', 'exam'].includes(category) ? category : 'other';
    } catch (error) {
      console.error('Category detection error:', error);
      return 'other';
    }
  }

  private createPrompt(question: string, category: string): string {
    const categoryMap: { [key: string]: string } = {
      study: '学習',
      career: 'キャリア',
      exam: '大学受験',
      other: 'その他'
    };

    return `
カテゴリー: ${categoryMap[category] || category}
質問: ${question}

この質問に対して、以下の点を考慮して回答してください：
1. 高校生や大学生にとって分かりやすい説明
2. 具体的な例や方法の提示
3. 実践的なアドバイス
4. 励ましやモチベーションを高める要素

回答は500文字以内でまとめてください。
    `.trim();
  }

  private calculateConfidence(choice: any): number {
    // 信頼度の計算ロジック
    if (choice.finish_reason === 'stop') {
      // 正常に完了した場合
      const logprobs = choice.logprobs;
      if (logprobs && logprobs.top_logprobs) {
        // ログ確率に基づく信頼度計算
        const avgLogprob = logprobs.top_logprobs.reduce((sum: number, lp: any) => {
          return sum + Math.exp(Object.values(lp)[0] as number);
        }, 0) / logprobs.top_logprobs.length;
        return Math.min(0.95, avgLogprob);
      }
      return 0.85;
    } else if (choice.finish_reason === 'length') {
      // トークン制限に達した場合
      return 0.65;
    }
    // その他の場合
    return 0.5;
  }

  async followUpQuestion(
    originalQuestion: string,
    answer: string,
    followUp: string
  ): Promise<AIResponse> {
    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: '学生の学習支援を行うAI教師です。前の質問と回答を踏まえて、フォローアップの質問に答えてください。'
        },
        {
          role: 'user',
          content: originalQuestion
        },
        {
          role: 'assistant',
          content: answer
        },
        {
          role: 'user',
          content: followUp
        }
      ];

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          }
        }
      );

      return {
        answer: response.data.choices[0].message.content,
        confidence: this.calculateConfidence(response.data.choices[0]),
      };
    } catch (error) {
      console.error('Follow-up question error:', error);
      throw new Error('フォローアップ回答の生成に失敗しました');
    }
  }
}

// シングルトンパターンでのエクスポート
let aiServiceInstance: AIService | null = null;

export const getAIService = (apiKey: string, model?: string): AIService => {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService(apiKey, model);
  }
  return aiServiceInstance;
};
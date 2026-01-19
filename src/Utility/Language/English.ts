import { ILanguage } from './ILanguage';

export class English implements ILanguage {
  GetQuestion(statement: string): string {
    throw new Error('Method not implemented.');
  }
  GetStatement(question: string): string {
    throw new Error('Method not implemented.');
  }
  GetQuestionAnswerMap(content: string): Record<string, string> {
    throw new Error('Method not implemented.');
  }

}

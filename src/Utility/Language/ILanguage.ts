export interface ILanguage {
  GetQuestion(statement: string): string;
  GetStatement(question: string): string;
  GetQuestionAnswerMap(content: string): Record<string, string>;
}

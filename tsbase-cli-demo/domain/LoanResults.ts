export class AmortizationSchedule {
  public indexNumber = 0;
  public beginningBalance = 0;
  public interest = 0;
  public principal = 0;
  public endingBalance = 0;
}

export enum LoanFrequency {
  Yearly = 1,
  Monthly = 12,
  Weekly = 52
}

export class LoanItem {
  public principalAmount = 0;
  public numberOfPayments = 0;
  public interestRate = 0;
  public paymentAmount = 0;
  public loanFrequency: LoanFrequency = 12;
}

export class ValidationResultsItem {
  public argument = '';
  public message = '';
}

export class LoanResults {
  public paymentAmount = 0;
  public totalInterest = 0;
  public totalCost = 0;
  public totalPrincipal = 0;
  public amortizationMonthlySchedule = new Array<AmortizationSchedule>();
  public amortizationYearlySchedule = new Array<AmortizationSchedule>();
  public loanItem = new LoanItem();
  public validationResultsItemList = new Array<ValidationResultsItem>();
}
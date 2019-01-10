#!/usr/bin/env node

import { List, NodeXhrRequestHandler, JsonSerializer } from 'tsbase';
import { HttpClient } from 'tsbase';
import { LoanResults } from './domain/LoanResults';

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const inquirer = require('inquirer');

class Program {
  static Main() {
    console.log('Welcome to the tsbase CLI test app!\n\n');
    this.hanldeHttpRequest();
  }

  static hanldeHttpRequest(): void {
    const questions = [
      {
        type: 'input',
        name: 'principal',
        message: "Enter principal"
      },
      {
        type: 'input',
        name: 'term',
        message: "Enter term"
      },
      {
        type: 'input',
        name: 'apr',
        message: "Enter apr"
      },
      {
        type: 'input',
        name: 'frequency',
        message: "Enter frequency in months"
      }
    ];
    inquirer.prompt(questions).then(answers => {
      // this.printResponseFrom(`${answers['base']}/${answers['uri']}`);
      this.printResponseFrom(`Loan/Results?principal=${answers['principal']}&term=${answers['term']}&apr=${answers['apr']}&frequency=${answers['frequency']}`);
    });
  }

  static async printResponseFrom(uri: string) {
    // Get data
    const xhrRequestHandler = new NodeXhrRequestHandler();
    const client = new HttpClient(xhrRequestHandler);
    xhrRequestHandler.HttpClient = client;
    client.BaseAddress = 'https://prod-wbcw-api.azurewebsites.net/api';
    const response = await client.GetStringAsync(uri);

    // Serialize and use instance
    const serializer = new JsonSerializer<LoanResults>();
    const loanResults: LoanResults = serializer.Serialize(LoanResults, JSON.parse(response));
    for (const element of loanResults.amortizationYearlySchedule) {
      console.log(element);
    }
  }
}

Program.Main();

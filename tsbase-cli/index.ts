#!/usr/bin/env node

import { List, NodeXhrRequestHandler, JsonSerializer } from 'tsbase';
import { HttpClient } from 'tsbase';

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
        name: 'uri',
        message: "Type a uri"
      }
    ];
    inquirer.prompt(questions).then(answers => {
      this.printResponseFrom(answers['uri']);
    });
  }

  static async printResponseFrom(uri: string) {
    // Get data
    const xhrRequestHandler = new NodeXhrRequestHandler();
    const client = new HttpClient(xhrRequestHandler);
    xhrRequestHandler.HttpClient = client;
    client.BaseAddress = 'https://foaas.com';
    const response = await client.GetStringAsync(uri);
    console.log(response);
  }
}

Program.Main();

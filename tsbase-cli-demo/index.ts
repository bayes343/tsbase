#!/usr/bin/env node

import { List, NodeXhrRequestHandler } from 'tsbase';
import { HttpClient } from 'tsbase';

class Program {
  static Main(): number {
    // this.testList();
    this.testHttpClient();
    return 0;
  }

  static testList(): void {
    var list = new List<string>();
    list.AddRange(['a', 'b', 'c', 'd']);
    list.Reverse();
    list.Sort();
    list.RemoveRange(1, 2);
    console.log(list.Item.toString());
  }

  static async testHttpClient() {
    const xhrRequestHandler = new NodeXhrRequestHandler();
    const client = new HttpClient(xhrRequestHandler);
    xhrRequestHandler.HttpClient = client;
    client.BaseAddress = 'https://foaas.com';
    const response = await client.GetStringAsync('cup/Joe');
    console.log(response);
  }
}

Program.Main();

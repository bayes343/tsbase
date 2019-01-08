#!/usr/bin/env node

import { List } from 'tsbase';
import { HttpClient } from 'tsbase';

class Program {
  static Main(): number {
    this.testList();
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
}

Program.Main();

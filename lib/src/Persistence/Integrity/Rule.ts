import { Severity } from './Severity';

export class Rule<T> {
  constructor(
    public ComplianceTest: (item: T) => boolean,
    public Severity: Severity,
    public Description: string
  ) { }
}

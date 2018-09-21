import {regex as reg, Reuse, IRunnable} from "../combi";

export class NamespaceSimpleName extends Reuse {
  public get_runnable(): IRunnable {
    return reg(/^((\w*\/\w+\/)|(\w*\/\w+\/)?[\w%]+)$/);
  }
}
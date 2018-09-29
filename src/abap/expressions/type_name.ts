import {seq, alt, str, opt, tok, regex as reg, Reuse, IRunnable} from "../combi";
import {Arrow, Dash} from "../tokens/";

export class TypeName extends Reuse {
  public get_runnable(): IRunnable {
    let name = reg(/^(\/\w+\/)?\w+$/);
    let cla = seq(name, tok(Arrow));
    let field = seq(tok(Dash), name);
    return alt(seq(opt(cla), name, opt(field)), str("#"));
  }
}
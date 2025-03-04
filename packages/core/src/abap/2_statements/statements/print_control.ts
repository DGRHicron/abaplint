import {IStatement} from "./_statement";
import {verNot, seq, per} from "../combi";
import {Source} from "../expressions";
import {Version} from "../../../version";
import {IStatementRunnable} from "../statement_runnable";

export class PrintControl implements IStatement {

  public getMatcher(): IStatementRunnable {
    const index = seq("INDEX-LINE", Source);
    const func = seq("FUNCTION", Source);
    const line = seq("LINE", Source);
    const position = seq("POSITION", Source);
    const size = seq("SIZE", Source);
    const cpi = seq("CPI", Source);
    const lpi = seq("LPI", Source);
    const font = seq("FONT", Source);

    const ret = seq("PRINT-CONTROL", per(index, func, line, position, size, cpi, lpi, font));

    return verNot(Version.Cloud, ret);
  }

}
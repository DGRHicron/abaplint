import {statementType} from "../utils";
import * as Statements from "../../src/abap/statements/";

let tests = [
  "TEST-INJECTION seoredef.",
];

statementType(tests, "TEST-INJECTION", Statements.TestInjection);
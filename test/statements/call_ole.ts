import {statementType} from "../utils";
import * as Statements from "../../src/abap/statements/";

let tests = [
  "CALL METHOD OF lv_charts 'Add'.",
  "CALL METHOD OF io_app_obj 'Run' EXPORTING foo = bar.",
  "CALL METHOD OF io_app_obj 'Run' EXPORTING foo = 'sdf'.",
  "CALL METHOD OF io_app_obj 'Run' EXPORTING #1 = 'sdf'.",
  "CALL METHOD OF io_app_obj 'Run' EXPORTING #1 = 'MAIN.start' #2 = 'From SAP'.",
  "CALL METHOD OF lo_docs 'Open' = cv_ole_doc EXPORTING #1 = cv_fullpath.",
];

statementType(tests, "CALL METHOD OF", Statements.CallOLE);
import {statementType} from "../_utils";
import * as Statements from "../../../src/abap/2_statements/statements";

const tests = [
  "SELECTION-SCREEN BEGIN OF BLOCK b1 WITH FRAME TITLE TEXT-001.",
  "SELECTION-SCREEN BEGIN OF BLOCK 1 WITH FRAME TITLE TEXT-001.",
  "SELECTION-SCREEN BEGIN OF SCREEN 1001.",
  "SELECTION-SCREEN BEGIN OF LINE.",
  "SELECTION-SCREEN END OF LINE.",
  "SELECTION-SCREEN FUNCTION KEY 1.",
  "SELECTION-SCREEN SKIP 1.",
  "selection-screen uline.",
  "SELECTION-SCREEN BEGIN OF SCREEN 120 AS SUBSCREEN NO INTERVALS.",
  "SELECTION-SCREEN BEGIN OF BLOCK object WITH FRAME TITLE title NO INTERVALS.",
  "SELECTION-SCREEN SKIP.",
  "SELECTION-SCREEN INCLUDE BLOCKS b6.",
  "SELECTION-SCREEN BEGIN OF TABBED BLOCK block FOR 20 LINES.",
  "SELECTION-SCREEN COMMENT 28(6) text-215 MODIF ID f11 FOR FIELD value1.",
  "SELECTION-SCREEN TAB (15) tab1 USER-COMMAND u1 DEFAULT SCREEN 100.",
  "SELECTION-SCREEN BEGIN OF SCREEN 2000 AS WINDOW TITLE TEXT-001.",
  "SELECTION-SCREEN POSITION 33.",
  "SELECTION-SCREEN POSITION POS_LOW.",
  "SELECTION-SCREEN POSITION POS_HIGH.",
  "SELECTION-SCREEN BEGIN OF BLOCK blo WITH FRAME.",
  "SELECTION-SCREEN BEGIN OF SCREEN 400 AS SUBSCREEN.",
  "SELECTION-SCREEN END OF BLOCK b1.",
  "SELECTION-SCREEN COMMENT (60) cmt_dump FOR FIELD cb_dump.",
  "SELECTION-SCREEN COMMENT (30) FOR FIELD p_del.",
  "SELECTION-SCREEN COMMENT 5(13) text-002 FOR FIELD p_non.",
  "selection-screen comment (24) txt_path  for field p_path  modif id pth.",
  "SELECTION-SCREEN BEGIN OF SCREEN 1002 TITLE s_title.",
  "SELECTION-SCREEN COMMENT /1(35) text-001.",
  "SELECTION-SCREEN BEGIN OF SCREEN 1000 AS SUBSCREEN NESTING LEVEL 3.",
  "selection-screen begin of screen 4000 title title as window.",
  "SELECTION-SCREEN BEGIN OF TABBED BLOCK tab1 FOR 10 LINES NO INTERVALS.",
  "selection-screen pushbutton /1(50) text-001 user-command us01.",
  "SELECTION-SCREEN ULINE /1(72).",
  "SELECTION-SCREEN TAB (20) button1 USER-COMMAND push1.",
  "SELECTION-SCREEN COMMENT 3(20) FOR FIELD fboo MODIF ID 004.",
  "SELECTION-SCREEN COMMENT (20) foo MODIF ID s3.",
  "SELECTION-SCREEN INCLUDE PARAMETERS param.",
  "SELECTION-SCREEN INCLUDE SELECT-OPTIONS so_user.",
  "SELECTION-SCREEN COMMENT 1(40) text-001 MODIF ID 1.",
  "SELECTION-SCREEN END OF BLOCK text-001.",
  "SELECTION-SCREEN PUSHBUTTON /01(40) foo USER-COMMAND push VISIBLE LENGTH 10.",
  "SELECTION-SCREEN PUSHBUTTON 1(10) foo USER-COMMAND 'FOOB'.",
  "SELECTION-SCREEN PUSHBUTTON 55(60) push USER-COMMAND cmd MODIF ID md1 VISIBLE LENGTH 20.",
  "SELECTION-SCREEN TAB (40) text-100 USER-COMMAND tab DEFAULT SCREEN 10.",
  "SELECTION-SCREEN COMMENT 3(20) FOR FIELD l_var VISIBLE LENGTH 20.",
  "SELECTION-SCREEN PUSHBUTTON pos(18) p_foo USER-COMMAND foo.",
  "SELECTION-SCREEN BEGIN OF BLOCK loo WITH FRAME TITLE TEXT-loo.",
  "SELECTION-SCREEN TAB (30) name USER-COMMAND 1234 DEFAULT SCREEN 1234 MODIF ID foo.",
  `SELECTION-SCREEN TAB (20) nam USER-COMMAND push1 DEFAULT PROGRAM zfoobar SCREEN 1.`,
  `SELECTION-SCREEN COMMENT 1(20) foo FOR FIELD ?foo.`,
];

statementType(tests, "SELECTION-SCREEN", Statements.SelectionScreen);
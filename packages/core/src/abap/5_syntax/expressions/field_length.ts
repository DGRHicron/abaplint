import * as Expressions from "../../2_statements/expressions";
import {ExpressionNode} from "../../nodes";
import {CurrentScope} from "../_current_scope";
import {ReferenceType} from "../_reference";
import {FieldChain} from "./field_chain";

export class FieldLength {
  public runSyntax(node: ExpressionNode, scope: CurrentScope, filename: string): number | undefined {

    const field = node.findDirectExpression(Expressions.SimpleFieldChain2);
    if (field) {
      new FieldChain().runSyntax(field, scope, filename, ReferenceType.DataReadReference);
      return undefined;
    } else {
      const children = node.getChildren();
      const num = children[children.length - 2];
      if (num.getLastToken().getStr() === "*") {
        return undefined;
      }
      return parseInt(num.getLastToken().getStr(), 10);
    }

  }
}
import {Identifier} from "../4_file_information/_identifier";
import {IAttributes} from "./_class_attributes";
import {ITypeDefinitions} from "./_type_definitions";
import {IEventDefinition} from "./_event_definition";
import {IMethodDefinitions} from "./_method_definitions";
import {Alias} from "./alias";

export interface IImplementing {
  name: string;
  partial: boolean;
}

export interface IInterfaceDefinition extends Identifier {
  getAttributes(): IAttributes;
  getTypeDefinitions(): ITypeDefinitions;
  getMethodDefinitions(): IMethodDefinitions;
  getEvents(): readonly IEventDefinition[];
  isGlobal(): boolean;
  getSuperClass(): string | undefined;
  getAliases(): readonly Alias[];
  getImplementing(): readonly IImplementing[];
}
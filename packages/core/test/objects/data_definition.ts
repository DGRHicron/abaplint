import {expect} from "chai";
import {Registry} from "../../src/registry";
import {MemoryFile} from "../../src/files/memory_file";
import {DataDefinition} from "../../src/objects";
import {StructureType, VoidType} from "../../src/abap/types/basic";

describe("Object: DDLS - Data Definition", () => {

  it("Get view name", async () => {
    const xml = `
<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_DDLS" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <DDLS>
    <DDLNAME>ZAG_UNIT_TEST</DDLNAME>
    <DDLANGUAGE>E</DDLANGUAGE>
    <DDTEXT>Hello World</DDTEXT>
    <SOURCE_TYPE>V</SOURCE_TYPE>
   </DDLS>
  </asx:values>
 </asx:abap>
</abapGit>`;
    const source = `
@AbapCatalog.sqlViewName: 'ZAG_UNIT_TEST_V'
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Hello World,.:'
define view ZAG_UNIT_TEST
  as select from tadir
{
  pgmid,
  object,
  obj_name
}`;
    const reg = new Registry().addFiles([
      new MemoryFile("zag_unit_test.ddls.xml", xml),
      new MemoryFile("zag_unit_test.ddls.asddls", source),
    ]);
    await reg.parseAsync();
    const ddls = reg.getFirstObject()! as DataDefinition;
    expect(ddls).to.not.equal(undefined);
    expect(ddls.getSQLViewName()).to.equal("ZAG_UNIT_TEST_V");

    const type = ddls.parseType(reg);
    expect(type).to.be.instanceof(StructureType);
    if (type instanceof StructureType) {
      expect(type.getComponents().length).to.equal(3);
    }
    expect(ddls.getDescription()).to.equal("Hello World,.:");
  });

  it("Get fields", async () => {
    const source = `
@AbapCatalog.sqlViewName: 'ZAG_UNIT_TEST_V'
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Hello World'
define view ZAG_UNIT_TEST
  as select from tadir
{
  tadir.pgmid,
  tadir.object,
  tadir.obj_name
}`;
    const reg = new Registry().addFiles([
      new MemoryFile("zag_unit_test.ddls.asddls", source),
    ]);
    await reg.parseAsync();
    const ddls = reg.getFirstObject()! as DataDefinition;
    expect(ddls).to.not.equal(undefined);

    const type = ddls.parseType(reg);
    expect(type).to.be.instanceof(StructureType);
    if (type instanceof StructureType) {
      expect(type.getComponents().length).to.equal(3);
    }
  });

  it("Get fields, associations are not fields", async () => {
    const source = `
@AbapCatalog.sqlViewName: '/FOO/BAR'
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Hello World'
define view ZAG_UNIT_TEST
  as select from tadir
  association [0..*] to zsdfdsfds as _assoc on _User.BusinessRoleUUID = $projection.BusinessRoleUUID
{
  tadir.pgmid,
  tadir.object,
  tadir.obj_name,
  _assoc
}`;
    const reg = new Registry().addFiles([
      new MemoryFile("zag_unit_test.ddls.asddls", source),
    ]);
    await reg.parseAsync();
    const ddls = reg.getFirstObject()! as DataDefinition;
    expect(ddls).to.not.equal(undefined);

    const type = ddls.parseType(reg);
    expect(type).to.be.instanceof(StructureType);
    if (type instanceof StructureType) {
      expect(type.getComponents().length).to.equal(3);
    }

    expect(ddls.getSQLViewName()).to.equal("/FOO/BAR");
  });

  it("Get get field names", async () => {
    const source = `
define view C_FooBar as select from I_Bar {
    @Search.defaultSearchElement : true
    @ObjectModel.text.element: ['DateFunctionName']
    key DateFunction,
    @Search.defaultSearchElement : true
    _Datefunction._DateFunctionText[1: Language = $session.system_language].DateFunctionName,
    @Search.defaultSearchElement : true
    _Datefunction._DateFunctionText[1: Language = $session.system_language].DateFunctionDescription,
    DateFunctionStartDate,
    DateFunctionEndDate
}`;
    const reg = new Registry().addFiles([
      new MemoryFile("zag_unit_test.ddls.asddls", source),
    ]);
    await reg.parseAsync();
    const ddls = reg.getFirstObject()! as DataDefinition;
    expect(ddls).to.not.equal(undefined);

    const parsed = ddls.getParsedData();
    expect(parsed?.fields.length).to.equal(5);
    expect(parsed?.fields[0].annotations.length).to.equal(2);
    expect(parsed?.fields[0].key).to.equal(true);
    expect(parsed?.fields[1].key).to.equal(false);

    const type = ddls.parseType(reg);
    expect(type).to.be.instanceof(StructureType);
    if (type instanceof StructureType) {
      const components = type.getComponents();
      expect(components.length).to.equal(5);
      expect(components[0].name).to.equal("DateFunction");
      expect(components[1].name).to.equal("DateFunctionName");
    }

    expect(ddls.getDefinitionName()).to.equal("C_FooBar");
  });

  it("get name", async () => {
    const source = `
@Analytics: {dataExtraction.enabled: true}

define view i_name as select from t006b
{
  key Language,
  key UnitOfMeasureCommercialName,
      UnitOfMeasure
}`;
    const reg = new Registry().addFiles([
      new MemoryFile("i_name.ddls.asddls", source),
    ]);
    await reg.parseAsync();
    const ddls = reg.getFirstObject()! as DataDefinition;
    expect(ddls).to.not.equal(undefined);
    expect(ddls.getDefinitionName()).to.equal("i_name");
  });

  it("get name, namespaced", async () => {
    const source = `
define view /foo/bar as select from t006b
{
  key Language,
  key UnitOfMeasureCommercialName,
      UnitOfMeasure
}`;
    const reg = new Registry().addFiles([
      new MemoryFile("#foo#bar.ddls.asddls", source),
    ]);
    await reg.parseAsync();
    const ddls = reg.getFirstObject()! as DataDefinition;
    expect(ddls).to.not.equal(undefined);
    expect(ddls.getDefinitionName()).to.equal("/foo/bar");
  });

  it("parse, double redirect to same name", async () => {
    const source = `
define view entity I_foo1 as projection on I_foo2
{
  key     Field1,
          _Foo : redirected to I_sdfsd,
          _Bar : redirected to parent I_sdfsd
}`;
    const reg = new Registry().addFiles([
      new MemoryFile("#foo#bar.ddls.asddls", source),
    ]);
    await reg.parseAsync();
    const ddls = reg.getFirstObject()! as DataDefinition;
    expect(ddls).to.not.equal(undefined);
    ddls.parseType(reg);
  });

  it("parse type, union", async () => {
    const source = `
@Metadata.ignorePropagatedAnnotations: true
define view entity ZCDS_union as select from ztopfoo {
    field1 as something
} union select from ztopfoo {
    field1 as something
}`;
    const reg = new Registry().addFiles([
      new MemoryFile("zcds_union.ddls.asddls", source),
    ]);
    await reg.parseAsync();
    const ddls = reg.getFirstObject()! as DataDefinition;
    expect(ddls).to.not.equal(undefined);
    const parsed = ddls.parseType(reg) as StructureType;
    expect(parsed.getComponents().length).to.equal(1);
  });

  it("projection, fields", async () => {
    const source = `
@EndUserText.label: 'View blah'
@AccessControl.authorizationCheck: #CHECK
define root view entity /foo/b_ar001 as projection on /foo/b_ar001 {
    key blah,
    field1,
    field2
}`;
    const reg = new Registry().addFiles([
      new MemoryFile("#foo#b_ar001.ddls.asddls", source),
    ]);
    await reg.parseAsync();
    const ddls = reg.getFirstObject()! as DataDefinition;
    expect(ddls).to.not.equal(undefined);
    const parsed = ddls.parseType(reg) as StructureType;
    expect(parsed.getComponents().length).to.equal(3);
  });

  it("get source", async () => {
    const source = `
define view /FOO/GL_BAR
  as select from /foo/gl_foo
{
  key bukrs      as CompanyCode,
  key valid_from as ValidFrom
}`;
    const reg = new Registry().addFiles([
      new MemoryFile("#foo#gl_bar.ddls.asddls", source),
    ]);
    await reg.parseAsync();
    const ddls = reg.getFirstObject()! as DataDefinition;
    expect(ddls).to.not.equal(undefined);
    const sources = ddls.listSources();
    expect(sources?.length).to.equal(1);
    expect(sources![0].name).to.equal("/FOO/GL_FOO");
    expect(sources![0].as).to.equal(undefined);
  });

  it("get source, as'ed", async () => {
    const source = `
define view ZAG_UNIT_TEST as select from ZAG_NO_DTEL as a{
  a.field1,
  a.field2
}`;

    const reg = new Registry().addFiles([
      new MemoryFile("zag_unit_test.ddls.asddls", source),
    ]);

    reg.addFile(new MemoryFile("zag_no_dtel.tabl.xml", `<?xml version="1.0" encoding="utf-8"?>
<abapGit version="v1.0.0" serializer="LCL_OBJECT_TABL" serializer_version="v1.0.0">
 <asx:abap xmlns:asx="http://www.sap.com/abapxml" version="1.0">
  <asx:values>
   <DD02V>
    <TABNAME>ZAG_NO_DTEL</TABNAME>
    <DDLANGUAGE>E</DDLANGUAGE>
    <TABCLASS>TRANSP</TABCLASS>
    <DDTEXT>test</DDTEXT>
    <CONTFLAG>A</CONTFLAG>
    <EXCLASS>1</EXCLASS>
   </DD02V>
   <DD09L>
    <TABNAME>ZAG_NO_DTEL</TABNAME>
    <AS4LOCAL>A</AS4LOCAL>
    <TABKAT>0</TABKAT>
    <TABART>APPL1</TABART>
    <BUFALLOW>N</BUFALLOW>
   </DD09L>
   <DD03P_TABLE>
    <DD03P>
     <FIELDNAME>FIELD1</FIELDNAME>
     <KEYFLAG>X</KEYFLAG>
     <ADMINFIELD>0</ADMINFIELD>
     <INTTYPE>C</INTTYPE>
     <INTLEN>000004</INTLEN>
     <NOTNULL>X</NOTNULL>
     <DATATYPE>CHAR</DATATYPE>
     <LENG>000002</LENG>
     <MASK>  CHAR</MASK>
     <DDTEXT>hello</DDTEXT>
    </DD03P>
    <DD03P>
     <FIELDNAME>FIELD2</FIELDNAME>
     <ADMINFIELD>0</ADMINFIELD>
     <INTTYPE>C</INTTYPE>
     <INTLEN>000004</INTLEN>
     <DATATYPE>CHAR</DATATYPE>
     <LENG>000002</LENG>
     <MASK>  CHAR</MASK>
     <DDTEXT>world</DDTEXT>
    </DD03P>
   </DD03P_TABLE>
  </asx:values>
 </asx:abap>
</abapGit>`));

    await reg.parseAsync();

    const ddls = reg.getFirstObject()! as DataDefinition;
    expect(ddls).to.not.equal(undefined);
    const sources = ddls.listSources();
    expect(sources?.length).to.equal(1);
    expect(sources![0].name).to.equal("ZAG_NO_DTEL");
    expect(sources![0].as).to.equal("A");

    const parsed = ddls.parseType(reg) as StructureType | undefined;
    expect(parsed).to.be.instanceof(StructureType);
    const field1 = parsed?.getComponentByName("FIELD1");
    expect(field1).to.not.equal(undefined);
    expect(field1?.getDescription()).to.equal("hello");
    expect(parsed?.getComponentByName("FIELD2")).to.not.equal(undefined);
  });

  it("prefixed, without as", async () => {
    const source = `
define view entity ZI_FIPosition
  as select from I_JournalEntryItem
    inner join   I_Ledger as _Ledger on  _Ledger.IsLeadingLedger = 'X'
                                     and _Ledger.Ledger          = I_JournalEntryItem.Ledger
  {
    key I_JournalEntryItem.SourceLedger,
    key I_JournalEntryItem.CompanyCode
  }`;
    const reg = new Registry().addFiles([
      new MemoryFile("zi_fiposition.ddls.asddls", source),
    ]);
    await reg.parseAsync();
    const ddls = reg.getFirstObject()! as DataDefinition;
    expect(ddls).to.not.equal(undefined);
    const parsed = ddls.parseType(reg) as StructureType;
    const components = parsed.getComponents();
    expect(components.length).to.equal(2);
    expect(components[0].type).to.be.instanceof(VoidType);
  });

  it("associations", async () => {
    const source = `
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: 'Header'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
    serviceQuality: #A,
    sizeCategory: #S,
    dataClass: #MIXED
}
define view entity ZI_Header
  as select from I_JournalEntry
  association [0..1] to ZI_BillingDocument as _BillingDocument on  $projection.ReferenceDocumentType     = 'VBRK'
                                                               and $projection.OriginalReferenceDocument = _BillingDocument.BillingDocument
  {
    key CompanyCode,
    key FiscalYear,
    key AccountingDocument,
        OriginalReferenceDocument,
        _BillingDocument.BillingDocument,
        _JournalEntryItem

}`;
    const reg = new Registry().addFiles([
      new MemoryFile("zi_header.ddls.asddls", source),
    ]);
    await reg.parseAsync();
    const ddls = reg.getFirstObject()! as DataDefinition;
    expect(ddls).to.not.equal(undefined);
    const parsed = ddls.parseType(reg) as StructureType;
    const components = parsed.getComponents();
    // all components void
    for (const component of components) {
      expect(component.type).to.be.instanceof(VoidType);
    }

    expect(ddls.listKeys().length).to.equal(3);
  });

  it("association via voided", async () => {
    const source = `
define view entity ZI_FIPositionBseg
  as select from I_OperationalAcctgDocItem
  {
    key CompanyCode,
    key AccountingDocument,
    key FiscalYear,
    key AccountingDocumentItem,
        ChartOfAccounts,
        AssetClass,

        _ClearingAccountingDocument.DocumentDate as DocumentDateHeader,
        _ClearingAccountingDocument.TaxReportingDate,
        _SalesDoc.SalesDocumentDate

}`;
    const reg = new Registry().addFiles([new MemoryFile("zi_header.ddls.asddls", source)]);

    await reg.parseAsync();
    const ddls = reg.getFirstObject()! as DataDefinition;
    expect(ddls).to.not.equal(undefined);
    const parsed = ddls.parseType(reg) as StructureType;
    const components = parsed.getComponents();
    // all components void
    for (const component of components) {
      expect(component.type).to.be.instanceof(VoidType);
    }

    expect(ddls.listKeys().length).to.equal(4);
  });
});
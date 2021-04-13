import Banner from '@leafygreen-ui/banner';
import Callout from '@leafygreen-ui/callout';
import { Option, Select } from '@leafygreen-ui/select';
import { Cell, Row, Table, TableHeader } from '@leafygreen-ui/table';
import TextInput from '@leafygreen-ui/text-input';
import { InlineCode } from '@leafygreen-ui/typography';
import { FunctionVariable } from '../../../services/realm-lambda/types';
import { Spacer } from '../../../typography';
import './function-variables.less';

export interface EndpointDetailsFunctionVariablesProps {
  variables: FunctionVariable[];
  editing?: boolean;

  onUpdateVariables?: (variables: FunctionVariable[]) => void;
}

export const EndpointDetailsFunctionVariables: React.FC<EndpointDetailsFunctionVariablesProps> = ({
  variables, editing = false, onUpdateVariables
}) => {
  const onUpdateVariable = (variable: FunctionVariable) => {
    if (!editing) {
      return;
    }
    const index = variables.findIndex(v => v.name === variable.name);
    if (index < 0) {
      return;
    }
    const newVariables = [...variables];
    newVariables.splice(index, 1, variable);
    onUpdateVariables?.(newVariables);
  };

  if (!variables.length) {
    return (
      <Banner
        variant="info"
      >
        The query or aggregation does not make use of any variables.
      </Banner>
    )
  }
  return (
    <>
      <Table
        data={variables}
        columns={[
          <TableHeader label="Name" />,
          <TableHeader label="Type" />,
          <TableHeader label="Required / Default" />
        ]}
      >
        {(row: { datum: FunctionVariable }) => (!editing
          ? <FunctionVariableDisplayRow variable={row.datum} />
          : <FunctionVariableEditRow variable={row.datum} onUpdateVariable={onUpdateVariable} />
        )}
      </Table>
      {editing ? (
        <>
          <Spacer />
          <Callout
            variant="note"
          >
            An empty default value causes the variable to be <b>required</b>. <br />
            For variables of <InlineCode>any</InlineCode> type, the given default value will essentially be processed with <InlineCode>eval(...)</InlineCode>.
          </Callout>
        </>
      ) : null}
    </>
  );
};

const FunctionVariableDisplayRow: React.FC<{
  variable: FunctionVariable
}> = ({ variable }) => {
  return (
    <Row key={variable.name}>
      <Cell>{variable.name}</Cell>
      <Cell>
        <InlineCode>{variable.type}</InlineCode>
      </Cell>
      <Cell>
        {variable.default === undefined ? (
          <b>required</b>
        ) : (
          <>
            <i>default: </i>
            <InlineCode>{'' + variable.default}</InlineCode>
          </>
        )}
      </Cell>
    </Row>
  );
};

const FunctionVariableEditRow: React.FC<{
  variable: FunctionVariable, onUpdateVariable: (variable: FunctionVariable) => void
}> = ({ variable, onUpdateVariable }) => {
  const updateVariable = (key: keyof FunctionVariable, value: any) => {
    onUpdateVariable({
      ...variable,
      [key]: value
    });
  };
  const onUpdateVariableType = (type: string) => {
    if (!type) {
      return;
    }
    updateVariable('type', type);
  };

  return (
    <Row key={variable.name}>
      <Cell>{variable.name}</Cell>
      <Cell>
        <Select
          className="endpoint-details__function-variables__type-select"
          aria-labelledby="Variable Type"
          value={variable.type}
          readOnly={false}
          onChange={onUpdateVariableType}
        >
          <Option value="any">Any</Option>
          <Option value="string">String</Option>
          <Option value="number">Number</Option>
          <Option value="boolean">Boolean</Option>
        </Select>
      </Cell>
      <Cell>
        <TextInput
          className="endpoint-details__function-variables__default"
          aria-labelledby="Default Value"
          value={variable.default}
          onChange={e => updateVariable('default', e.target.value)}
        />
      </Cell>
    </Row>
  );
};

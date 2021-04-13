import Banner from '@leafygreen-ui/banner';
import Button from '@leafygreen-ui/button';
import Code from '@leafygreen-ui/code';
import Icon from '@leafygreen-ui/icon';
import TextArea from '@leafygreen-ui/text-area';
import { Cell, Row, Table, TableHeader } from '@leafygreen-ui/table';
import { InlineCode, Subtitle } from '@leafygreen-ui/typography';
import { RealmAppServiceWebhookDetails } from '../../../services';
import { Spacer } from '../../../typography';
import { useEffect, useState } from 'react';
import './functionality.less';

export interface EndpointDetailsFunctionalityEditingState {
  isValid: boolean;
}

export interface EndpointDetailsFunctionalityProps {
  webhookDetails: RealmAppServiceWebhookDetails;
  editing?: boolean;

  onEditChange?: (state: EndpointDetailsFunctionalityEditingState) => void;
}

export const EndpointDetailsFunctionality: React.FC<EndpointDetailsFunctionalityProps> = ({
  webhookDetails, editing = false, onEditChange
}) => {
  const variables = [
    { name: 'id', type: 'string', default: undefined },
    { name: 'count', type: 'number', default: 42 },
    { name: 'flag', type: 'boolean', default: true },
  ];

  const [isSourceDirty, setIsSourceDirty] = useState(false);

  const [editState, setEditState] = useState({
    lastVariableSource: '',
    source: ''
  });
  useEffect(() => {
    if (editing) {
      setEditState({
        lastVariableSource: webhookDetails.function_source,
        source: webhookDetails.function_source
      });
    }
  }, [editing, webhookDetails.function_source]);
  useEffect(() => {
    const isValid = () => {
      return !!editState.source.trim() && editState.source === editState.lastVariableSource;
    };

    onEditChange?.({
      isValid: isValid()
    });
  }, [editState, onEditChange]);


  const onUpdateSource = (source: string) => {
    setIsSourceDirty(source !== webhookDetails.function_source)
    setEditState({
      ...editState,
      source
    });
  };

  const onUpdateVariables = () => {
    setEditState({
      ...editState,
      lastVariableSource: editState.source
    });
  };

  const renderCode = () => {
    if (!editing) {
      return (
        <Code
          language="javascript"
        >
          {webhookDetails.function_source}
        </Code>
      );
    }

    return (
      <>
        <TextArea
          label="Edit Query / Aggregation"
          value={editState.source}
          className="endpoint-details-functionality__source"
          onChange={e => onUpdateSource(e.target.value.trim())}
        />
        {editState.source !== editState.lastVariableSource && (
          <>
            <Spacer />
            <Button
              variant="primary"
              size="small"
              leftGlyph={<Icon glyph="Refresh" />}
              onClick={onUpdateVariables}
            >
              Update Variables
            </Button>
            <Spacer size="s" />
            <Banner>
              You have to update the variables before you can publish an update to ensure all information is up to date.
            </Banner>
          </>
        )}
      </>
    )
  };

  return (
    <>
      <Subtitle>Query</Subtitle>
      <Spacer />
      {renderCode()}
      <Spacer size="l" />

      <Subtitle>Variables</Subtitle>
      <Spacer />
      <Table
        data={variables ?? []}
        columns={[
          <TableHeader label="Name" />,
          <TableHeader label="Type" />,
          <TableHeader label="Required / Default" />
        ]}
      >
        {(row: { datum: any }) => (
          <Row key={row.datum.name}>
            <Cell>{row.datum.name}</Cell>
            <Cell>
              <InlineCode>{row.datum.type}</InlineCode>
            </Cell>
            <Cell>
              {row.datum.default === undefined ? (
                <b>required</b>
              ) : (
                <>
                  <i>default: </i>
                  <InlineCode>{'' + row.datum.default}</InlineCode>
                </>
              )}
            </Cell>
          </Row>
        )}
      </Table>
    </>
  );
};
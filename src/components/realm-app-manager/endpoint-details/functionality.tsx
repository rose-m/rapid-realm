import Banner from '@leafygreen-ui/banner';
import Button from '@leafygreen-ui/button';
import Code from '@leafygreen-ui/code';
import Icon from '@leafygreen-ui/icon';
import TextArea from '@leafygreen-ui/text-area';
import TextInput from '@leafygreen-ui/text-input';
import { Subtitle } from '@leafygreen-ui/typography';
import { useEffect, useState } from 'react';
import { FunctionDescriptor, FunctionType, FunctionVariable, QueryOrAggregationParseResult, RealmAppServiceWebhookDetails, RealmLambda } from '../../../services';
import { Spacer } from '../../../typography';
import { EndpointDetailsFunctionVariables } from './function-variables';
import './functionality.less';

export interface EndpointDetailsFunctionalityEditingState {
  isValid: boolean;
  descriptor: FunctionDescriptor;
}

export interface EndpointDetailsFunctionalityProps {
  webhookDetails: RealmAppServiceWebhookDetails;
  editing?: boolean;

  onEditChange?: (state: EndpointDetailsFunctionalityEditingState) => void;
}

export const EndpointDetailsFunctionality: React.FC<EndpointDetailsFunctionalityProps> = ({
  webhookDetails, editing = false, onEditChange
}) => {
  const [functionDescriptor, setFunctionDescriptor] = useState<FunctionDescriptor | undefined>();
  useEffect(() => {
    const parsed = RealmLambda.parseFunctionSource(webhookDetails.function_source);
    setFunctionDescriptor(parsed);
  }, [webhookDetails.function_source]);

  const [editState, setEditState] = useState({
    type: 'query' as FunctionType,
    database: '',
    collection: '',
    parseError: '',
    lastParsedQueryOrAggregation: '',
    queryOrAggregation: '',
    variables: [] as FunctionVariable[]
  });
  useEffect(() => {
    if (editing) {
      setEditState({
        type: functionDescriptor?.type ?? 'query',
        database: functionDescriptor?.database ?? '',
        collection: functionDescriptor?.collection ?? '',
        parseError: '',
        lastParsedQueryOrAggregation: functionDescriptor?.queryOrAggregation ?? '',
        queryOrAggregation: functionDescriptor?.queryOrAggregation ?? '',
        variables: functionDescriptor?.variables.map(v => ({ ...v })) ?? []
      });
    }
  }, [editing, functionDescriptor]);

  useEffect(() => {
    if (!editing) {
      return;
    }

    const isValid = () => {
      return !!editState.database.trim() && !!editState.collection.trim() && !!editState.queryOrAggregation.trim() && editState.queryOrAggregation === editState.lastParsedQueryOrAggregation;
    };

    onEditChange?.({
      isValid: isValid(),
      descriptor: {
        type: editState.type,
        database: editState.database,
        collection: editState.collection,
        queryOrAggregation: editState.queryOrAggregation,
        variables: editState.variables
      }
    });
  }, [editing, functionDescriptor, editState, onEditChange]);

  const onUpdateDatabase = (database: string) => setEditState({ ...editState, database });
  const onUpdateCollection = (collection: string) => setEditState({ ...editState, collection });
  const onUpdateSource = (source: string) => {
    setEditState({
      ...editState,
      parseError: '',
      queryOrAggregation: source
    });
  };
  const onParseQueryOrAggregation = () => {
    let result: QueryOrAggregationParseResult | undefined;
    let error: string | undefined;
    try {
      result = RealmLambda.parseQueryOrAggregation(editState.queryOrAggregation);
    } catch (e) {
      error = e.message;
    }

    if (result) {
      setEditState({
        ...editState,
        type: result.type,
        variables: mergeVariables(editState.variables, result.variables),
        lastParsedQueryOrAggregation: editState.queryOrAggregation
      });
    } else {
      setEditState({
        ...editState,
        parseError: error ?? 'Could not parse your input.'
      });
    }
  };
  const onUpdateVariables = (variables: FunctionVariable[]) => {
    setEditState({
      ...editState,
      variables
    });
  };

  const renderCode = () => {
    if (!editing) {
      return (
        <Code
          language="javascript"
        >
          {functionDescriptor?.queryOrAggregation ?? ''}
        </Code>
      );
    }

    return (
      <>
        <TextArea
          label="Edit Query / Aggregation"
          value={editState.queryOrAggregation}
          className="endpoint-details-functionality__source"
          onChange={e => onUpdateSource(e.target.value)}
          state={editState.parseError ? 'error' : 'none'}
        />
        {editState.parseError && (
          <>
            <Spacer />
            <Banner
              variant="danger"
            >{editState.parseError}</Banner>
          </>
        )}
        {editState.queryOrAggregation !== editState.lastParsedQueryOrAggregation && (
          <>
            <Spacer />
            <Button
              variant="primary"
              size="small"
              leftGlyph={<Icon glyph="Refresh" />}
              onClick={onParseQueryOrAggregation}
            >
              Parse Query or Aggregation
            </Button>
            <Spacer size="s" />
            <Banner>
              You have to parse the query or aggregation in order to update the variables before you can publish an update to ensure all information is up to date.
            </Banner>
          </>
        )}
      </>
    )
  };

  const renderVariables = () => {
    return (
      <EndpointDetailsFunctionVariables
        editing={editing}
        variables={editing ? editState.variables : functionDescriptor?.variables ?? []}
        onUpdateVariables={onUpdateVariables}
      />
    );
  };

  return functionDescriptor ? (
    <>
      <Subtitle>Database / Collection</Subtitle>
      <Spacer />
      <TextInput
        label="Database"
        value={editing ? editState.database : functionDescriptor.database}
        description="Name of the MongoDB database in your Atlas Cluster to execute the query or aggregation against."
        disabled={!editing}
        onChange={e => onUpdateDatabase(e.target.value)}
        state={editing && !editState.database.trim() ? 'error' : 'none'}
      />
      <Spacer />
      <TextInput
        label="Collection"
        value={editing ? editState.collection : functionDescriptor.collection}
        description="Name of the MongoDB collection in your Atlas database to execute the query or aggregation against."
        disabled={!editing}
        onChange={e => onUpdateCollection(e.target.value)}
        state={editing && !editState.collection.trim() ? 'error' : 'none'}
      />
      <Spacer size="xl" />

      <Subtitle>Query / Aggregation</Subtitle>
      <Spacer />
      {renderCode()}
      <Spacer size="xl" />

      <Subtitle>Variables</Subtitle>
      <Spacer />
      {renderVariables()}
    </>
  ) : (
    <Banner
      variant="danger"
    >
      Could not parse the source code of this endpoint. You cannot manage non-Rapid Realm endpoints in this application.<br />
      You can still go into edit mode but publishing <b>will overwrite any existing code.</b>
    </Banner>
  );
};

function mergeVariables(knownVariables: FunctionVariable[], newVariables: FunctionVariable[]): FunctionVariable[] {
  const knownVariableNames: Record<string, FunctionVariable> = {};
  knownVariables.forEach(v => knownVariableNames[v.name] = v);

  const result: FunctionVariable[] = [];
  newVariables.forEach(v => {
    if (knownVariableNames[v.name]) {
      result.push(knownVariableNames[v.name]);
    } else {
      result.push(v);
    }
  });
  return result;
}
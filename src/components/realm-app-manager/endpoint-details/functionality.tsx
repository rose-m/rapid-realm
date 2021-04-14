import Banner from '@leafygreen-ui/banner';
import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { Option, Select } from '@leafygreen-ui/select';
import TextArea from '@leafygreen-ui/text-area';
import TextInput from '@leafygreen-ui/text-input';
import { Subtitle } from '@leafygreen-ui/typography';
import { useCallback, useEffect, useState } from 'react';
import { FunctionDescriptor, FunctionType, FunctionVariable, QueryOrAggregationParseResult, RealmAppServiceApi, RealmAppServiceWebhookDetails, RealmLambda, RealmServiceType } from '../../../services';
import { Loader, Spacer } from '../../../typography';
import { useAsync } from '../../../utils';
import { EndpointDetailsFunctionVariables } from './function-variables';
import './functionality.less';
import { EndpointDetailsState } from './types';

export interface EndpointDetailsFunctionalityEditingState {
  isValid: boolean;
  descriptor: FunctionDescriptor;
}

export interface EndpointDetailsFunctionalityProps {
  serviceApi: RealmAppServiceApi;
  webhookDetails: RealmAppServiceWebhookDetails;
  state: EndpointDetailsState;

  onEditChange?: (state: EndpointDetailsFunctionalityEditingState) => void;
}

export const EndpointDetailsFunctionality: React.FC<EndpointDetailsFunctionalityProps> = ({
  serviceApi, webhookDetails, state = 'default', onEditChange
}) => {
  const [functionDescriptor, setFunctionDescriptor] = useState<FunctionDescriptor | undefined>();
  const [editState, setEditState] = useState({
    type: 'query' as FunctionType,
    dataSource: '',
    database: '',
    collection: '',
    parseError: '',
    lastParsedQueryOrAggregation: '',
    queryOrAggregation: '',
    variables: [] as FunctionVariable[]
  });
  const getDataSources = useAsync(async () => {
    return (await serviceApi.getApp().getServices()).filter(s => s.type === RealmServiceType.MongoDbAtlas);
  });
  const isKnownDataSource = useCallback(
    (name: string) => getDataSources.status !== 'success' || !!getDataSources.value?.find(s => s.name === name),
    [getDataSources.status, getDataSources.value]
  );

  useEffect(() => {
    if (getDataSources.status === 'idle') {
      getDataSources.execute();
    }
  }, [getDataSources]);

  useEffect(() => {
    const parsed = RealmLambda.parseFunctionSource(webhookDetails.function_source);
    setFunctionDescriptor(parsed);
  }, [webhookDetails.function_source]);

  useEffect(() => {
    if (state === 'default') {
      setEditState({
        dataSource: functionDescriptor?.dataSource ?? 'mongodb-atlas',
        type: functionDescriptor?.type ?? 'query',
        database: functionDescriptor?.database ?? '',
        collection: functionDescriptor?.collection ?? '',
        parseError: '',
        lastParsedQueryOrAggregation: functionDescriptor?.queryOrAggregation ?? '',
        queryOrAggregation: functionDescriptor?.queryOrAggregation ?? '',
        variables: functionDescriptor?.variables.map(v => ({ ...v })) ?? []
      });
    }
  }, [state, functionDescriptor]);

  useEffect(() => {
    if (state !== 'editing') {
      return;
    }

    const isValid = () => {
      return !!editState.database.trim() &&
        !!editState.collection.trim() &&
        !!editState.queryOrAggregation.trim() &&
        editState.queryOrAggregation === editState.lastParsedQueryOrAggregation &&
        isKnownDataSource(editState.dataSource)
    };

    onEditChange?.({
      isValid: isValid(),
      descriptor: {
        type: editState.type,
        dataSource: editState.dataSource,
        database: editState.database,
        collection: editState.collection,
        queryOrAggregation: editState.queryOrAggregation,
        variables: editState.variables
      }
    });
  }, [state, functionDescriptor, editState, isKnownDataSource, onEditChange]);

  const onUpdateDataSource = (dataSource: string) => {
    if (dataSource) {
      setEditState({ ...editState, dataSource })
    }
  };
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

  const renderDataSource = () => {
    let inputOrSelect: JSX.Element;
    let dataSource: string | undefined;
    if (state === 'default') {
      dataSource = functionDescriptor?.dataSource;
      inputOrSelect = (
        <TextInput
          label="Atlas Data Source"
          value={functionDescriptor?.dataSource}
          state={!!dataSource && !isKnownDataSource(dataSource) ? 'error' : 'none'}
          disabled={true}
        />
      );
    } else {
      dataSource = editState.dataSource;
      inputOrSelect = (
        <Select
          label="Atlas Data Source"
          readOnly={false}
          onChange={onUpdateDataSource}
          value={editState.dataSource}
        >
          {getDataSources.value?.map(s => (
            <Option key={s.name} value={s.name}>{s.name}</Option>
          ))}
        </Select>
      );
    }

    return (<>
      {inputOrSelect}
      {!!dataSource && !isKnownDataSource(dataSource) && (<>
        <Spacer />
        <Banner
          variant="danger"
        >
          The data source <i>{dataSource}</i> could not be found in your Realm app.
        </Banner>
      </>)}
    </>);
  };

  const renderCode = () => {
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
        editing={state !== 'default'}
        variables={state !== 'default' ? editState.variables : functionDescriptor?.variables ?? []}
        onUpdateVariables={onUpdateVariables}
      />
    );
  };

  if (state === 'publishing') {
    return (
      <Loader loading={true} label="Publishing updated endpoint..." />
    );
  }

  return functionDescriptor ? (
    <>
      <Subtitle>Data Source</Subtitle>
      <Spacer />
      {renderDataSource()}
      <Spacer />
      <TextInput
        label="Database"
        value={state !== 'default' ? editState.database : functionDescriptor.database}
        description="Name of the MongoDB database in your Atlas Cluster to execute the query or aggregation against."
        disabled={state === 'default'}
        onChange={e => onUpdateDatabase(e.target.value)}
        state={state === 'editing' && !editState.database.trim() ? 'error' : 'none'}
      />
      <Spacer />
      <TextInput
        label="Collection"
        value={state !== 'default' ? editState.collection : functionDescriptor.collection}
        description="Name of the MongoDB collection in your Atlas database to execute the query or aggregation against."
        disabled={state === 'default'}
        onChange={e => onUpdateCollection(e.target.value)}
        state={state === 'editing' && !editState.collection.trim() ? 'error' : 'none'}
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
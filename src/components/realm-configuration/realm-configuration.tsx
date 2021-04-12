import Card from '@leafygreen-ui/card';
import { RealmLogoMark } from '@leafygreen-ui/logo';
import { Body, H2 } from '@leafygreen-ui/typography';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useRealm } from '../../context';
import { RealmApi, RealmAppApi, RealmAppDetails, RealmAppServiceDetails } from '../../services/atlas-api';
import { Spacer } from '../../typography';
import { useAsync } from '../../utils';
import './realm-configuration.less';
import { AtlasDetails, AtlasDetailsForm, RealmAppSelector, RealmServiceSelector } from './stages';

export const RealmConfiguration: React.FC = () => {
  const realmContext = useRealm();
  const [stage, setStage] = useState<'atlas' | 'app' | 'service' | 'done'>('atlas');
  const [atlasDetails, setAtlasDetails] = useState<AtlasDetails | undefined>();
  const [realmAppId, setRealmAppId] = useState<string | undefined>();
  const [realmApp, setRealmApp] = useState<RealmAppApi | undefined>();
  const [realmAppServiceId, setRealmAppServiceId] = useState<string | undefined>();

  const createRealmApi = useAsync(async (atlasCredentials: AtlasDetails): Promise<RealmApi> => {
    return await RealmApi.login(atlasCredentials.publicKey, atlasCredentials.privateKey);
  });
  useEffect(() => {
    if (createRealmApi.value) {
      setStage('app');
    } else {
      setStage('atlas')
    }
  }, [createRealmApi.value]);

  const onSetAtlasDetails = (credentials: AtlasDetails) => {
    setAtlasDetails(credentials);
    createRealmApi.execute(credentials);
  };

  const onSelectRealmApp = (appDetails: RealmAppDetails) => {
    setRealmAppId(appDetails._id);
    setRealmApp(createRealmApi.value!.getAppApi(appDetails))
    setStage('service');
  };

  const onSelectRealmAppService = (serviceDetails: RealmAppServiceDetails) => {
    setRealmAppServiceId(serviceDetails._id);
    realmContext.configureRealm({
      publicKey: atlasDetails!.publicKey,
      privateKey: atlasDetails!.privateKey,
      groupId: atlasDetails!.groupId,
      appId: realmAppId!,
      serviceId: realmAppServiceId!
    }, realmApp!.getServiceApi(serviceDetails));
  };

  if (stage === 'done') {
    return <Redirect to="/" />;
  }

  const renderForm = () => {
    switch (stage) {
      case 'atlas':
        return (
          <AtlasDetailsForm
            onSetDetails={onSetAtlasDetails}
            details={atlasDetails}
            verifying={createRealmApi.status === 'pending'}
            failed={createRealmApi.error}
          />
        );
      case 'app':
        return (
          <RealmAppSelector
            realmApi={createRealmApi.value!}
            groupId={atlasDetails!.groupId}
            appId={realmAppId}
            onBack={() => createRealmApi.reset()}
            onSelectApp={onSelectRealmApp}
          />
        );
      case 'service':
        return (
          <RealmServiceSelector
            realmApp={realmApp!}
            serviceId={realmAppServiceId}
            onBack={() => setStage('app')}
            onSelectService={onSelectRealmAppService}
          />
        );
    }
  };

  return (
    <div className="realm-configuration">
      <Card className="realm-configuration__card">
        <div className="realm-configuration__centered">
          <RealmLogoMark size={64} />
          <Spacer size="s" />

          <H2>Realm Configuration</H2>
          <Body>Setup your Realm App configuration</Body>
        </div>

        <Spacer size="l" />

        {renderForm()}
      </Card>
    </div>
  );
};
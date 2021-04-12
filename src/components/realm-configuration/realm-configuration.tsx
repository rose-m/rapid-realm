import Card from '@leafygreen-ui/card';
import { RealmLogoMark } from '@leafygreen-ui/logo';
import { Body, H2 } from '@leafygreen-ui/typography';
import React, { useEffect, useState } from 'react';
import { RealmApi } from '../../services/atlas-api';
import { Spacer } from '../../typography';
import { useAsync } from '../../utils';
import './realm-configuration.less';
import { AtlasDetails, AtlasDetailsForm, RealmAppSelector } from './stages';

export const RealmConfiguration: React.FC = () => {
  const [stage, setStage] = useState<'atlas' | 'app'>('atlas');
  const [atlasDetails, setAtlasDetails] = useState<AtlasDetails | undefined>();

  const createRealmApi = useAsync(async (atlasCredentials: AtlasDetails): Promise<RealmApi> => {
    return await RealmApi.login(atlasCredentials.publicKey, atlasCredentials.privateKey);
  });
  useEffect(() => {
    if (createRealmApi.value) {
      setStage('app');
    } else {
      setStage('atlas')
    }
  }, [createRealmApi]);

  const onSetAtlasDetails = (credentials: AtlasDetails) => {
    setAtlasDetails(credentials);
    createRealmApi.execute(credentials);
  };

  const form = stage === 'atlas'
    ? (
      <AtlasDetailsForm
        onSetDetails={onSetAtlasDetails}
        details={atlasDetails}
        verifying={createRealmApi.status === 'pending'}
        failed={createRealmApi.error}
      />
    )
    : (
      <RealmAppSelector
        realmApi={createRealmApi.value!}
        groupId={atlasDetails!.groupId}
        onBack={() => createRealmApi.reset()}
      />
    );

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

        {form}
      </Card>
    </div>
  );
};
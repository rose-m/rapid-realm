import Card from '@leafygreen-ui/card';
import { RealmLogoMark } from '@leafygreen-ui/logo';
import { Body, H2 } from '@leafygreen-ui/typography';
import React, { useEffect, useState } from 'react';
import { RealmApi } from '../../services/atlas-api';
import { Spacer } from '../../typography';
import { useAsync } from '../../utils';
import './realm-configuration.less';
import { AtlasCredentials, AtlasCredentialsForm, RealmSettingsForm } from './stages';

export const RealmConfiguration: React.FC = () => {
  const [stage, setStage] = useState<'atlas' | 'realm'>('atlas');
  const [atlasCredentials, setAtlasCredentials] = useState<AtlasCredentials | undefined>();

  const createRealmApi = useAsync(async (atlasCredentials: AtlasCredentials) => {
    return await RealmApi.login(atlasCredentials.publicKey, atlasCredentials.privateKey);
  });

  useEffect(() => {
    console.log(createRealmApi);
  }, [createRealmApi]);

  const onSetCredentials = async (credentials: AtlasCredentials) => {
    setAtlasCredentials(credentials);
    createRealmApi.execute(credentials);
  };

  const form = stage === 'atlas'
    ? (
      <AtlasCredentialsForm
        setCredentials={onSetCredentials}
        verifying={createRealmApi.status === 'pending'}
        failed={createRealmApi.error}
      />
    )
    : (
      <RealmSettingsForm
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
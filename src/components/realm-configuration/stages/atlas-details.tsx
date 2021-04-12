import Banner from '@leafygreen-ui/banner';
import Button from '@leafygreen-ui/button';
import TextInput from '@leafygreen-ui/text-input';
import React, { useEffect, useState } from 'react';
import { ButtonBar, Spacer } from '../../../typography';

export interface AtlasDetails {
  publicKey: string;
  privateKey: string;
  groupId: string;
}

export interface AtlasDetailsFormProps {
  onSetDetails: (credentials: AtlasDetails) => void;
  details?: AtlasDetails | undefined;
  verifying: boolean;
  failed: boolean;
}

export const AtlasDetailsForm: React.FC<AtlasDetailsFormProps> = ({
  onSetDetails, verifying, failed, details
}) => {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [groupId, setGroupId] = useState('');

  useEffect(() => {
    if (details) {
      setPublicKey(details.publicKey);
      setPrivateKey(details.privateKey);
      setGroupId(details.groupId);
    }
  }, [details]);

  const isValid = () => !!publicKey && !!privateKey && !!groupId;
  const onNext = () => {
    if (isValid()) {
      onSetDetails({
        publicKey, privateKey, groupId
      });
    }
  };

  const error = failed ? (
    <>
      <Banner variant="danger">Could not verify Atlas API credentials. Check your API keys and try again.</Banner>
      <Spacer size="l"></Spacer>
    </>
  ) : null;

  return (
    <>
      {error}
      <TextInput
        label="Atlas Public API Key"
        onChange={e => setPublicKey(e.target.value.trim())}
        value={publicKey}
        disabled={verifying}
      />
      <Spacer />
      <TextInput
        label="Atlas Private API Key"
        type="password"
        onChange={e => setPrivateKey(e.target.value.trim())}
        value={privateKey}
        disabled={verifying}
      />
      <Spacer />
      <TextInput
        label="Atlas Project ID"
        description="This is also referred to as the Realm Group ID."
        onChange={e => setGroupId(e.target.value.trim())}
        value={groupId}
        disabled={verifying}
      />

      <Spacer size="l" />

      <ButtonBar>
        <Button
          variant="primary"
          disabled={verifying || !isValid()}
          onClick={() => onNext()}
        >
          {verifying ? 'Verifying...' : 'Next'}
        </Button>
      </ButtonBar>
    </>
  );
};
import TextInput from '@leafygreen-ui/text-input';
import Button from '@leafygreen-ui/button';
import React, { useState } from 'react';
import { Spacer } from '../../../typography';

export interface AtlasCredentials {
  publicKey: string;
  privateKey: string;
}

export interface AtlasCredentialsProps {
  setCredentials: (credentials: AtlasCredentials) => void;
  verifying: boolean;
}

export const AtlasCredentialsForm: React.FC<AtlasCredentialsProps> = ({ setCredentials, verifying }) => {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const onNext = () => {
    if (!!publicKey && !!privateKey) {
      setCredentials({
        publicKey, privateKey
      });
    }
  };

  return (
    <>
      <TextInput
        label="Atlas Public API Key"
        onChange={e => setPublicKey(e.target.value)}
        value={publicKey}
      />
      <Spacer />
      <TextInput
        label="Atlas Private API Key"
        type="password"
        onChange={e => setPrivateKey(e.target.value)}
        value={privateKey}
      />

      <Spacer size="l" />

      <Button
        variant="primary"
        disabled={!publicKey || !privateKey || verifying}
        onClick={() => onNext()}
      >
        {verifying ? 'Verifying...' : 'Next'}
      </Button>
    </>
  );
};
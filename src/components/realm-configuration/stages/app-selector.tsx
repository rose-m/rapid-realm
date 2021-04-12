import Banner from '@leafygreen-ui/banner';
import Button from '@leafygreen-ui/button';
import { RadioBox, RadioBoxGroup } from '@leafygreen-ui/radio-box-group';
import { Body, Label } from '@leafygreen-ui/typography';
import { useEffect, useState } from 'react';
import { RealmApi, RealmAppDetails } from '../../../services/atlas-api';
import { ButtonBar, Spacer } from '../../../typography';
import { useAsync } from '../../../utils';


export interface RealmAppSelectorProps {
  realmApi: RealmApi;
  groupId: string;
  appId?: string | undefined;

  onBack: () => void;
  onSelectApp: (appDetails: RealmAppDetails) => void;
}

export const RealmAppSelector: React.FC<RealmAppSelectorProps> = ({
  realmApi, groupId, appId, onBack, onSelectApp
}) => {
  const [realmAppId, setRealmAppId] = useState('');
  useEffect(() => {
    if (appId) {
      setRealmAppId(appId);
    }
  }, [appId]);

  const getRealmApps = useAsync(async () => {
    return await realmApi.getApps(groupId);
  });
  useEffect(() => {
    if (getRealmApps.status === 'idle') {
      getRealmApps.execute();
    }
  }, [getRealmApps]);

  const onSelectAppById = (appId: string) => {
    const details = getRealmApps.value?.find(d => d._id === appId);
    if (details) {
      onSelectApp(details);
    }
  };

  const renderButtonBar = (showNext = false) => (
    <>
      <Spacer size="l" />
      <ButtonBar>
        <Button
          onClick={() => onBack()}
        >
          Back
        </Button>
        <Spacer direction="flex" />
        {showNext && (
          <Button
            variant="primary"
            disabled={!realmAppId}
            onClick={() => onSelectAppById(realmAppId)}
          >
            Next
          </Button>
        )}
      </ButtonBar>
    </>
  );

  if (getRealmApps.error) {
    return (
      <>
        <Banner
          variant="danger"
        >
          Could not load your Realm Apps. Please go back, check your Project/Group ID, and try again.
        </Banner>
        {renderButtonBar()}
      </>
    );
  }

  if (!getRealmApps.value) {
    return (
      <>
        <Body>
          Loading Apps...
        </Body>
        {renderButtonBar()}
      </>
    );
  }

  const renderAppDetails = (details: RealmAppDetails) => (
    <RadioBox key={details._id} value={details._id}>
      {details.name}
    </RadioBox>
  );

  return (
    <>
      <Label
        htmlFor="realmApps"
      >
        Choose the Realm App you want to manage:
      </Label>
      <Spacer size="s" />
      <RadioBoxGroup
        id="realmApps"
        className="radio-box-group--vertical"
        value={realmAppId}
        onChange={e => setRealmAppId(e.target.value)}
      >
        {getRealmApps.value.map(renderAppDetails)}
      </RadioBoxGroup>
      {renderButtonBar(true)}
    </>
  );
};

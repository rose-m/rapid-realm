import Banner from '@leafygreen-ui/banner';
import Button from '@leafygreen-ui/button';
import { RadioBox, RadioBoxGroup } from '@leafygreen-ui/radio-box-group';
import { Label } from '@leafygreen-ui/typography';
import { useEffect, useState } from 'react';
import { RealmAppApi, RealmAppServiceDetails, RealmServiceType } from '../../../services/atlas-api';
import { ButtonBar, Loader, Spacer } from '../../../typography';
import { useAsync } from '../../../utils';


export interface RealmServiceSelectorProps {
  realmApp: RealmAppApi;
  serviceId?: string | undefined;

  onBack: () => void;
  onSelectService: (serviceDetails: RealmAppServiceDetails) => void;
}

export const RealmServiceSelector: React.FC<RealmServiceSelectorProps> = ({
  realmApp, serviceId, onBack, onSelectService
}) => {
  const [realmServiceId, setRealmServiceId] = useState('');
  useEffect(() => {
    if (serviceId) {
      setRealmServiceId(serviceId);
    }
  }, [serviceId]);
  const [httpServices, setHttpServices] = useState<RealmAppServiceDetails[]>([]);

  const getRealmServices = useAsync(async () => {
    return await realmApp.getServices();
  });
  useEffect(() => {
    if (getRealmServices.status === 'idle') {
      getRealmServices.execute();
    }
  }, [getRealmServices]);
  useEffect(() => {
    setHttpServices(getRealmServices.value?.filter(d => d.type === RealmServiceType.Http) ?? []);
  }, [getRealmServices.value])

  const onSelectServiceById = (serviceId: string) => {
    const details = httpServices.find(d => d._id === serviceId);
    if (details) {
      onSelectService(details);
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
            disabled={!realmServiceId}
            onClick={() => onSelectServiceById(realmServiceId)}
          >
            Next
          </Button>
        )}
      </ButtonBar>
    </>
  );

  if (getRealmServices.error) {
    return (
      <>
        <Banner
          variant="danger"
        >
          Could not load the Realm Services for {realmApp?.getDetails().name}. Please go back and try again.
        </Banner>
        {renderButtonBar()}
      </>
    );
  }

  if (getRealmServices.status !== 'success') {
    return (
      <>
        <Loader loading={true} />
        {renderButtonBar()}
      </>
    );
  }

  const renderServiceDetails = (details: RealmAppServiceDetails) => (
    <RadioBox key={details._id} value={details._id}>
      {details.name}
    </RadioBox>
  );

  return (
    <>
      <Label
        htmlFor="realmServices"
      >
        Choose the Realm Service you want to manage:
      </Label>
      <Spacer size="s" />
      <RadioBoxGroup
        id="realmServices"
        className="radio-box-group--vertical"
        value={realmServiceId}
        onChange={e => setRealmServiceId(e.target.value)}
      >
        {httpServices.map(renderServiceDetails)}
      </RadioBoxGroup>
      {renderButtonBar(true)}
    </>
  );
};

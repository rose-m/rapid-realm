import Banner from '@leafygreen-ui/banner';
import Button from '@leafygreen-ui/button';
import ConfirmationModal from '@leafygreen-ui/confirmation-modal';
import Icon from '@leafygreen-ui/icon';
import { RadioBox, RadioBoxGroup } from '@leafygreen-ui/radio-box-group';
import TextInput from '@leafygreen-ui/text-input';
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
  const [httpServices, setHttpServices] = useState<RealmAppServiceDetails[]>([]);
  const [showNewService, setShowNewService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');

  const getRealmServices = useAsync(async () => {
    return await realmApp.getServices();
  });
  const createHttpService = useAsync(async (serviceName: string) => {
    return await realmApp.createService(serviceName);
  });

  const isServiceNameValid = () => {
    return /^[a-zA-Z0-9_-]+$/.test(newServiceName);
  };

  useEffect(() => {
    if (serviceId) {
      setRealmServiceId(serviceId);
    }
  }, [serviceId]);

  useEffect(() => {
    if (getRealmServices.status === 'idle') {
      getRealmServices.execute();
    }
  }, [getRealmServices]);

  useEffect(() => {
    setHttpServices(getRealmServices.value?.filter(d => d.type === RealmServiceType.Http) ?? []);
  }, [getRealmServices.value])

  useEffect(() => {
    if (createHttpService.value) {
      onSelectService(createHttpService.value);
    }
  }, [createHttpService.value, onSelectService]);

  const onSelectServiceById = (serviceId: string) => {
    const details = httpServices.find(d => d._id === serviceId);
    if (details) {
      onSelectService(details);
    }
  };

  const onSubmitNewHttpService = () => {
    if (!isServiceNameValid()) {
      return;
    }
    createHttpService.execute(newServiceName);
    setNewServiceName('');
    setShowNewService(false);
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

  const renderServices = () => {
    if (!httpServices.length) {
      return (<>
        <Banner>
          You do not have any HTTP services yet.
        </Banner>
        <Spacer />
      </>);
    }
    return (<>
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
      <Spacer />
    </>);
  };

  const renderServiceDetails = (details: RealmAppServiceDetails) => (
    <RadioBox key={details._id} value={details._id}>
      {details.name}
    </RadioBox>
  );

  const renderCreateNewService = () => {
    return (<>
      {createHttpService.error && (<>
        <Banner
          variant="danger"
        >
          Failed to create a new HTTP service.<br />Please try again later.
        </Banner>
        <Spacer />
      </>)}
      <div style={{ textAlign: 'center' }}>
        <Button
          variant="primary"
          disabled={createHttpService.status === 'pending'}
          leftGlyph={createHttpService.status === 'pending' ? null : <Icon glyph="Plus" />}
          onClick={() => setShowNewService(true)}
        >
          {createHttpService.status === 'pending' ? (
            <Loader loading={true} variant="inline" label="Creating Service..." />
          ) : (
            <>New HTTP Service</>
          )}
        </Button>
      </div>
      <ConfirmationModal
        title="New HTTP Service"
        open={showNewService}
        buttonText="Create"
        submitDisabled={!isServiceNameValid()}
        onCancel={() => { setShowNewService(false); setNewServiceName('') }}
        onConfirm={onSubmitNewHttpService}
      >
        <TextInput
          label="Service Name"
          description="The name must only contain ASCII letters, numbers, underscores, and hyphens."
          value={newServiceName}
          state={newServiceName ? (isServiceNameValid() ? 'valid' : 'error') : 'none'}
          onChange={e => setNewServiceName(e.target.value.trim())}
        />
      </ConfirmationModal>
    </>);
  }

  return (
    <>
      {renderServices()}
      {renderCreateNewService()}
      <Spacer size="s" />
      {renderButtonBar(true)}
    </>
  );
};

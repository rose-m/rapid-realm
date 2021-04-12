import Button from '@leafygreen-ui/button';
import TextInput from '@leafygreen-ui/text-input';
import { Spacer } from '../../../typography';

export const RealmSettingsForm: React.FC = () => {
  return (
    <>
      <TextInput
        label="Atlas Project ID"
        description="The Project ID of the Atlas cluster connected to the app. Also referred to as Group ID."
      />
      <Spacer />
      <TextInput
        label="Realm App ID"
        description="The application ID of the Realm App to connect."
      />
      <Spacer />
      <TextInput
        label="Realm Service ID"
        description="The ID of the 3rd Party HTTP service to be managed."
      />

      <Spacer size="l" />

      <Button
        variant="primary"
      >
        Connect
      </Button>
    </>
  );
}
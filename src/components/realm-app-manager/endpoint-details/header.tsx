import Button from '@leafygreen-ui/button';
import ConfirmationModal from '@leafygreen-ui/confirmation-modal';
import Icon from '@leafygreen-ui/icon';
import { H3 } from '@leafygreen-ui/typography';
import { useState } from 'react';
import { RealmAppServiceWebhookDetails } from '../../../services';
import { Spacer } from '../../../typography';
import './header.less';
import { EndpointDetailsState } from './types';

export interface EndpointsDetailsHeaderProps {
  webhookDetails?: RealmAppServiceWebhookDetails | null;
  state?: EndpointDetailsState;
  publishing?: boolean;
  mayPublish?: boolean;

  onEditWebhook?: () => void;
  onDeleteWebhook?: () => void;
  onCancelEditing?: () => void;
  onPublishUpdates?: () => void;
}

export const EndpointDetailsHeader: React.FC<EndpointsDetailsHeaderProps> = ({
  webhookDetails, state = 'default', mayPublish = false,
  onEditWebhook, onDeleteWebhook, onCancelEditing, onPublishUpdates
}) => {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const renderButtons = () => {
    if (!webhookDetails) {
      return null;
    }
    switch (state) {
      case 'editing':
        return (
          <>
            <Button
              size="xsmall"
              leftGlyph={<Icon glyph="X" />}
              onClick={() => onCancelEditing?.()}
            >
              Cancel
            </Button>
            <Spacer direction="horizontal" size="s" />
            <Button
              size="xsmall"
              variant="primary"
              leftGlyph={<Icon glyph="Cloud" />}
              onClick={() => onPublishUpdates?.()}
              disabled={!mayPublish}
            >
              Publish
            </Button>
          </>
        );
      case 'default':
        return (
          <>
            <Button
              size="xsmall"
              leftGlyph={<Icon glyph="Edit" />}
              onClick={() => onEditWebhook?.()}
            >
              Edit
            </Button>
            <Spacer direction="horizontal" size="s" />
            <Button
              size="xsmall"
              variant="danger"
              leftGlyph={<Icon glyph="Trash" />}
              onClick={() => setShowConfirmDeleteModal(true)}
            >
              Delete
            </Button>
          </>
        )
    }
    return null;
  };

  const renderConfirmDeleteModal = () => {
    if (!webhookDetails) {
      return null;
    }

    return (
      <ConfirmationModal
        open={showConfirmDeleteModal}
        onCancel={() => setShowConfirmDeleteModal(false)}
        onConfirm={() => onDeleteWebhook?.()}
        variant="danger"
        title={`Really delete ${webhookDetails.name}?`}
        buttonText="Delete"
      >
        Removing the endpoint cannot be reverted. You will no longer be able to call the endpoint and execute your query or aggregation.
      </ConfirmationModal>
    )
  };

  return (
    <div className="endpoint-details-header">
      <Icon glyph="CurlyBraces" size="large" />
      <Spacer direction="horizontal" size="s" />

      <H3>
        <code>{webhookDetails?.name ?? '...'}</code>
      </H3>

      <Spacer direction="flex" />

      {renderButtons()}
      {renderConfirmDeleteModal()}
    </div>
  );
};
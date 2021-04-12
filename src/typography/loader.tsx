import { Body } from '@leafygreen-ui/typography';
import './loader.less';

export const Loader: React.FC<{ loading: boolean, label?: string | undefined }> = ({ loading, label }) => {
  return loading ? (
    <div className="loader">
      <div className="loader__icon"></div>
      <Body>{label || 'Loading...'}</Body>
    </div>
  ) : null;
};
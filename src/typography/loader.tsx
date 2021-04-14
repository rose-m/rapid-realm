import { Body } from '@leafygreen-ui/typography';
import './loader.less';

export const Loader: React.FC<{ loading: boolean, label?: string | undefined, variant?: 'block' | 'inline' }> = ({ loading, label, variant = 'block' }) => {
  return loading ? (
    <div className={`loader loader--${variant}`}>
      <div className="loader__icon"></div>
      <Body>{label || 'Loading...'}</Body>
    </div>
  ) : null;
};
import './button-bar.less';

export const ButtonBar: React.FC = ({
  children
}) => {
  return (
    <div className="buttonBar">
      {children}
    </div>
  );
};
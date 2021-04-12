import './spacer.less';

export const Spacer: React.FC<{ direction?: 'horizontal' | 'vertical', size?: 's' | 'm' | 'l' }> = ({ direction = 'vertical', size = 'm' }) => {
    return (
        <div className={`spacer spacer--${direction} spacer--size-${size}`}></div>
    )
}
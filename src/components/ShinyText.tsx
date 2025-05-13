import '../styles/ShinyText.css';

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
    text,
    disabled = false,
    speed = 5,
    className = '',
}) => {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
            style={{
                animationDuration,
                padding: '0.75rem 1.5rem',
                cursor: disabled ? 'not-allowed' : 'pointer',
            }}
        >
            {text}
        </div>
    );
};

export default ShinyText;

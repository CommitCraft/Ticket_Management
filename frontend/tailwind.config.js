export default {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: 'hsl(var(--card))',
                border: 'hsl(var(--border))',
                muted: 'hsl(var(--muted))',
                accent: 'hsl(var(--accent))',
                primary: 'hsl(var(--primary))',
                secondary: 'hsl(var(--secondary))',
                danger: 'hsl(var(--danger))'
            },
            boxShadow: {
                soft: '0 24px 60px rgba(15, 23, 42, 0.12)'
            }
        }
    },
    plugins: []
};

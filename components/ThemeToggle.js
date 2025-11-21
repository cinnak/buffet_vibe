import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle({ theme, setTheme }) {
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative w-14 h-7 bg-slate-200 dark:bg-slate-700 rounded-full p-1 transition-colors duration-300"
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                className="w-5 h-5 bg-white dark:bg-slate-900 rounded-full shadow-md flex items-center justify-center"
                animate={{
                    x: theme === 'dark' ? 28 : 0,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
                {theme === 'light' ? (
                    <Sun className="w-3 h-3 text-yellow-500" />
                ) : (
                    <Moon className="w-3 h-3 text-blue-400" />
                )}
            </motion.div>
        </motion.button>
    );
}

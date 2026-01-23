import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [showHeader, setShowHeader] = React.useState(true);
    const [lastScrollY, setLastScrollY] = React.useState(0);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const currentScrollY = scrollRef.current.scrollTop;

            // Show header if looking at top or scrolling up
            if (currentScrollY < 10) {
                setShowHeader(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
                // Scrolling down & passed threshold -> hide
                setShowHeader(false);
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up -> show
                setShowHeader(true);
            }

            setLastScrollY(currentScrollY);
        }
    };

    return (
        <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden transition-colors duration-300">
            {/* Sidebar - Fixed width on Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-40">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar (handled internally by Sidebar component via fixed positioning) */}
            <div className="lg:hidden">
                <Sidebar />
            </div>

            {/* Main Content Area - Flex Column */}
            <main className="flex-1 flex flex-col min-w-0 h-full relative">
                {/* Scroll-aware Header Wrapper */}
                <div
                    className={`fixed top-16 lg:top-0 right-0 left-0 lg:left-72 z-30 transition-transform duration-300 ease-in-out ${showHeader ? 'translate-y-0' : '-translate-y-full'
                        }`}
                >
                    <Header />
                </div>

                {/* Scrollable Content Area */}
                {/* Added pt-32 (mobile) and lg:pt-20 (desktop) to account for fixed headers */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8 scroll-smooth pt-36 lg:pt-24"
                >
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;

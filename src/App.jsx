import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
// --- ADMIN PANEL IMPORT ---
import AdminPanelApp from './modules/admin/adminpanel';

// --- FIREBASE IMPORTS ---
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged,
    signOut,
    updateProfile,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    collection,
    onSnapshot,
    query,
    updateDoc,
    serverTimestamp,
    where,
    orderBy,
    limit,
    runTransaction
} from 'firebase/firestore';


// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyBVruE0hRVZisHlnnyuWBl-PZp3-DMp028",
    authDomain: "pakages-provider.firebaseapp.com",
    projectId: "pakages-provider",
    storageBucket: "pakages-provider.appspot.com",
    messagingSenderId: "109547136506",
    appId: "1:109547136506:web:c9d34657d73b0fcc3ef043",
    measurementId: "G-672LC3842S"
};

// Initialize Firebase (Safe Singleton Pattern)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// --- CURRENCY CONTEXT ---
const CurrencyContext = createContext();

const conversionRates = {
    USD: { rate: 1, symbol: '$' },
    PKR: { rate: 278, symbol: 'Rs' },
    INR: { rate: 83, symbol: '₹' },
};

const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('USD');

    const convertCurrency = (amountInUsd) => {
        if (typeof amountInUsd !== 'number') return '0.00';
        const { rate } = conversionRates[currency];
        return (amountInUsd * rate).toFixed(2);
    };

    const currencySymbol = conversionRates[currency].symbol;

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, convertCurrency, currencySymbol }}>
            {children}
        </CurrencyContext.Provider>
    );
};

const useCurrency = () => useContext(CurrencyContext);


// --- ICONS ---
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const StarIcon = ({ isFavorite }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "#FFC107" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const GoogleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>;
const TwitterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-sky-500"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.81 1.91 3.58-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.14.15-.28 0-.55-.03-.81-.08.55 1.7 2.14 2.94 4.03 2.97-1.47 1.15-3.32 1.83-5.33 1.83-.35 0-.69-.02-1.03-.06 1.9 1.22 4.16 1.93 6.56 1.93 7.88 0 12.2-6.54 12.2-12.2 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path></svg>;
const TelegramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.69 6.6-2.51 11.3c-.15.68-.58.85-1.12.53l-3.6-2.65-1.74 1.67c-.2.2-.36.36-.72.36s-.52-.16-.72-.36L5.6 13.5c-.65-.41-.65-1.04.1-1.34l10.4-4.04c.54-.21 1.02.12.84.88z"></path></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const RightArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;


// --- Theme Hook ---
const useTheme = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return [theme, setTheme];
};

// --- Reusable UI Components ---
const Card = ({ children, className = '' }) => <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>{children}</div>;
const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
    const base = 'px-4 py-2 font-semibold rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400',
    };
    return <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};
const Spinner = () => <div className="flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
const ThemeToggle = ({ theme, setTheme }) => {
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    return (
        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    );
};
// A simple toast notification component
const Toast = ({ message, type, onDismiss }) => {
    const baseStyle = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white transition-opacity duration-300 z-50";
    const typeStyles = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
    };

    useEffect(() => {
        const timer = setTimeout(onDismiss, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className={`${baseStyle} ${typeStyles[type]}`}>
            {message}
            <button onClick={onDismiss} className="ml-4 font-bold">X</button>
        </div>
    );
};


// --- Main Page Components ---

const Header = ({ user, profile, setPage, theme, setTheme }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileMenuRef = useRef(null);
    const { convertCurrency, currencySymbol } = useCurrency();

    const handleLogout = () => signOut(auth).catch(error => console.error("Sign out error", error));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) setIsProfileOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Check for admin role either in local profile object or if explicitly passed
    const isAdmin = profile?.role === 'admin' || profile?.isAdmin === true;

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => setPage('home')}>
                        GetOTP.net
                    </div>
                    <nav className="hidden md:flex items-center space-x-8">
                        {['FAQ', 'API', 'How to buy?', 'Blog'].map(item => 
                            <a key={item} href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">{item}</a>
                        )}
                    </nav>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle theme={theme} setTheme={setTheme} />
                        {user ? (
                            <>
                                <div className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 font-bold p-2 rounded-lg text-sm">
                                    {currencySymbol}{convertCurrency(profile?.balance || 0)}
                                </div>
                                <Button onClick={() => setPage('recharge')} variant="primary">Recharge</Button>
                                <div className="relative" ref={profileMenuRef}>
                                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center">
                                        <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`} alt="Profile" className="w-9 h-9 rounded-full" />
                                    </button>
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-20">
                                            <div className="px-4 py-3 border-b dark:border-gray-600">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.displayName}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                            </div>
                                            {/* ADMIN LINK IN DROPDOWN */}
                                            {isAdmin && (
                                                <a href="#" onClick={(e) => { e.preventDefault(); setPage('admin'); setIsProfileOpen(false); }} className="flex items-center px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                    <DashboardIcon /> <span className="ml-3">Admin Panel</span>
                                                </a>
                                            )}
                                            <a href="#" onClick={(e) => { e.preventDefault(); setPage('history'); setIsProfileOpen(false); }} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"><ClockIcon /> <span className="ml-3">Order History</span></a>
                                            <a href="#" onClick={(e) => { e.preventDefault(); setPage('profile'); setIsProfileOpen(false); }} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"><SettingsIcon /> <span className="ml-3">Profile Settings</span></a>
                                            <div className="border-t border-gray-100 dark:border-gray-600"></div>
                                            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); setIsProfileOpen(false); }} className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600">Logout</a>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="space-x-2">
                                <Button onClick={() => setPage('login')} variant="secondary">Login</Button>
                                <Button onClick={() => setPage('login')}>Registration</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

const Footer = ({ setPage }) => (
    <footer className="bg-white dark:bg-gray-800 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Need help?</h3>
                    <Button onClick={() => {}} variant="secondary" className="w-full justify-center">Support</Button>
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Useful links</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        <li><a href="#" onClick={(e) => {e.preventDefault(); setPage('developers')}} className="hover:text-blue-600 dark:hover:text-blue-400">For developers</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">For users</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        <li><a href="#" onClick={(e) => {e.preventDefault(); setPage('cookies')}} className="hover:text-blue-600 dark:hover:text-blue-400">Cookies</a></li>
                        <li><a href="#" onClick={(e) => {e.preventDefault(); setPage('delivery')}} className="hover:text-blue-600 dark:hover:text-blue-400">Delivery policy</a></li>
                        <li><a href="#" onClick={(e) => {e.preventDefault(); setPage('terms')}} className="hover:text-blue-600 dark:hover:text-blue-400">Terms and conditions</a></li>
                        <li><a href="#" onClick={(e) => {e.preventDefault(); setPage('privacy')}} className="hover:text-blue-600 dark:hover:text-blue-400">Privacy policy</a></li>
                        <li><a href="#" onClick={(e) => {e.preventDefault(); setPage('refund')}} className="hover:text-blue-600 dark:hover:text-blue-400">Refund policy</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">GetOTP.net</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        <li><a href="#" onClick={(e) => {e.preventDefault(); setPage('about')}} className="hover:text-blue-600 dark:hover:text-blue-400">About the service</a></li>
                        <li><a href="#" onClick={(e) => {e.preventDefault(); setPage('contacts')}} className="hover:text-blue-600 dark:hover:text-blue-400">Contacts</a></li>
                        <li><a href="#" onClick={(e) => {e.preventDefault(); setPage('rules')}} className="hover:text-blue-600 dark:hover:text-blue-400">Rules</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">Social networks</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:opacity-80"><FacebookIcon /></a>
                        <a href="#" className="hover:opacity-80"><TwitterIcon /></a>
                        <a href="#" className="hover:opacity-80"><TelegramIcon /></a>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
                GetOTP.net © 2016-{new Date().getFullYear()}
            </div>
        </div>
    </footer>
);

// --- API Call Helper ---
const apiCall = async (action, payload) => {
    try {
        const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : null;
        const response = await fetch('/.netlify/functions/api-proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}` 
            },
            body: JSON.stringify({ action, payload }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API Error: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("API call failed:", error);
        throw error;
    }
};


// --- UPDATED SIDEBAR ---
const Sidebar = ({ user, setPage, onPurchase, showToast }) => {
    const [services, setServices] = useState([]);
    const [servers, setServers] = useState([]);
    
    // We only need two loading states now: services and servers
    const [loading, setLoading] = useState({ services: true, servers: true });
    
    // Loading state for fetching the best price ("Any" operator)
    const [priceLoading, setPriceLoading] = useState(false);

    const { convertCurrency, currencySymbol } = useCurrency();
    
    const [selectedService, setSelectedService] = useState(null);
    const [selectedServer, setSelectedServer] = useState(null);
    const [selectedOperator, setSelectedOperator] = useState(null); // Will default to 'any'
    
    const [showAllServices, setShowAllServices] = useState(false);
    const [showAllServers, setShowAllServers] = useState(false);
    const [serviceSearchTerm, setServiceSearchTerm] = useState('');
    const [serverSearchTerm, setServerSearchTerm] = useState('');

    useEffect(() => {
        const unsubServices = onSnapshot(collection(db, "services"), (snapshot) => {
            const servicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setServices(servicesData);
            setLoading(prev => ({...prev, services: false}));
        });
        const unsubServers = onSnapshot(collection(db, "servers"), (snapshot) => {
            const serverData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setServers(serverData);
            setLoading(prev => ({...prev, servers: false}));
        });
        return () => { unsubServices(); unsubServers(); };
    }, []);

    // NEW FUNCTION: Fetch lowest price and set operator to 'any'
    const fetchPriceAndSelectAny = async (service, country) => {
        setPriceLoading(true);
        setSelectedOperator(null); // Reset while fetching

        try {
            // We fetch the prices for this country/product to find the minimum cost to display to the user.
            const response = await apiCall("getOperatorsAndPrices", { country: country.name, product: service.name.toLowerCase() });
            
            if (response && response[country.name] && response[country.name][service.name.toLowerCase()]) {
                const operatorsData = response[country.name][service.name.toLowerCase()];
                // Extract all prices
                const prices = Object.values(operatorsData).map(op => op.cost);
                
                // Find the lowest price
                const minPrice = Math.min(...prices);

                // Set the operator to "any" but with the correct price for display/balance check
                setSelectedOperator({
                    name: 'any',
                    price: minPrice,
                    qty: 999 // 'any' usually has high availability
                });
            } else {
                showToast(`No numbers available for ${service.name} in ${country.location}.`, 'error');
            }
        } catch (error) {
            console.error("Failed to fetch price:", error);
            showToast('Failed to check availability. Please try again.', 'error');
        } finally {
            setPriceLoading(false);
        }
    };

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setSelectedServer(null);
        setSelectedOperator(null);
        showToast(`Selected: ${service.name}. Now select a country.`, 'info');
    };

    const handleServerSelect = (server) => {
        if (!selectedService) {
            showToast('Please select a service first.', 'error');
            return;
        }
        setSelectedServer(server);
        // Automatically trigger the "Any" operator logic
        fetchPriceAndSelectAny(selectedService, server);
    };
    
    const handlePurchase = () => {
        if (!user) {
            showToast("Please log in to purchase.", "info");
            setPage('login');
            return;
        }
        if (!selectedService || !selectedServer || !selectedOperator) {
            showToast('Please select a service and country.', 'error');
            return;
        }
        
        onPurchase({
            service: selectedService, 
            server: selectedServer, 
            operator: selectedOperator, // This is now { name: 'any', price: ... }
            price: selectedOperator.price 
        });
    };

    const filteredServices = services.filter(service => service.name?.toLowerCase().includes(serviceSearchTerm.toLowerCase()));
    const displayedServices = showAllServices ? filteredServices : filteredServices.slice(0, 10);
    const filteredServers = servers.filter(server => server.location?.toLowerCase().includes(serverSearchTerm.toLowerCase()));
    const displayedServers = showAllServers ? filteredServers : filteredServers.slice(0, 10);
    
    return (
        <aside className="w-full md:w-1/3 lg:w-1/4">
            <Card className="p-4 space-y-4">
                {/* Step 1: Select Service */}
                <div>
                    <h3 className="font-bold mb-2 text-gray-800 dark:text-gray-200">1. Select service</h3>
                    <div className="relative mb-2">
                        <input 
                            type="text" 
                            placeholder="Find website or app" 
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                            value={serviceSearchTerm}
                            onChange={e => setServiceSearchTerm(e.target.value)}
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mt-2 h-48 overflow-y-auto">
                        {loading.services ? <Spinner /> : displayedServices.map(service => (
                            <div key={service.id} onClick={() => handleServiceSelect(service)} 
                                className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedService?.id === service.id ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-blue-50 dark:hover:bg-gray-700'}`}>
                                <div className="flex items-center space-x-3">
                                    {service.name && <img src={`https://logo.clearbit.com/${service.name.toLowerCase().replace(/\s+/g, '')}.com`} onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${service.name.charAt(0)}&background=random`}} alt={service.name} className="w-8 h-8 rounded-full" />}
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{service.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredServices.length > 10 && (
                        <div className="mt-2 flex justify-center">
                            <button onClick={() => setShowAllServices(!showAllServices)} className="flex items-center text-sm text-blue-600 hover:underline">
                                {showAllServices ? 'Show less' : `Show all ${filteredServices.length}`} <RightArrowIcon className={`ml-1 w-4 h-4 transition-transform ${showAllServices ? 'rotate-90' : ''}`} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Step 2: Select Country */}
                <div>
                    <h3 className="font-bold mb-2 text-gray-800 dark:text-gray-200">2. Select country</h3>
                    <div className="relative mb-2">
                                <input 
                                    type="text" 
                                    placeholder="Find country" 
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
                                    value={serverSearchTerm}
                                    onChange={e => setServerSearchTerm(e.target.value)}
                                />
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <div className={`mt-2 h-48 overflow-y-auto ${!selectedService ? 'opacity-50' : ''}`}>
                        {loading.servers ? <Spinner /> : displayedServers.map(server => (
                            <div key={server.id} onClick={() => selectedService && handleServerSelect(server)} 
                                className={`flex items-center p-2 rounded-md ${!selectedService ? 'cursor-not-allowed' : 'cursor-pointer'} ${selectedServer?.id === server.id ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-blue-50 dark:hover:bg-gray-700'}`}>
                                {server.iso && <img src={`https://flagcdn.com/w20/${server.iso.toLowerCase()}.png`} onError={(e) => {e.target.style.display = 'none'}} alt={`${server.location} flag`} className="w-8 h-auto inline-block mr-3" />}
                                <span className="font-medium text-gray-800 dark:text-gray-200">{server.location}</span>
                            </div>
                        ))}
                    </div>
                    {filteredServers.length > 10 && (
                        <div className="mt-2 flex justify-center">
                            <button onClick={() => setShowAllServers(!showAllServers)} className="flex items-center text-sm text-blue-600 hover:underline">
                                {showAllServers ? 'Show less' : `Show all ${filteredServers.length}`} <RightArrowIcon className={`ml-1 w-4 h-4 transition-transform ${showAllServers ? 'rotate-90' : ''}`} />
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Step 3: Purchase (Automated "Any" Operator) */}
                {selectedServer && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        {priceLoading ? (
                            <div className="flex justify-center items-center py-4">
                                <Spinner />
                                <span className="ml-2 text-sm text-gray-500">Checking best price...</span>
                            </div>
                        ) : selectedOperator ? (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                    <span className="text-gray-700 dark:text-gray-300">Estimated Price:</span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {currencySymbol}{convertCurrency(selectedOperator.price)}
                                    </span>
                                </div>
                                <Button onClick={handlePurchase} className="w-full py-3 text-lg">
                                    Buy Number
                                </Button>
                                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                    Automatically selecting the best available operator.
                                </p>
                            </div>
                        ) : null}
                    </div>
                )}
            </Card>
        </aside>
    );
};

const FeatureSection = ({ imgSrc, title, children }) => (
    <div className="flex items-start sm:items-center space-x-6">
        <img src={imgSrc} alt={title} className="w-16 h-16 flex-shrink-0" />
        <div>
            <h3 className="font-bold text-lg mb-1 text-gray-800 dark:text-gray-200">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{children}</p>
        </div>
    </div>
);

const LandingContent = ({ setPage }) => (
    <main className="w-full md:w-2/3 lg:w-3/4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Virtual Numbers for Receiving SMS</h1>
        <div className="space-y-8">
            <FeatureSection imgSrc="https://5sim.net/_next/static/media/first.9f71dbdf.png" title="Over 500,000 Numbers Originating from Around 180 Countries Online">
                Here you can find virtual numbers from more than 180 countries. You can find phone numbers originating from pretty much anywhere, including the UK, Sweden, Germany, France, India, Indonesia, Malaysia, Cambodia, Mongolia, Canada, Thailand, Netherlands, Spain, etc.
            </FeatureSection>
            <FeatureSection imgSrc="https://5sim.net/_next/static/media/second.176963f1.png" title="New Virtual Numbers Added Daily">
                Here, the pricing starts at one coin for a single number, and you will not have to pay for monthly SIM plans too.
            </FeatureSection>
            <FeatureSection imgSrc="https://5sim.net/_next/static/media/third.f4b6d3ce.png" title="Single-Use Numbers and Multiple SMS Deliveries">
                Get a phone number whenever you want. The process relies on automation heavily, so you should be able to receive an SMS instantly.
            </FeatureSection>
            <FeatureSection imgSrc="https://5sim.net/_next/static/media/fourth.71fe265c.png" title="API for Developers and Regular Users">
                Enable ensure uninterrupted operation via our SMS delivery service combined with quality proxy/VPN, in-browser user agent, and reliable software.
            </FeatureSection>
            <FeatureSection imgSrc="https://5sim.net/_next/static/media/fifth.c13daa5a.png" title="Low Commission Fees">
                Add funds to your balance while spending as little as you can on commission fees.
            </FeatureSection>
            <FeatureSection imgSrc="https://5sim.net/_next/static/media/sixth.fbc00ec6.png" title="Support Available 24/7">
                To find and purchase only the most fitting numbers, contact our support agents anytime.
            </FeatureSection>
        </div>

        <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">How to Receive an SMS using a Virtual Number</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">Start off by <a href="#" onClick={(e) => {e.preventDefault(); setPage('login')}} className="text-blue-600 font-semibold hover:underline">Logging in</a> or <a href="#" onClick={(e) => {e.preventDefault(); setPage('login')}} className="text-blue-600 font-semibold hover:underline">Signing up</a></p>
            <div className="space-y-4">
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">1</div>
                    <p className="ml-4 font-medium text-gray-800 dark:text-gray-200">Choose country, service and get a virtual phone number</p>
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">2</div>
                    <p className="ml-4 font-medium text-gray-800 dark:text-gray-200">Use this virtual phone number to receive an SMS</p>
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">3</div>
                    <p className="ml-4 font-medium text-gray-800 dark:text-gray-200">Use SMS for successful completion</p>
                </div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Purchase as many numbers as you need: We welcome both wholesale and retail customers.</p>
        </div>
    </main>
);

const HistoryTable = ({ title, headers, data, isLoading }) => (
    <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
        <div className="overflow-x-auto">
            {isLoading ? <Spinner /> : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>{headers.map(h => <th key={h} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{h}</th>)}</tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {data.map((row, i) => (<tr key={i}>{Object.values(row).map((cell, j) => <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{cell}</td>)}</tr>))}
                    </tbody>
                </table>
            )}
            {!isLoading && data.length === 0 && <p className="text-center p-4 text-gray-500 dark:text-gray-400">No records found.</p>}
        </div>
    </Card>
);

const NumbersHistory = ({ user }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "users", user.uid, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const orders = snapshot.docs.map(doc => {
                const data = doc.data();
                const statusMap = {
                    'PENDING': 'bg-yellow-100 text-yellow-800',
                    'FINISHED': 'bg-green-100 text-green-800',
                    'CANCELED': 'bg-red-100 text-red-800',
                    'EXPIRED': 'bg-gray-100 text-gray-800',
                };
                return {
                    phone: data.phone, 
                    product: data.product, 
                    price: `$${data.price.toFixed(2)}`,
                    status: <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusMap[data.status] || statusMap['EXPIRED']}`}>{data.status}</span>,
                    date: data.createdAt?.toDate().toLocaleString() || 'N/A',
                };
            });
            setHistory(orders); setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    return <HistoryTable title="Numbers History" headers={["Phone", "Product", "Price", "Status", "Date"]} data={history} isLoading={loading} />;
};

const ProfileSettings = ({ user, profile, showToast }) => {
    const [displayName, setDisplayName] = useState(profile?.displayName || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setDisplayName(profile?.displayName || '');
    }, [profile]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (displayName === profile?.displayName) return;
        
        setLoading(true);
        try {
            await updateProfile(auth.currentUser, { displayName });
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { displayName });
            showToast('Profile updated successfully!', 'success');
        } catch (error) {
            console.error("Error updating profile: ", error);
            showToast('Failed to update profile.', 'error');
        }
        setLoading(false);
    };

    return (
        <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Profile Settings</h2>
            <div className="flex items-center space-x-6 mb-8">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${profile?.displayName}&background=random`} alt="Profile" className="w-24 h-24 rounded-full" />
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{profile?.displayName}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{profile?.email}</p>
                </div>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
                    <input type="text" id="displayName" value={displayName} onChange={e => setDisplayName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-transparent" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input type="email" id="email" value={profile?.email || ''} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 cursor-not-allowed"/>
                </div>
                <div className="pt-2">
                    <Button type="submit" disabled={loading || displayName === profile?.displayName}>
                        {loading ? <Spinner /> : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid, email: user.email, displayName: user.email.split('@')[0],
                    photoURL: '', balance: 0, rating: 96, createdAt: serverTimestamp()
                });
            }
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    uid: user.uid, email: user.email, displayName: user.displayName,
                    photoURL: user.photoURL, balance: 0, rating: 96, createdAt: serverTimestamp()
                });
            }
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="p-8">
                <div className="flex justify-center mb-6">
                    <button onClick={() => setIsLogin(true)} className={`px-4 py-2 font-semibold ${isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>Login</button>
                    <button onClick={() => setIsLogin(false)} className={`px-4 py-2 font-semibold ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>Register</button>
                </div>
                <form onSubmit={handleAuthAction} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent" />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>{loading ? <Spinner/> : (isLogin ? 'Login' : 'Register')}</Button>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600" /></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span></div>
                    </div>
                    <Button onClick={handleGoogleLogin} variant="secondary" className="w-full mt-6 flex items-center justify-center space-x-2" disabled={loading}>
                        <GoogleIcon /><span>Sign in with Google</span>
                    </Button>
                </div>
            </Card>
        </div>
    );
};

const RechargePage = ({ user, showToast }) => {
    const [amount, setAmount] = useState(1); // Default amount in PKR
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (amount <= 0) {
            showToast("Please enter a valid amount.", "error");
            return;
        }
        setLoading(true);
        try {
            const idToken = await user.getIdToken();
            const response = await fetch('/.netlify/functions/initiate-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ amount: amount })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to initiate payment.');
            }

            const { paymentUrl } = await response.json();
            window.location.href = paymentUrl;

        } catch (error) {
            console.error("Payment initiation failed:", error);
            showToast(error.message, "error");
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <Card className="p-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Recharge Account</h1>
                <div className="flex justify-center">
                    <div className="border dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow max-w-sm">
                        <img src="https://workuppay.co/assets/images/logo_icon/logo.png" alt="WorkupPay" className="h-12 mb-4" />
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">WorkupPay</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Securely add funds to your account.</p>
                        <div className="w-full mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (PKR)</label>
                            <input 
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent text-center font-bold text-lg"
                                placeholder="e.g., 500"
                            />
                        </div>
                        <Button onClick={handlePayment} disabled={loading} className="w-full">
                            {loading ? <Spinner /> : 'Proceed to Payment'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};


const ContentPage = ({ title }) => (
    <div className="w-full">
        <Card className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400">Content for this page is coming soon.</p>
        </Card>
    </div>
);

// --- UPDATED ACTIVE ORDER COMPONENT (With Timer, Polling, Ban) ---
const ActiveOrder = ({ user, orderData, onUpdateStatus, showToast }) => {
    const [order, setOrder] = useState(orderData);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPolling, setIsPolling] = useState(true);
    const [copied, setCopied] = useState(false);
    const pollingRef = useRef(null);

    // 1. Initialize & Countdown Logic
    useEffect(() => {
        // Calculate time remaining based on the API's 'expires' timestamp
        const updateTimer = () => {
            if (!order.expires) return;
            // Handle Firestore timestamp or ISO string
            const expiryDate = order.expires.toDate ? order.expires.toDate() : new Date(order.expires);
            const now = new Date();
            const diff = Math.floor((expiryDate - now) / 1000);
            setTimeLeft(diff > 0 ? diff : 0);
        };

        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);

        return () => clearInterval(timerInterval);
    }, [order.expires]);

    // 2. Polling Logic (Check for SMS)
    useEffect(() => {
        if (!isPolling || ['FINISHED', 'CANCELED', 'TIMEOUT', 'BANNED'].includes(order.status)) {
            return;
        }

        const pollOrder = async () => {
            try {
                const updatedData = await apiCall("checkOrder", { orderId: order.id });
                
                // If we have new data, update local state
                if (updatedData) {
                    setOrder(prev => ({ ...prev, ...updatedData }));

                    // If SMS received, update Firestore
                    if (updatedData.sms && updatedData.sms.length > 0) {
                        const orderRef = doc(db, "users", user.uid, "orders", order.id);
                        await updateDoc(orderRef, { 
                            sms: updatedData.sms,
                            status: 'RECEIVED'
                        });
                        if (order.status !== 'RECEIVED') {
                            showToast("New SMS Received!", "success");
                        }
                    }

                    // Stop polling if status is final
                    if (['FINISHED', 'CANCELED', 'TIMEOUT', 'BANNED'].includes(updatedData.status)) {
                        setIsPolling(false);
                        onUpdateStatus(order.id, updatedData.status);
                    }
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        };

        pollingRef.current = setInterval(pollOrder, 5000); // Poll every 5s
        return () => clearInterval(pollingRef.current);
    }, [isPolling, order.id, order.status, user.uid, onUpdateStatus, showToast]);


    // 3. Actions
    const handleCopy = () => {
        navigator.clipboard.writeText(order.phone);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        showToast("Number copied to clipboard", "info");
    };

    const handleAction = async (actionType) => {
        try {
            await apiCall(actionType, { orderId: order.id });
            const newStatus = actionType === 'cancelOrder' ? 'CANCELED' : actionType === 'banOrder' ? 'BANNED' : 'FINISHED';
            
            // Update UI immediately
            setOrder(prev => ({ ...prev, status: newStatus }));
            setIsPolling(false);
            
            // Update Firestore
            const orderRef = doc(db, "users", user.uid, "orders", order.id);
            await updateDoc(orderRef, { status: newStatus });
            
            onUpdateStatus(order.id, newStatus);
            showToast(`Order ${newStatus.toLowerCase()}`, "success");
        } catch (error) {
            showToast(`Action failed: ${error.message}`, 'error');
        }
    };

    // Helper: Format Seconds to MM:SS
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Helper: Status Badge Color
    const getStatusColor = (status) => {
        switch (status) {
            case 'RECEIVED': return 'bg-green-100 text-green-800 border-green-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CANCELED': return 'bg-red-100 text-red-800 border-red-200';
            case 'BANNED': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <main className="w-full md:w-2/3 lg:w-3/4">
            <div className="space-y-6">
                
                {/* Header Card */}
                <Card className="p-6 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                                {order.product} <span className="ml-3 text-sm font-normal text-gray-500">#{order.id}</span>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Operator: <span className="font-semibold capitalize">{order.operator}</span> | Server: <span className="font-semibold capitalize">{order.server || order.country}</span>
                            </p>
                        </div>
                        <div className={`px-4 py-1 rounded-full border text-sm font-bold ${getStatusColor(order.status)}`}>
                            {order.status}
                        </div>
                    </div>
                </Card>

                {/* Main Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Phone Number & Timer */}
                    <Card className="p-6 flex flex-col justify-center items-center text-center space-y-6">
                        <div>
                            <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-semibold">Virtual Number</p>
                            <div className="flex items-center justify-center space-x-3 bg-gray-100 dark:bg-gray-700 px-6 py-3 rounded-xl">
                                <span className="text-3xl font-mono font-bold text-gray-800 dark:text-white tracking-wider">
                                    {order.phone}
                                </span>
                                <button onClick={handleCopy} className="text-gray-500 hover:text-blue-600 transition-colors" title="Copy Number">
                                    {copied ? <CheckIcon /> : <ClipboardIcon />}
                                </button>
                            </div>
                        </div>

                        <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1 uppercase tracking-wide font-semibold">Time Remaining</p>
                            <div className={`text-5xl font-bold tabular-nums ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
                                {formatTime(timeLeft)}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Order expires automatically</p>
                        </div>
                    </Card>

                    {/* SMS Inbox */}
                    <Card className="p-6 flex flex-col h-full min-h-[300px]">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                            <span className="mr-2">📩</span> SMS Inbox
                        </h3>
                        
                        <div className="flex-grow bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 overflow-y-auto space-y-3 custom-scrollbar">
                            {order.sms && order.sms.length > 0 ? (
                                order.sms.map((msg, idx) => (
                                    <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{msg.sender}</span>
                                            <span className="text-xs text-gray-400">{msg.date ? new Date(msg.date).toLocaleTimeString() : 'Just now'}</span>
                                        </div>
                                        <p className="text-gray-800 dark:text-gray-200 font-mono text-sm leading-relaxed">
                                            {msg.text}
                                        </p>
                                        {msg.code && (
                                            <div className="mt-3 flex items-center">
                                                <span className="text-xs text-gray-500 mr-2">Code:</span>
                                                <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded text-lg font-bold tracking-widest select-all cursor-pointer hover:bg-yellow-100 transition-colors">
                                                    {msg.code}
                                                </code>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                                    {order.status === 'PENDING' ? (
                                        <>
                                            <Spinner /> 
                                            <p className="animate-pulse">Waiting for SMS...</p>
                                            <p className="text-xs text-center max-w-xs">Use the number above in the service. The code will appear here instantly.</p>
                                        </>
                                    ) : (
                                        <p>No messages received.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Action Buttons */}
                <Card className="p-4 flex flex-wrap justify-between items-center gap-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-sm text-gray-500">
                        <p><strong>Note:</strong> Cancel or Ban if no code arrives within 2 mins.</p>
                    </div>
                    <div className="flex space-x-3">
                        {/* Only show Cancel/Ban if order is active and no SMS yet */}
                        {order.status === 'PENDING' && (!order.sms || order.sms.length === 0) && (
                            <>
                                <Button variant="secondary" onClick={() => handleAction('banOrder')} className="hover:bg-red-100 hover:text-red-700">
                                    🚫 Ban / Invalid
                                </Button>
                                <Button variant="secondary" onClick={() => handleAction('cancelOrder')}>
                                    ❌ Cancel Order
                                </Button>
                            </>
                        )}
                        
                        {/* Show Finish if we have SMS or user wants to close manually */}
                        <Button onClick={() => handleAction('finishOrder')} className="bg-green-600 hover:bg-green-700">
                            ✅ Finish Order
                        </Button>
                    </div>
                </Card>

            </div>
        </main>
    );
};


const MainLayout = ({ user, page, setPage, profile, showToast }) => {
    const [activeOrder, setActiveOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const activeOrderUnsubscribe = useRef(null);

    useEffect(() => {
        if (!user) {
            setActiveOrder(null);
            if (activeOrderUnsubscribe.current) activeOrderUnsubscribe.current();
            return;
        }

        const ordersQuery = query(
            collection(db, "users", user.uid, "orders"),
            where("status", "in", ["PENDING", "RECEIVED"]),
            orderBy("createdAt", "desc"),
            limit(1)
        );

        activeOrderUnsubscribe.current = onSnapshot(ordersQuery, (snapshot) => {
            if (!snapshot.empty) {
                const latestOrder = snapshot.docs[0];
                setActiveOrder({ id: latestOrder.id, ...latestOrder.data() });
            } else {
                setActiveOrder(null);
            }
        });

        return () => {
            if (activeOrderUnsubscribe.current) activeOrderUnsubscribe.current();
        };
    }, [user]);

    const handlePurchase = async ({ service, server, operator, price }) => {
        if (activeOrder) {
            showToast("You already have an active order. Please complete or cancel it first.", "error");
            return;
        }
        
        setIsLoading(true);
        
        try {
            await runTransaction(db, async (transaction) => {
                const userRef = doc(db, "users", user.uid);
                const userDoc = await transaction.get(userRef);

                if (!userDoc.exists()) throw new Error("User document does not exist!");

                const currentBalance = userDoc.data().balance;
                const itemPrice = price;
                
                if (currentBalance < itemPrice) {
                    throw new Error("Insufficient balance. Please recharge your account.");
                }

                const purchaseData = await apiCall("buyNumber", {
                    service: service,
                    server: server,
                    operator: operator,
                });
                
                if (purchaseData.error) {
                    throw new Error(purchaseData.error);
                }

                const newOrder = {
                    id: String(purchaseData.id),
                    userId: user.uid,
                    phone: purchaseData.phone,
                    product: service.name,
                    price: itemPrice,
                    provider: '5sim', // hardcoded for this provider
                    operator: operator.name,
                    server: server.name,
                    status: purchaseData.status,
                    createdAt: serverTimestamp(),
                    expires: purchaseData.expires ? new Date(purchaseData.expires) : new Date(Date.now() + 15 * 60000), // 15 mins default
                    sms: null,
                };
                
                const newBalance = currentBalance - itemPrice;
                
                const newOrderRef = doc(db, "users", user.uid, "orders", String(purchaseData.id));
                transaction.set(newOrderRef, newOrder);
                transaction.update(userRef, { balance: newBalance });
            });

            showToast(`Successfully purchased number for ${service.name}!`, 'success');

        } catch (e) {
            console.error("Error during transaction: ", e);
            showToast(e.message, 'error');
            if (e.message.includes("Insufficient balance")) {
                setPage('recharge');
            }
        }
        setIsLoading(false);
    };

    const handleOrderStatusChange = async (orderId, newStatus) => {
        if (!user || !orderId) return;
        const orderRef = doc(db, "users", user.uid, "orders", String(orderId));
        try {
            await updateDoc(orderRef, { status: newStatus });
            showToast(`Order marked as ${newStatus}.`, 'info');
        } catch (error) {
            console.error(`Failed to update order status:`, error);
            showToast('Could not update order status.', 'error');
        }
    };

    const renderContent = () => {
        if (isLoading) return <div className="w-full flex justify-center items-center"><Spinner /></div>;
        if (activeOrder) return <ActiveOrder user={user} orderData={activeOrder} onUpdateStatus={handleOrderStatusChange} showToast={showToast} />;

        const contentPages = ['cookies', 'delivery', 'terms', 'privacy', 'refund', 'about', 'contacts', 'rules', 'developers'];
        if (contentPages.includes(page)) {
            return <ContentPage title={page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ')} />;
        }

        switch (page) {
            case 'history': return <NumbersHistory user={user} />;
            case 'profile': return <ProfileSettings user={user} profile={profile} showToast={showToast} />;
            case 'login': return <LoginPage />;
            case 'recharge': return <RechargePage user={user} showToast={showToast} />;
            case 'home':
            default: return <LandingContent setPage={setPage} />;
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <Sidebar user={user} setPage={setPage} onPurchase={handlePurchase} showToast={showToast} />
                {renderContent()}
            </div>
        </div>
    );
};


// --- Main App Component ---

function App() {
    const [page, setPage] = useState('home');
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useTheme();
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setProfile(null);
                if (['profile', 'history', 'recharge', 'admin'].includes(page)) {
                    setPage('home');
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [page]);
    
    useEffect(() => {
        if (!user) return;
        // Watch user profile for balance and Role
        const unsub = onSnapshot(doc(db, "users", user.uid), async (userDoc) => {
            let userProfile = userDoc.data();
            
            // Check if user is also in the 'admins' collection
            const adminDocRef = doc(db, "admins", user.uid);
            const adminDoc = await getDoc(adminDocRef);
            if (adminDoc.exists() && adminDoc.data().role === 'admin') {
                userProfile = { ...userProfile, role: 'admin' };
            }
            
            setProfile(userProfile);
        });
        return () => unsub();
    }, [user]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-900"><Spinner /></div>;
    }

    // --- ADMIN PANEL INTEGRATION ---
    // If the page state is 'admin', render the imported Admin Panel instead of the Main Layout.
    if (page === 'admin') {
        // We render the admin app directly. 
        // Note: The AdminApp manages its own layout (Sidebar/Header).
        // It should have a way to go back, but typically admin panels are distinct environments.
        return <AdminPanelApp />;
    }
    
    return (
        <CurrencyProvider>
            <div className="font-sans text-gray-900 bg-blue-50 dark:bg-gray-900 min-h-screen">
                {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
                <Header user={user} profile={profile} setPage={setPage} theme={theme} setTheme={setTheme} />
                <MainLayout user={user} page={page} setPage={setPage} profile={profile} showToast={showToast} />
                <Footer setPage={setPage} />
            </div>
        </CurrencyProvider>
    );
}

export default App;
import React, { useState, useEffect, useRef, createContext, useContext, useMemo } from 'react';

// --- FIREBASE IMPORTS ---
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
    getAuth, 
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    getDoc, 
    collection,
    onSnapshot,
    query,
    addDoc,
    updateDoc,
    deleteDoc,
    writeBatch,
    where,
    getDocs,
    collectionGroup,
    setDoc
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

// Initialize Firebase (Safe Singleton Pattern to prevent crashes)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const BlockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
const ServerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>;
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const ShoppingCartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
const TrendingDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>;
const SyncIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6"/><path d="M2.5 22v-6h6"/><path d="M21.5 8a10 10 0 1 1-18.4-5.3L2.5 2"/><path d="M2.5 16a10 10 0 1 1 18.4 5.3L21.5 22"/></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-8.77"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const AlertCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-4.73-4.73A19.79 19.79 0 0 1 2 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.45 2.18-.75 4.93-1.8 6.09-.9.9-.11 2.21.36 2.68a18.25 18.25 0 0 0 6.09 6.09c.47.47 1.78 1.26 2.68.36 1.16-1.05 3.91-2.25 6.09-1.8a2 2 0 0 1 1.72 2z"></path></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2.5 12h19."></path></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;


// --- Reusable UI Components ---
const Card = ({ children, className = '' }) => <div className={`bg-white rounded-lg shadow-sm ${className}`}>{children}</div>;
const Button = ({ children, onClick, className = '', ...props }) => <button onClick={onClick} className={`px-4 py-2 font-semibold rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50 ${className}`} {...props}>{children}</button>;
const Spinner = () => <div className="flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <div className="flex justify-center items-center space-x-2 mt-6 p-4">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded-md disabled:opacity-50">Prev</button>
            {pages.map(page => (
                <button key={page} onClick={() => onPageChange(page)} className={`px-3 py-1 border rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : ''}`}>
                    {page}
                </button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button>
        </div>
    );
};


// --- Admin Panel Components ---

const StatCard = ({ title, value, icon, change, changeType }) => {
    const { convertCurrency, currencySymbol } = useCurrency();
    const displayValue = title.toLowerCase().includes('amount') || title.toLowerCase().includes('recharge') 
        ? `${currencySymbol} ${convertCurrency(value)}` 
        : value;

    return (
        <Card className="p-4">
            <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold">{displayValue}</p>
                </div>
            </div>
            {change && (
                <div className={`mt-2 text-xs flex items-center ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                    {changeType === 'increase' ? <TrendingUpIcon className="w-4 h-4" /> : <TrendingDownIcon className="w-4 h-4" />}
                    <span className="ml-1">{change}</span>
                </div>
            )}
        </Card>
    );
};

const DashboardPage = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalRecharge: 0, totalOtpSellAmount: 29511 });
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { convertCurrency, currencySymbol } = useCurrency();

    useEffect(() => {
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => doc.data());
            const totalUsers = usersData.length;
            const totalRecharge = usersData.reduce((acc, user) => acc + (user.balance || 0), 0);
            const sortedUsers = [...usersData].sort((a, b) => b.balance - a.balance).slice(0, 5);
            setStats(prev => ({ ...prev, totalUsers, totalRecharge }));
            setTopUsers(sortedUsers);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="TOTAL USER" value={stats.totalUsers} icon={<UsersIcon />} />
                <StatCard title="TOTAL RECHARGE" value={stats.totalRecharge} icon={<ShoppingCartIcon />} />
                <StatCard title="TOTAL OTP SELL" value="194" icon={<TrendingUpIcon />} />
                <StatCard title="TOTAL OTP SELL AMOUNT" value={stats.totalOtpSellAmount} icon={<DollarSignIcon />} />
            </div>
            <Card>
                <div className="p-4"><h2 className="text-xl font-bold">Top Users by Balance</h2></div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Balance</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {topUsers.map((user, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{currencySymbol} {convertCurrency(user.balance)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const EditUserModal = ({ user, onClose, onSave }) => {
    const [balance, setBalance] = useState(user.balance || 0);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        await onSave(user.id, { balance: parseFloat(balance) });
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <Card className="w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit User</h2>
                    <button onClick={onClose}><XCircleIcon /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input value={user.email} disabled className="w-full mt-1 border-gray-300 rounded-md bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Balance (in USD)</label>
                        <input type="number" step="0.01" value={balance} onChange={e => setBalance(e.target.value)} className="w-full mt-1 border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Total Recharge (Display Only)</label>
                        <input value={user.totalRecharge || 0} disabled className="w-full mt-1 border-gray-300 rounded-md bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Total OTP Buy (Display Only)</label>
                        <input value={user.totalOtpBuy || 0} disabled className="w-full mt-1 border-gray-300 rounded-md bg-gray-100" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <Button onClick={onClose} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
                    <Button onClick={handleSave} disabled={loading}>{loading ? <Spinner /> : 'Save'}</Button>
                </div>
            </Card>
        </div>
    );
};


const UserTable = ({ users, onStatusChange, onEdit }) => {
    const { convertCurrency, currencySymbol } = useCurrency();
    return (
        <table className="min-w-full">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                    <tr key={user.id}>
                        <td className="px-6 py-4">{user.displayName}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{currencySymbol} {convertCurrency(user.balance)}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {user.status || 'active'}
                            </span>
                        </td>
                        <td className="px-6 py-4">{user.createdAt && new Date(user.createdAt.seconds * 1000).toLocaleDateString()}</td>
                        <td className="px-6 py-4 space-x-4">
                            <button onClick={() => onEdit(user)} className="text-blue-600 hover:text-blue-900"><EditIcon /></button>
                            <button onClick={() => onStatusChange(user.id, user.status === 'blocked' ? 'active' : 'blocked')} 
                                    className={`text-sm font-medium ${user.status === 'blocked' ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`}>
                                {user.status === 'blocked' ? 'Unblock' : 'Block'}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const ManageUsersPage = ({ filter }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        let q;
        if (filter) {
            q = query(collection(db, "users"), where("status", "==", filter));
        } else {
            q = query(collection(db, "users"));
        }
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [filter]);

    const handleStatusChange = async (userId, newStatus) => {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, { status: newStatus });
    };

    const handleSaveUser = async (userId, data) => {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, data);
    };
    
    const filteredUsers = users.filter(user => 
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUser} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{filter ? `${filter.charAt(0).toUpperCase() + filter.slice(1)} Users` : 'All Users'}</h1>
                <form className="w-1/3 relative">
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full border-gray-300 rounded-md shadow-sm pl-10" />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </form>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    {loading ? <Spinner /> : <UserTable users={paginatedUsers} onStatusChange={handleStatusChange} onEdit={setEditingUser} />}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </Card>
        </div>
    );
};

const FindUserPage = ({ initialSearchTerm, setPage }) => {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const q = query(collection(db, "users"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllUsers(usersData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const results = allUsers.filter(user =>
            (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (user.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(results);
        setCurrentPage(1);
    }, [searchTerm, allUsers]);

    const handleStatusChange = async (userId, newStatus) => {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, { status: newStatus });
    };

    const handleSaveUser = async (userId, data) => {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, data);
    };

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
             {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUser} />}
            <h1 className="text-3xl font-bold mb-6">Find User</h1>
            <Card className="p-6">
                <form onSubmit={e => e.preventDefault()} className="flex space-x-4 mb-6">
                    <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Enter user email or name..." className="flex-grow border-gray-300 rounded-md" />
                </form>
                <div className="overflow-x-auto">
                    {loading ? <Spinner /> : <UserTable users={paginatedUsers} onStatusChange={handleStatusChange} onEdit={setEditingUser} />}
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </Card>
        </div>
    );
};


const ManageServicesPage = () => {
    const [services, setServices] = useState([]);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [commission, setCommission] = useState(20);
    const { convertCurrency, currencySymbol } = useCurrency();
    
    useEffect(() => {
        const unsubServices = onSnapshot(collection(db, "services"), (snapshot) => {
            const servicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setServices(servicesData);
            setLoading(false);
        });
        const unsubProviders = onSnapshot(collection(db, "api_providers"), (snapshot) => {
            setProviders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => { unsubServices(); unsubProviders(); };
    }, []);

    const fetchAndSaveServices = async () => {
        if (!selectedProvider) return;
        setLoading(true);
        try {
            const providerDoc = providers.find(p => p.name === selectedProvider);
            if (!providerDoc) throw new Error("Provider not found");

            const response = await fetch('/.netlify/functions/api-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider: selectedProvider, endpoint: '/guest/products/any/any' }),
            });

            const result = await response.json();
            if (response.ok && result) {
                const batch = writeBatch(db);
                const existingServices = await getDocs(query(collection(db, "services"), where("provider", "==", selectedProvider)));
                existingServices.forEach(doc => batch.delete(doc.ref));

                Object.entries(result).forEach(([name, details]) => {
                    const serviceRef = doc(collection(db, "services"));
                    const newPrice = details.Price * (1 + commission / 100);
                    batch.set(serviceRef, {
                        name: name.charAt(0).toUpperCase() + name.slice(1),
                        price: parseFloat(newPrice.toFixed(2)),
                        provider: selectedProvider,
                        originalPrice: details.Price,
                        status: 'active'
                    });
                });
                await batch.commit();
            } else {
                throw new Error(result.error || "Failed to fetch services");
            }
        } catch (error) {
            console.error("Error fetching and saving services:", error);
        }
        setLoading(false);
    };

    const handleSelectService = (id) => {
        setSelectedServices(prev => prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]);
    };

    const handleSelectAllServices = (e) => {
        if (e.target.checked) {
            setSelectedServices(services.map(s => s.id));
        } else {
            setSelectedServices([]);
        }
    };

    const handleBulkDeleteServices = async () => {
        if (selectedServices.length === 0 || !window.confirm(`Delete ${selectedServices.length} selected services?`)) return;
        const batch = writeBatch(db);
        selectedServices.forEach(id => {
            batch.delete(doc(db, "services", id));
        });
        await batch.commit();
        setSelectedServices([]);
    };

    const filteredServices = services.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Services</h1>
            <Card className="p-6 mb-8">
                <div className="flex items-end justify-between">
                    <div className="flex-1 space-y-2">
                        <h2 className="text-xl font-bold">Synchronize Services from Provider</h2>
                        <p className="text-sm text-gray-500">Fetches all available services and prices from the provider API and saves them to your database.</p>
                        <div className="flex items-center space-x-4">
                            <select 
                                value={selectedProvider} 
                                onChange={(e) => setSelectedProvider(e.target.value)} 
                                className="w-40 border-gray-300 rounded-md"
                            >
                                <option value="">Select Provider</option>
                                {providers.map(p => (
                                    <option key={p.id} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                            <div className="flex items-center">
                                <label className="text-sm font-medium text-gray-700 mr-2">Profit %</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={commission}
                                    onChange={(e) => setCommission(e.target.value)}
                                    className="w-20 border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                    <Button onClick={fetchAndSaveServices} disabled={loading || !selectedProvider}>
                        <div className="flex items-center space-x-2">
                            {loading ? <Spinner /> : <SyncIcon />}
                            <span>Sync Services</span>
                        </div>
                    </Button>
                </div>
            </Card>
            <Card>
                <div className="p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Existing Services ({services.length})</h2>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search services..." className="w-full border-gray-300 rounded-md shadow-sm pl-10" />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        {selectedServices.length > 0 && (
                            <Button onClick={handleBulkDeleteServices} className="bg-red-600 hover:bg-red-700">Delete Selected ({selectedServices.length})</Button>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? <Spinner /> : (
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3"><input type="checkbox" onChange={handleSelectAllServices} checked={selectedServices.length === services.length && services.length > 0} /></th>
                                    <th className="px-6 py-3 text-left">Name</th>
                                    <th className="px-6 py-3 text-left">Price</th>
                                    <th className="px-6 py-3 text-left">Provider</th>
                                    <th className="px-6 py-3 text-left">Original Price</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredServices.map(s => (
                                    <tr key={s.id}>
                                        <td className="px-6 py-4"><input type="checkbox" checked={selectedServices.includes(s.id)} onChange={() => handleSelectService(s.id)} /></td>
                                        <td className="px-6 py-4 flex items-center">{s.icon && <span className="mr-3 text-xl">{s.icon}</span>}{s.name}</td>
                                        <td className="px-6 py-4">{currencySymbol} {convertCurrency(s.price)}</td>
                                        <td className="px-6 py-4">{s.provider}</td>
                                        <td className="px-6 py-4">{s.originalPrice ? `${currencySymbol} ${convertCurrency(s.originalPrice)}` : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>
        </div>
    );
};

const ManageServersPage = () => {
    const [servers, setServers] = useState([]);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedServers, setSelectedServers] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const unsubServers = onSnapshot(collection(db, "servers"), (snapshot) => {
            setServers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        const unsubProviders = onSnapshot(collection(db, "api_providers"), (snapshot) => {
            setProviders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => { unsubServers(); unsubProviders(); };
    }, []);

    const fetchAndSaveServers = async () => {
        if (!selectedProvider) return;
        setLoading(true);
        try {
            const response = await fetch('/.netlify/functions/api-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider: selectedProvider, endpoint: '/guest/countries' }),
            });
            const result = await response.json();
            if (response.ok && result) {
                const batch = writeBatch(db);
                const existingServers = await getDocs(query(collection(db, "servers"), where("provider", "==", selectedProvider)));
                existingServers.forEach(doc => batch.delete(doc.ref));

                Object.entries(result).forEach(([name, details]) => {
                    const serverRef = doc(collection(db, "servers"));
                    const isoCode = Object.keys(details.iso)[0] || 'any';
                    batch.set(serverRef, {
                        name: name,
                        location: details.text_en,
                        iso: isoCode,
                        status: 'active',
                        provider: selectedProvider
                    });
                });
                await batch.commit();
            } else {
                throw new Error(result.error || "Failed to fetch servers");
            }
        } catch (error) {
            console.error("Error fetching and saving servers:", error);
        }
        setLoading(false);
    };

    const handleSelectServer = (id) => {
        setSelectedServers(prev => prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]);
    };

    const handleSelectAllServers = (e) => {
        if (e.target.checked) {
            setSelectedServers(servers.map(s => s.id));
        } else {
            setSelectedServers([]);
        }
    };
    
    const handleBulkDeleteServers = async () => {
        if (selectedServers.length === 0 || !window.confirm(`Delete ${selectedServers.length} selected servers?`)) return;
        const batch = writeBatch(db);
        selectedServers.forEach(id => {
            batch.delete(doc(db, "servers", id));
        });
        await batch.commit();
        setSelectedServers([]);
    };


    const filteredServers = servers.filter(s => s.location?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Servers (Countries)</h1>
            <Card className="p-6 mb-8">
                <div className="flex items-end justify-between">
                    <div className="flex-1 space-y-2">
                        <h2 className="text-xl font-bold">Synchronize Servers from Provider</h2>
                        <p className="text-sm text-gray-500">Fetches all available countries from the provider API and saves them to your database.</p>
                        <select 
                            value={selectedProvider} 
                            onChange={(e) => setSelectedProvider(e.target.value)} 
                            className="w-40 border-gray-300 rounded-md"
                        >
                            <option value="">Select Provider</option>
                            {providers.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <Button onClick={fetchAndSaveServers} disabled={loading || !selectedProvider}>
                        <div className="flex items-center space-x-2">
                            {loading ? <Spinner /> : <SyncIcon />}
                            <span>Sync Servers</span>
                        </div>
                    </Button>
                </div>
            </Card>
            <Card>
                <div className="p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Existing Servers ({servers.length})</h2>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search countries..." className="w-full border-gray-300 rounded-md shadow-sm pl-10" />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        {selectedServers.length > 0 && (
                            <Button onClick={handleBulkDeleteServers} className="bg-red-600 hover:bg-red-700">Delete Selected ({selectedServers.length})</Button>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? <Spinner /> : (
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3"><input type="checkbox" onChange={handleSelectAllServers} checked={selectedServers.length === servers.length && servers.length > 0} /></th>
                                    <th className="px-6 py-3 text-left">Flag</th>
                                    <th className="px-6 py-3 text-left">Name (for API)</th>
                                    <th className="px-6 py-3 text-left">Location (for Display)</th>
                                    <th className="px-6 py-3 text-left">Provider</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredServers.map(server => (
                                    <tr key={server.id}>
                                        <td className="px-6 py-4"><input type="checkbox" checked={selectedServers.includes(server.id)} onChange={() => handleSelectServer(server.id)} /></td>
                                        <td className="px-6 py-4">{server.iso && <img src={`https://flagcdn.com/w20/${server.iso.toLowerCase()}.png`} alt={`${server.location} flag`} className="w-5 h-auto" />}</td>
                                        <td className="px-6 py-4">{server.name}</td>
                                        <td className="px-6 py-4">{server.location}</td>
                                        <td className="px-6 py-4">{server.provider}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>
        </div>
    );
};

const ManageOperatorsPage = () => {
    const [operators, setOperators] = useState([]);
    const [providers, setProviders] = useState([]);
    const [servers, setServers] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOperators, setSelectedOperators] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [selectedServer, setSelectedServer] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [randomCountriesCount, setRandomCountriesCount] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const { convertCurrency, currencySymbol } = useCurrency();
    
    useEffect(() => {
        const unsubProviders = onSnapshot(collection(db, "api_providers"), (snapshot) => {
            setProviders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        const unsubServers = onSnapshot(collection(db, "servers"), (snapshot) => {
            setServers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        const unsubServices = onSnapshot(collection(db, "services"), (snapshot) => {
            setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        const unsubOperators = onSnapshot(collection(db, "operators"), (snapshot) => {
            setOperators(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => { unsubProviders(); unsubServers(); unsubServices(); unsubOperators() };
    }, []);

    const serverMap = useMemo(() => {
        return servers.reduce((acc, server) => {
            acc[server.name] = server;
            return acc;
        }, {});
    }, [servers]);

    const fetchAndSaveOperators = async () => {
        if (!selectedProvider || !selectedServer || !selectedService) return;
        setLoading(true);
        try {
            const response = await fetch('/.netlify/functions/api-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    provider: selectedProvider, 
                    endpoint: `/guest/prices?country=${selectedServer}&product=${selectedService}` 
                }),
            });
            const result = await response.json();
            if (response.ok && result) {
                const batch = writeBatch(db);
                const existingOps = await getDocs(query(collection(db, "operators"), where("provider", "==", selectedProvider), where("server", "==", selectedServer), where("service", "==", selectedService)));
                existingOps.forEach(doc => batch.delete(doc.ref));

                const countryData = result[selectedServer];
                if (countryData && countryData[selectedService]) {
                    Object.entries(countryData[selectedService]).forEach(([name, details]) => {
                        const operatorRef = doc(collection(db, "operators"));
                        batch.set(operatorRef, {
                            name: name,
                            provider: selectedProvider,
                            server: selectedServer,
                            service: selectedService,
                            price: details.cost,
                            count: details.count
                        });
                    });
                }
                await batch.commit();
            } else {
                throw new Error(result.error || "Failed to fetch operators");
            }
        } catch (error) {
            console.error("Error fetching and saving operators:", error);
        }
        setLoading(false);
    };

    const fetchAndSaveAllOperators = async () => {
        if (!selectedProvider) return;

        setLoading(true);
        console.log('Starting full sync of all operators...');
        try {
            const serversDocs = await getDocs(collection(db, "servers"));
            const servicesDocs = await getDocs(collection(db, "services"));

            const allServers = serversDocs.docs.map(doc => doc.data());
            const allServices = servicesDocs.docs.map(doc => doc.data());
            const allOperatorsRef = collection(db, "operators");
            
            // Clear existing operators for the selected provider
            const existingOps = await getDocs(query(allOperatorsRef, where("provider", "==", selectedProvider)));
            const deleteBatch = writeBatch(db);
            existingOps.forEach(doc => deleteBatch.delete(doc.ref));
            await deleteBatch.commit();
            console.log(`Deleted all existing operators for provider ${selectedProvider} from Firestore.`);

            let currentBatch = writeBatch(db);
            let batchCount = 0;
            const BATCH_SIZE = 490;

            for (const server of allServers) {
                for (const service of allServices) {
                    try {
                        const endpoint = `/guest/prices?country=${server.name}&product=${service.name.toLowerCase()}`;
                        const response = await fetch('/.netlify/functions/api-proxy', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                provider: selectedProvider, 
                                endpoint: endpoint
                            }),
                        });
                        const result = await response.json();
                        
                        if (response.ok && result && result[server.name] && result[server.name][service.name.toLowerCase()]) {
                            Object.entries(result[server.name][service.name.toLowerCase()]).forEach(([opName, opDetails]) => {
                                const operatorRef = doc(allOperatorsRef);
                                currentBatch.set(operatorRef, {
                                    name: opName,
                                    provider: selectedProvider,
                                    server: server.name,
                                    service: service.name.toLowerCase(),
                                    price: opDetails.cost,
                                    count: opDetails.count
                                });
                                batchCount++;
                            });
                        }
                    } catch (error) {
                        console.error(`Failed to fetch operators for ${selectedProvider}/${server.name}/${service.name.toLowerCase()}:`, error);
                    }
                    // Add a small delay to avoid hitting rate limits
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    // Commit batch if it's full
                    if (batchCount >= BATCH_SIZE) {
                        await currentBatch.commit();
                        currentBatch = writeBatch(db);
                        batchCount = 0;
                        console.log('Batch committed. Starting a new one.');
                    }
                }
            }

            // Commit any remaining documents in the final batch
            if (batchCount > 0) {
                await currentBatch.commit();
            }

            setLoading(false);
            console.log('Full operator sync complete!');
        } catch (error) {
            console.error("Error during full operator sync:", error);
            setLoading(false);
        }
    };
    
    const fetchAndSaveOperatorsByService = async () => {
        if (!selectedProvider || !selectedService) return;
        
        setLoading(true);
        console.log(`Starting sync for provider ${selectedProvider} and service ${selectedService}...`);
        try {
            const serversDocs = await getDocs(collection(db, "servers"));
            const allServers = serversDocs.docs.map(doc => doc.data());
            const allOperatorsRef = collection(db, "operators");

            // Clear existing operators for the selected provider and service
            const existingOps = await getDocs(query(allOperatorsRef, where("provider", "==", selectedProvider), where("service", "==", selectedService)));
            const deleteBatch = writeBatch(db);
            existingOps.forEach(doc => deleteBatch.delete(doc.ref));
            await deleteBatch.commit();
            console.log(`Deleted existing operators for ${selectedService} from Firestore.`);

            let currentBatch = writeBatch(db);
            let batchCount = 0;
            const BATCH_SIZE = 490;

            for (const server of allServers) {
                try {
                    const endpoint = `/guest/prices?country=${server.name}&product=${selectedService}`;
                    const response = await fetch('/.netlify/functions/api-proxy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            provider: selectedProvider,
                            endpoint: endpoint
                        }),
                    });
                    const result = await response.json();
                    
                    if (response.ok && result && result[server.name] && result[server.name][selectedService]) {
                        Object.entries(result[server.name][selectedService]).forEach(([opName, opDetails]) => {
                            const operatorRef = doc(allOperatorsRef);
                            currentBatch.set(operatorRef, {
                                name: opName,
                                provider: selectedProvider,
                                server: server.name,
                                service: selectedService,
                                price: opDetails.cost,
                                count: opDetails.count
                            });
                            batchCount++;
                        });
                    }
                } catch (error) {
                    console.error(`Failed to fetch operators for ${selectedProvider}/${server.name}/${selectedService}:`, error);
                }
                // Add a small delay to avoid hitting rate limits
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Commit batch if it's full
                if (batchCount >= BATCH_SIZE) {
                    await currentBatch.commit();
                    currentBatch = writeBatch(db);
                    batchCount = 0;
                    console.log('Batch committed. Starting a new one.');
                }
            }
            if (batchCount > 0) {
                await currentBatch.commit();
            }

            setLoading(false);
            console.log('Service operator sync complete!');
        } catch (error) {
            console.error("Error during service operator sync:", error);
            setLoading(false);
        }
    };
    
    const fetchRandomOperators = async () => {
        if (!selectedProvider || !selectedService || randomCountriesCount <= 0) return;
        setLoading(true);
        console.log(`Starting sync of ${randomCountriesCount} random countries for service ${selectedService}...`);

        try {
            const serversDocs = await getDocs(collection(db, "servers"));
            const allServers = serversDocs.docs.map(doc => doc.data());
            const allOperatorsRef = collection(db, "operators");

            const existingOps = await getDocs(query(allOperatorsRef, where("provider", "==", selectedProvider), where("service", "==", selectedService)));
            const deleteBatch = writeBatch(db);
            existingOps.forEach(doc => deleteBatch.delete(doc.ref));
            await deleteBatch.commit();
            console.log(`Deleted existing operators for ${selectedService} from Firestore.`);

            // Shuffle the servers and pick the top N
            const shuffledServers = allServers.sort(() => 0.5 - Math.random());
            const randomServers = shuffledServers.slice(0, randomCountriesCount);

            let currentBatch = writeBatch(db);
            let batchCount = 0;
            const BATCH_SIZE = 490;

            for (const server of randomServers) {
                try {
                    const endpoint = `/guest/prices?country=${server.name}&product=${selectedService}`;
                    const response = await fetch('/.netlify/functions/api-proxy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            provider: selectedProvider,
                            endpoint: endpoint
                        }),
                    });
                    const result = await response.json();

                    if (response.ok && result && result[server.name] && result[server.name][selectedService]) {
                        Object.entries(result[server.name][selectedService]).forEach(([opName, opDetails]) => {
                            const operatorRef = doc(allOperatorsRef);
                            currentBatch.set(operatorRef, {
                                name: opName,
                                provider: selectedProvider,
                                server: server.name,
                                service: selectedService,
                                price: opDetails.cost,
                                count: opDetails.count
                            });
                            batchCount++;
                        });
                    }
                } catch (error) {
                    console.error(`Failed to fetch operators for ${selectedProvider}/${server.name}/${selectedService}:`, error);
                }
                await new Promise(resolve => setTimeout(resolve, 500));

                if (batchCount >= BATCH_SIZE) {
                    await currentBatch.commit();
                    currentBatch = writeBatch(db);
                    batchCount = 0;
                    console.log('Batch committed. Starting a new one.');
                }
            }
            if (batchCount > 0) {
                await currentBatch.commit();
            }

            setLoading(false);
            console.log(`Synced operators for ${randomCountriesCount} random countries.`);
        } catch (error) {
            console.error("Error during random operator sync:", error);
            setLoading(false);
        }
    };


    const handleSelectOperator = (id) => {
        setSelectedOperators(prev => prev.includes(id) ? prev.filter(oId => oId !== id) : [...prev, id]);
    };

    const handleSelectAllOperators = (e) => {
        if (e.target.checked) {
            setSelectedOperators(operators.map(o => o.id));
        } else {
            setSelectedOperators([]);
        }
    };
    
    const handleBulkDeleteOperators = async () => {
        if (selectedOperators.length === 0 || !window.confirm(`Delete ${selectedOperators.length} selected operators?`)) return;
        const batch = writeBatch(db);
        selectedOperators.forEach(id => {
            batch.delete(doc(db, "operators", id));
        });
        await batch.commit();
        setSelectedOperators([]);
    };

    const filteredOperators = operators.filter(o => o.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Operators</h1>
            <Card className="p-6 mb-8">
                <div className="flex items-end justify-between">
                    <div className="flex-1 space-y-2">
                        <h2 className="text-xl font-bold">Synchronize Operators by Country and Service</h2>
                        <p className="text-sm text-gray-500">Fetches operators for a specific provider, country, and service, then saves them to your database.</p>
                        <div className="flex items-center space-x-4">
                            <select 
                                value={selectedProvider} 
                                onChange={(e) => setSelectedProvider(e.target.value)} 
                                className="w-40 border-gray-300 rounded-md"
                            >
                                <option value="">Select Provider</option>
                                {providers.map(p => (
                                    <option key={p.id} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                            <select 
                                value={selectedServer} 
                                onChange={(e) => setSelectedServer(e.target.value)} 
                                className="w-40 border-gray-300 rounded-md"
                            >
                                <option value="">Select Server</option>
                                {servers.map(s => (
                                    <option key={s.id} value={s.name}>{s.location}</option>
                                ))}
                            </select>
                             <select 
                                value={selectedService} 
                                onChange={(e) => setSelectedService(e.target.value)} 
                                className="w-40 border-gray-300 rounded-md"
                            >
                                <option value="">Select Service</option>
                                {services.map(s => (
                                    <option key={s.id} value={s.name.toLowerCase()}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <Button onClick={fetchAndSaveOperators} disabled={loading || !selectedProvider || !selectedServer || !selectedService}>
                        <div className="flex items-center space-x-2">
                            {loading ? <Spinner /> : <SyncIcon />}
                            <span>Sync Operators</span>
                        </div>
                    </Button>
                </div>
            </Card>
             <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">One-Click Full Sync</h2>
                <p className="text-sm text-gray-500 mb-4">Fetches all operators for all services and countries for a selected provider. This may take a while.</p>
                <div className="flex items-center space-x-4 mb-4">
                    <select
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        className="w-40 border-gray-300 rounded-md"
                    >
                        <option value="">Select Provider</option>
                        {providers.map(p => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                    <Button onClick={fetchAndSaveAllOperators} disabled={loading || !selectedProvider || servers.length === 0 || services.length === 0}>
                        <div className="flex items-center space-x-2">
                            {loading ? <Spinner /> : <SyncIcon />}
                            <span>Sync All Operators</span>
                        </div>
                    </Button>
                </div>
            </Card>
            <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Sync Operators by Service</h2>
                <p className="text-sm text-gray-500 mb-4">Fetches all operators for a specific service across all countries for the selected provider.</p>
                <div className="flex items-center space-x-4 mb-4">
                    <select
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        className="w-40 border-gray-300 rounded-md"
                    >
                        <option value="">Select Provider</option>
                        {providers.map(p => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                    <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-40 border-gray-300 rounded-md"
                    >
                        <option value="">Select Service</option>
                        {services.map(s => (
                            <option key={s.id} value={s.name.toLowerCase()}>{s.name}</option>
                        ))}
                    </select>
                    <Button onClick={fetchAndSaveOperatorsByService} disabled={loading || !selectedProvider || !selectedService || servers.length === 0}>
                        <div className="flex items-center space-x-2">
                            {loading ? <Spinner /> : <SyncIcon />}
                            <span>Sync Service Operators</span>
                        </div>
                    </Button>
                </div>
            </Card>
            <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Sync Random Operators</h2>
                <p className="text-sm text-gray-500 mb-4">Fetches operators for a random selection of countries for the chosen provider and service.</p>
                <div className="flex items-center space-x-4 mb-4">
                    <select
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        className="w-40 border-gray-300 rounded-md"
                    >
                        <option value="">Select Provider</option>
                        {providers.map(p => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                    <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-40 border-gray-300 rounded-md"
                    >
                        <option value="">Select Service</option>
                        {services.map(s => (
                            <option key={s.id} value={s.name.toLowerCase()}>{s.name}</option>
                        ))}
                    </select>
                    <div className="flex items-center">
                        <input
                            type="number"
                            min="1"
                            value={randomCountriesCount}
                            onChange={(e) => setRandomCountriesCount(Number(e.target.value))}
                            placeholder="Number of countries"
                            className="w-40 border-gray-300 rounded-md"
                        />
                    </div>
                    <Button onClick={fetchRandomOperators} disabled={loading || !selectedProvider || !selectedService || randomCountriesCount <= 0}>
                        <div className="flex items-center space-x-2">
                            {loading ? <Spinner /> : <SyncIcon />}
                            <span>Sync Random Operators</span>
                        </div>
                    </Button>
                </div>
            </Card>
            <Card>
                <div className="p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Existing Operators ({operators.length})</h2>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search operators..." className="w-full border-gray-300 rounded-md shadow-sm pl-10" />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        {selectedOperators.length > 0 && (
                            <Button onClick={handleBulkDeleteOperators} className="bg-red-600 hover:bg-red-700">Delete Selected ({selectedOperators.length})</Button>
                        )}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? <Spinner /> : (
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3"><input type="checkbox" onChange={handleSelectAllOperators} checked={selectedOperators.length === operators.length && operators.length > 0} /></th>
                                    <th className="px-6 py-3 text-left">Country</th>
                                    <th className="px-6 py-3 text-left">Service</th>
                                    <th className="px-6 py-3 text-left">Operator Name</th>
                                    <th className="px-6 py-3 text-left">Price</th>
                                    <th className="px-6 py-3 text-left">Count</th>
                                    <th className="px-6 py-3 text-left">Provider</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOperators.map(op => {
                                    const serverInfo = serverMap[op.server];
                                    return (
                                    <tr key={op.id}>
                                        <td className="px-6 py-4"><input type="checkbox" checked={selectedOperators.includes(op.id)} onChange={() => handleSelectOperator(op.id)} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                {serverInfo?.iso && <img src={`https://flagcdn.com/w20/${serverInfo.iso.toLowerCase()}.png`} alt={`${serverInfo.location} flag`} className="w-5 h-auto flex-shrink-0" />}
                                                <span>{serverInfo?.location || op.server}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap capitalize">{op.service}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{op.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{currencySymbol} {convertCurrency(op.price)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{op.count}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{op.provider}</td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>
        </div>
    );
};

const ManageApisPage = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "api_providers"), (snapshot) => {
            const providersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProviders(providersData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSaveProvider = async (providerId, data) => {
        if (!providerId) {
            await addDoc(collection(db, "api_providers"), data);
        } else {
            await setDoc(doc(db, "api_providers", providerId), data, { merge: true });
        }
    };

    const handleDeleteProvider = async (providerId) => {
        if (window.confirm("Are you sure you want to delete this API provider?")) {
            await deleteDoc(doc(db, "api_providers", providerId));
        }
    };
    const [editingProvider, setEditingProvider] = useState(null);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage API Providers</h1>
            <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Add/Edit Provider</h2>
                <ApiProviderForm provider={editingProvider} onSave={handleSaveProvider} onCancel={() => setEditingProvider(null)} />
            </Card>
            <Card>
                <div className="p-4">
                    <h2 className="text-xl font-bold">Existing Providers ({providers.length})</h2>
                </div>
                <div className="overflow-x-auto">
                    {loading ? <Spinner /> : (
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">Name</th>
                                    <th className="px-6 py-3 text-left">Base URL</th>
                                    <th className="px-6 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {providers.map(p => (
                                    <tr key={p.id}>
                                        <td className="px-6 py-4">{p.name}</td>
                                        <td className="px-6 py-4">{p.baseUrl}</td>
                                        <td className="px-6 py-4 space-x-4">
                                            <button onClick={() => setEditingProvider(p)} className="text-blue-600 hover:text-blue-900"><EditIcon /></button>
                                            <button onClick={() => handleDeleteProvider(p.id)} className="text-red-600 hover:text-red-900"><TrashIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>
        </div>
    );
};

const ApiProviderForm = ({ provider, onSave, onCancel }) => {
    const [name, setName] = useState(provider?.name || '');
    const [baseUrl, setBaseUrl] = useState(provider?.baseUrl || '');
    const [apiKey, setApiKey] = useState(provider?.apiKey || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (provider) {
            setName(provider.name);
            setBaseUrl(provider.baseUrl);
            setApiKey(provider.apiKey);
        } else {
            setName('');
            setBaseUrl('');
            setApiKey('');
        }
    }, [provider]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = { name, baseUrl, apiKey };
        await onSave(provider?.id, data);
        setLoading(false);
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Provider Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium">Base URL</label>
                <input type="url" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium">API Key</label>
                <input type="text" value={apiKey} onChange={e => setApiKey(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="flex justify-end space-x-4">
                <Button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? <Spinner /> : 'Save Provider'}</Button>
            </div>
        </form>
    );
};

const NumberHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { convertCurrency, currencySymbol } = useCurrency();

    useEffect(() => {
        const q = query(collectionGroup(db, "orders"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setOrders(ordersData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredOrders = orders.filter(order =>
        (order.product?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (order.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (order.userId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Number History</h1>
            <Card>
                <div className="p-4 flex justify-between items-center">
                    <div>
                        Show <select value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))} className="mx-2 border-gray-300 rounded-md">
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select> entries
                    </div>
                    <div className="w-1/3 relative">
                        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full border-gray-300 rounded-md shadow-sm pl-10" />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? <Spinner /> : (
                                     <table className="min-w-full">
                                         <thead className="bg-gray-50">
                                             <tr>
                                                 <th className="px-6 py-3 text-left">Service</th>
                                                 <th className="px-6 py-3 text-left">Number</th>
                                                 <th className="px-6 py-3 text-left">Charge</th>
                                                 <th className="px-6 py-3 text-left">Buy Time</th>
                                                 <th className="px-6 py-3 text-left">User ID</th>
                                             </tr>
                                         </thead>
                                         <tbody className="bg-white divide-y divide-gray-200">
                                             {paginatedOrders.map(order => (
                                                 <tr key={order.id}>
                                                     <td className="px-6 py-4">{order.product}</td>
                                                     <td className="px-6 py-4">{order.phone}</td>
                                                     <td className="px-6 py-4">{currencySymbol} {convertCurrency(order.price)}</td>
                                                     <td className="px-6 py-4">{order.createdAt && new Date(order.createdAt.seconds * 1000).toLocaleString()}</td>
                                                     <td className="px-6 py-4 text-xs">{order.userId}</td>
                                                 </tr>
                                             ))}
                                         </tbody>
                                     </table>
                    )}
                </div>
                 <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </Card>
        </div>
    );
};

const ContentPage = ({ title }) => (
    <div>
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        <Card className="p-6">
            <p>This page is under construction. Check back later for the "{title}" feature.</p>
        </Card>
    </div>
);

const sidebarItems = [
    { name: 'Dashboard', icon: <DashboardIcon />, page: 'dashboard' },
    { name: 'All Users', icon: <UsersIcon />, page: 'all_user' },
    { name: 'Blocked Users', icon: <BlockIcon />, page: 'blocked_user' },
    { name: 'Find User', icon: <SearchIcon />, page: 'find_user' },
    { name: 'Manage Services', icon: <PlusCircleIcon />, page: 'manage_services' },
    { name: 'Manage Servers', icon: <ServerIcon />, page: 'manage_servers' },
    { name: 'Manage Operators', icon: <PhoneIcon />, page: 'manage_operators'},
    { name: 'Manage APIs', icon: <CodeIcon />, page: 'manage_apis' },
    { name: 'Number History', icon: <ListIcon />, page: 'number_history' },
];

const Sidebar = ({ page, setPage, isSidebarOpen, setSidebarOpen }) => (
    <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="h-16 flex items-center justify-center text-2xl font-bold text-blue-600 border-b">
            Admin Panel
        </div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map(item => (
                <a key={item.page} href="#" onClick={(e) => { e.preventDefault(); setPage(item.page); isSidebarOpen && setSidebarOpen(false); }}
                   className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${page === item.page ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {item.icon}
                    <span>{item.name}</span>
                </a>
            ))}
             <div className="border-t my-4"></div>
             {/* Back to Website - Reloads page to reset state */}
             <a href="/" className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
                <HomeIcon />
                <span>Back to Website</span>
             </a>
        </nav>
    </aside>
);

const AdminPanel = ({ admin }) => {
    const [page, setPage] = useState('dashboard');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [globalSearchTerm, setGlobalSearchTerm] = useState('');
    const { setCurrency } = useCurrency();

    const handleLogout = async () => {
        await signOut(auth);
        // Main App listener will handle state change
    };
    
    const handleGlobalSearch = (e) => {
        e.preventDefault();
        setPage('find_user');
    };

    const renderPage = () => {
        switch(page) {
            case 'dashboard': return <DashboardPage />;
            case 'all_user': return <ManageUsersPage filter={null} />;
            case 'blocked_user': return <ManageUsersPage filter="blocked" />;
            case 'find_user': return <FindUserPage initialSearchTerm={globalSearchTerm} setPage={setPage} />;
            case 'manage_services': return <ManageServicesPage />;
            case 'manage_servers': return <ManageServersPage />;
            case 'manage_operators': return <ManageOperatorsPage />;
            case 'manage_apis': return <ManageApisPage />;
            case 'number_history': return <NumberHistoryPage />;
            default: return <ContentPage title={sidebarItems.find(item => item.page === page)?.name || 'Page'} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <div className={`fixed inset-0 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
                <Sidebar page={page} setPage={setPage} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>
            {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
            
            <div className="hidden md:flex flex-shrink-0">
                <Sidebar page={page} setPage={setPage} />
            </div>
            
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
                    <button className="md:hidden" onClick={() => setSidebarOpen(true)}><MenuIcon /></button>
                    <form onSubmit={handleGlobalSearch} className="relative w-1/3">
                            <input value={globalSearchTerm} onChange={e => setGlobalSearchTerm(e.target.value)} placeholder="Search user by email..." className="w-full border-gray-300 rounded-md pl-10" />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </form>
                    <div className="flex items-center space-x-4">
                        <select onChange={(e) => setCurrency(e.target.value)} className="border-gray-300 rounded-md">
                            <option value="USD">USD</option>
                            <option value="PKR">PKR</option>
                            <option value="INR">INR</option>
                        </select>
                        <p className="font-medium">{admin?.email}</p>
                         {/* Back to Website Button */}
                        <a href="/" className="px-3 py-1 text-sm font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                            Back to Site
                        </a>
                        <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-semibold text-sm">Logout</button>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};


// --- Main Admin Component ---

export default function AdminPanelApp() {
    const [user, setUser] = useState(auth.currentUser);
    const [loading, setLoading] = useState(!auth.currentUser);

    useEffect(() => {
        // Double check auth state locally, though Main App likely handles this.
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100"><Spinner /></div>;
    }

    if (!user) {
         // Fallback if accessed directly without auth
        return <div className="min-h-screen flex items-center justify-center">Access Denied. Please log in via the main website.</div>;
    }
    
    return (
        <CurrencyProvider>
            <AdminPanel admin={user} />
        </CurrencyProvider>
    );
}

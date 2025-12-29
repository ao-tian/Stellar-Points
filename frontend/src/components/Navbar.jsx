import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useMemo } from "react";
import useAuthStore from "../store/authStore";
import { cn } from "../lib/cn";

const REGULAR_LINKS = [
    { to: "/me", label: "Home" },
    { to: "/me/profile", label: "Profile" },
    { to: "/me/qr", label: "My QR" },
    { to: "/me/points", label: "My Points" },
    { to: "/events", label: "Events" },
    { to: "/me/transactions", label: "Transactions" },
    { to: "/me/transfer", label: "Transfer" },
    { to: "/me/redeem", label: "Redeem" },
    { to: "/me/promotions", label: "Promotions" },
];

// Primary links shown in header (keep Transactions and Transfer visible)
const PRIMARY_REGULAR_LINKS = REGULAR_LINKS.slice(0, 7); // Home through Transfer
const MORE_REGULAR_LINKS = REGULAR_LINKS.slice(7); // Redeem and Promotions

const INTERFACE_ROUTES = {
    regular: "/me",
    cashier: "/cashier",
    manager: "/manager/users",
    organizer: "/organizer/events",
    superuser: "/superuser/users",
};

const DRAWER_ID = "primary-nav-drawer";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuthStore((s) => s.user);
    const hasRole = useAuthStore((s) => s.hasRole);
    const logout = useAuthStore((s) => s.logout);

    const role = user ? String(user.role || "regular").toLowerCase() : null;

    const cashierLinks = useMemo(
        () => [
            { to: "/cashier", label: "Dashboard" },
        ],
        [],
    );

    const managerLinks = useMemo(
        () => {
            const links = [
                { to: "/manager/users", label: "Users" },
                { to: "/manager/transactions", label: "Transactions" },
                { to: "/manager/promotions", label: "Promotions" },
                { to: "/manager/events", label: "Events" },
            ];
            return links;
        },
        [],
    );

    const superuserLinks = useMemo(
        () => {
            const links = [
                { to: "/superuser/users", label: "Users" },
                { to: "/superuser/transactions", label: "Transactions" },
                { to: "/superuser/promotions", label: "Promotions" },
                { to: "/superuser/events", label: "Events" },
                { to: "/superuser/superuser-info", label: "Superuser Info" },
            ];
            return links;
        },
        [],
    );

    const organizerLinks = useMemo(
        () => [
            { to: "/organizer/events", label: "Events" },
        ],
        [],
    );

    const interfaceOptions = useMemo(() => {
        if (!user) return [];
        const role = String(user.role || "regular").toLowerCase();
        
        // Superuser can access all interfaces
        if (role === "superuser") {
            return [
                { key: "regular", label: "Regular", path: INTERFACE_ROUTES.regular },
                { key: "cashier", label: "Cashier", path: INTERFACE_ROUTES.cashier },
                { key: "manager", label: "Manager", path: INTERFACE_ROUTES.manager },
                { key: "organizer", label: "Organizer", path: INTERFACE_ROUTES.organizer },
                { key: "superuser", label: "Superuser", path: INTERFACE_ROUTES.superuser },
            ];
        }
        
        // Manager can only access manager interface (no dropdown)
        if (role === "manager") {
            return []; // Empty array means no dropdown shown
        }
        
        // Regular users with additional roles
        const options = [
            { key: "regular", label: "Regular", path: INTERFACE_ROUTES.regular },
        ];
        if (hasRole("cashier")) {
            options.push({
                key: "cashier",
                label: "Cashier",
                path: INTERFACE_ROUTES.cashier,
            });
        }
        if (hasRole("organizer")) {
            options.push({
                key: "organizer",
                label: "Organizer",
                path: INTERFACE_ROUTES.organizer,
            });
        }
        return options;
    }, [user, hasRole]);

    const navGroups = useMemo(() => {
        if (!user) return [];
        const groups = [
            { key: "regular", title: "My experience", links: REGULAR_LINKS },
        ];
        if (hasRole("cashier")) {
            groups.push({ key: "cashier", title: "Cashier tools", links: cashierLinks });
        }
        if (hasRole("manager")) {
            groups.push({ key: "manager", title: "Manager admin", links: managerLinks });
        }
        if (hasRole("superuser")) {
            groups.push({ key: "superuser", title: "Superuser admin", links: superuserLinks });
        }
        if (hasRole("organizer")) {
            groups.push({ key: "organizer", title: "Event organizer", links: organizerLinks });
        }
        return groups;
    }, [user, hasRole, cashierLinks, managerLinks, superuserLinks, organizerLinks]);

    const currentInterface = useMemo(() => {
        if (!user) return "";
        // Determine interface based on current pathname, not user role
        if (location.pathname.startsWith("/superuser")) {
            return "superuser";
        }
        if (location.pathname.startsWith("/manager")) {
            return "manager";
        }
        if (location.pathname.startsWith("/cashier")) return "cashier";
        if (location.pathname.startsWith("/organizer")) return "organizer";
        return "regular";
    }, [location.pathname, user]);

    const closeDrawer = useCallback(() => {
        if (typeof document === "undefined") return;
        const toggle = document.getElementById(DRAWER_ID);
        if (toggle && toggle instanceof HTMLInputElement) {
            toggle.checked = false;
        }
    }, []);

    const handleInterfaceChange = useCallback(
        (event) => {
            const next = interfaceOptions.find(
                (option) => option.key === event.target.value,
            );
            if (next) navigate(next.path);
        },
        [interfaceOptions, navigate],
    );

    const handleLogout = useCallback(() => {
        logout();
        navigate("/login", { replace: true });
        closeDrawer();
    }, [logout, navigate, closeDrawer]);

    const inlineLinkClass = useCallback(
        ({ isActive }) =>
            cn(
                "btn btn-ghost btn-sm rounded-full px-4 text-base font-medium normal-case",
                isActive
                    ? "bg-brand-100 text-brand-700"
                    : "text-neutral/80 hover:text-brand-600",
            ),
        [],
    );

    const drawerLinkClass = useCallback(
        ({ isActive }) =>
            cn(
                "text-base font-medium",
                isActive ? "text-brand-600" : "text-neutral/80",
            ),
        [],
    );

    const drawerMenu = user ? (
        <div className="flex h-full flex-col gap-4 p-4">
            <div className="rounded-2xl border border-base-200 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-neutral/60">
                    Signed in
                </p>
                <p className="text-lg font-semibold text-neutral">
                    {user.utorid}
                </p>
                <p className="text-sm capitalize text-neutral/70">{role}</p>
            </div>
            {navGroups.map((group) => (
                <div key={group.key}>
                    <p className="text-xs uppercase tracking-wide text-neutral/50">
                        {group.title}
                    </p>
                    <ul className="menu mt-1 rounded-2xl bg-transparent p-0">
                        {group.links.map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    className={drawerLinkClass}
                                    onClick={closeDrawer}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            {interfaceOptions.length > 1 && (
                <div className="form-control">
                    <label className="text-xs uppercase text-neutral/60">
                        Switch interface
                    </label>
                    <select
                        className="select select-bordered mt-1 border-2 border-neutral-300 bg-white text-neutral hover:border-neutral-500 hover:bg-neutral-50 focus:border-black focus:bg-white focus:outline-none transition-colors duration-200 cursor-pointer px-4 py-2"
                        value={currentInterface}
                        onChange={(event) => {
                            closeDrawer();
                            handleInterfaceChange(event);
                        }}
                    >
                        {interfaceOptions.map((option) => (
                            <option key={option.key} value={option.key}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <button
                type="button"
                className="btn btn-outline mt-auto"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    ) : (
        <div className="flex h-full flex-col gap-4 p-4">
            <p className="text-sm text-neutral">
                You are not signed in. Use the button below to log in.
            </p>
            <NavLink
                to="/login"
                className="btn btn-primary"
                onClick={closeDrawer}
            >
                Login
            </NavLink>
        </div>
    );

    return (
        <>
            <header className="sticky top-0 z-40 border-b border-base-200/70 bg-white/90 backdrop-blur shadow-sm">
                <div className="mx-auto flex w-full max-w-7xl items-center gap-6 px-4 py-3 lg:px-6">
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {user && (
                            <label
                                htmlFor={DRAWER_ID}
                                className="btn btn-ghost btn-square btn-sm lg:hidden"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                </svg>
                                <span className="sr-only">Open navigation</span>
                            </label>
                        )}
                        <NavLink 
                            to="/" 
                            className="flex items-center transition-opacity hover:opacity-80 whitespace-nowrap"
                        >
                            <span 
                                className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight"
                                style={{
                                    backgroundImage: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 50%, #4f46e5 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                StellarPoints
                            </span>
                        </NavLink>
                    </div>

                    {user && (
                        <nav className="hidden flex-1 items-center justify-start gap-1 ml-4 lg:flex">
                            {(() => {
                                // Show links based on current interface
                                if (currentInterface === "cashier") {
                                    return cashierLinks.map((link) => (
                                        <NavLink
                                            key={link.to}
                                            to={link.to}
                                            className={inlineLinkClass}
                                        >
                                            {link.label}
                                        </NavLink>
                                    ));
                                }
                                if (currentInterface === "manager") {
                                    return managerLinks.map((link) => (
                                        <NavLink
                                            key={link.to}
                                            to={link.to}
                                            className={inlineLinkClass}
                                        >
                                            {link.label}
                                        </NavLink>
                                    ));
                                }
                                if (currentInterface === "superuser") {
                                    return superuserLinks.map((link) => (
                                        <NavLink
                                            key={link.to}
                                            to={link.to}
                                            className={inlineLinkClass}
                                        >
                                            {link.label}
                                        </NavLink>
                                    ));
                                }
                                if (currentInterface === "organizer") {
                                    return organizerLinks.map((link) => (
                                        <NavLink
                                            key={link.to}
                                            to={link.to}
                                            className={inlineLinkClass}
                                        >
                                            {link.label}
                                        </NavLink>
                                    ));
                                }
                                // Regular interface - show primary links + "More" dropdown
                                return (
                                    <>
                                        {PRIMARY_REGULAR_LINKS.map((link) => (
                                            <NavLink
                                                key={link.to}
                                                to={link.to}
                                                className={inlineLinkClass}
                                            >
                                                {link.label}
                                            </NavLink>
                                        ))}
                                        {MORE_REGULAR_LINKS.length > 0 && (
                                            <div className="dropdown dropdown-end">
                                                <label tabIndex={0} className={cn(inlineLinkClass({ isActive: false }), "cursor-pointer flex items-center gap-1")}>
                                                    More
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="2"
                                                        stroke="currentColor"
                                                        className="h-3 w-3"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                                        />
                                                    </svg>
                                                </label>
                                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 border border-base-200 shadow-lg p-2 mt-2">
                                                    {MORE_REGULAR_LINKS.map((link) => (
                                                        <li key={link.to}>
                                                            <NavLink
                                                                to={link.to}
                                                                className={({ isActive }) =>
                                                                    cn(
                                                                        "rounded-lg",
                                                                        isActive ? "bg-brand-100 text-brand-700" : "hover:bg-base-200"
                                                                    )
                                                                }
                                                            >
                                                                {link.label}
                                                            </NavLink>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </nav>
                    )}

                    <div className="flex items-center gap-3 flex-shrink-0">
                        {user && interfaceOptions.length > 1 && (
                            <select
                                className="select select-bordered select-sm hidden lg:block min-w-[140px] border-2 border-neutral-300 bg-white text-neutral hover:border-neutral-500 hover:bg-neutral-50 focus:border-black focus:bg-white focus:outline-none transition-colors duration-200 cursor-pointer px-4 py-2"
                                value={currentInterface}
                                onChange={handleInterfaceChange}
                            >
                                {interfaceOptions.map((option) => (
                                    <option key={option.key} value={option.key}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                        {user ? (
                            <div className="flex items-center gap-2 lg:gap-3">
                                <div className="hidden text-right text-sm lg:block whitespace-nowrap">
                                    <div className="font-medium text-neutral">
                                        {user.utorid}
                                    </div>
                                    <div className="text-xs text-neutral/60 capitalize">
                                        {role}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm whitespace-nowrap"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            location.pathname !== "/login" && 
                            location.pathname !== "/signup" && 
                            location.pathname !== "/forgot-password" && 
                            location.pathname !== "/reset-password" && (
                                <NavLink
                                    to="/login"
                                    className="btn btn-primary btn-sm whitespace-nowrap"
                                >
                                    Login
                                </NavLink>
                            )
                        )}
                    </div>
                </div>
            </header>

            <div className="drawer drawer-end lg:hidden">
                <input id={DRAWER_ID} type="checkbox" className="drawer-toggle" />
                <div className="drawer-content" />
                <div className="drawer-side z-50">
                    <label htmlFor={DRAWER_ID} className="drawer-overlay" />
                    <div className="w-80 max-w-[80vw] bg-base-100">{drawerMenu}</div>
                </div>
            </div>
        </>
    );
}

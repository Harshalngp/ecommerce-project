import { NavLink, useNavigate, useSearchParams } from 'react-router';
import { useState, useEffect } from 'react';
import CartIcon from '../assets/images/icons/cart-icon.png';
import SearchIcon from '../assets/images/icons/search-icon.png';
import LogoWhite from '../assets/images/logo-white.png';
import MobileLogoWhite from '../assets/images/mobile-logo-white.png';
import './header.css';
import { useAuth } from '../context/AuthContext';

export function Header({ cart }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated, logout, user } = useAuth();
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // derive a simple display name, prefer username over email prefix
    const getDisplayName = (user) => {
        if (!user) return '';
        const name = user.username || user.name || user.email || '';
        return name.includes('@') ? name.split('@')[0] : name;
    };

    // close dropdown when clicking outside
    useEffect(() => {
        const handleClick = (e) => {
            if (!e.target.closest('.user-menu-container')) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const searchText = searchParams.get('search');

    // || '' is a shortcut. It means if searchText does not exist
    // it will use a default value of ''.
    const [search, setSearch] = useState(searchText || '');

    const updateSearchInput = (event) => {
        setSearch(event.target.value);
    };

    const searchProducts = () => {
        navigate(`/?search=${search}`);
    };

    let totalQuantity = 0;

    cart.forEach((cartItem) => {
        totalQuantity += cartItem.quantity;
    });

    return (
        <div className="header">
            <div className="left-section">
                <NavLink to="/" className="header-link">
                    <img className="logo"
                        src={LogoWhite} />
                    <img className="mobile-logo"
                        src={MobileLogoWhite} />
                </NavLink>
            </div>

            <div className="middle-section">
                <input className="search-bar" type="text" placeholder="Search"
                    value={search} onChange={updateSearchInput} />

                <button className="search-button">
                    <img className="search-icon" src={SearchIcon}
                        onClick={searchProducts} />
                </button>
            </div>

            <div className="right-section">
                {isAuthenticated && user && (
                    <>
                        <NavLink className="orders-link header-link" to="/orders">
                            <span className="orders-text">Orders</span>
                        </NavLink>

                        <NavLink className="cart-link header-link" to="/checkout">
                            <img className="cart-icon" src={CartIcon} />
                            <div className="cart-quantity">{totalQuantity}</div>
                            <div className="cart-text">Cart</div>
                        </NavLink>


                        {/* user icon at far right; clicking shows username */}
                        <div className="user-menu-container">
                            <button
                                className="user-icon-button"
                                onClick={() => setUserMenuOpen((o) => !o)}
                                title="User menu"
                            >
                                👤
                            </button>
                            {userMenuOpen && (
                                <div className="user-dropdown">
                                    {/* only show username/handle, no email/fullname */}
                                    <div className="user-dropdown-item">
                                        Hello, {getDisplayName(user)}
                                    </div>
                                    <button
                                        className="user-dropdown-item logout-dropdown"
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            logout();
                                            navigate('/');
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

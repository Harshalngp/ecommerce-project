import {Header} from '../components/Header';
import './NotFoundPage.css';

function NotFoundPage() {
    return (
        <>
            <title>404 Page Not Found</title>
            <link rel="icon" type="image/svg+xml" href="home-favicon.png" />

            <Header />
            <div className="not-found-page">
                <h1>404 - Not Found</h1>
                <p>The page you are looking for does not exist.</p>
            </div>
        </>
    );
}

export default NotFoundPage;

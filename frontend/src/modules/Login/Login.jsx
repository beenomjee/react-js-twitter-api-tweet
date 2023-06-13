import { useEffect, useState } from 'react'
import { loginWithTwitter } from '../../firebase'
import styles from './Login.module.scss'
import { Loader } from '../../components';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const onTwitterLogin = () => {
        setIsLoading(true);
        loginWithTwitter((result) => {
            localStorage.setItem('loginInfo', JSON.stringify(result));
            navigate('/', { replace: true });
            setIsLoading(false);
        }, (err) => {
            console.log(err);
            alert('Something went wrong!');
            setIsLoading(false);
        });
    }

    useEffect(() => {
        if (localStorage.getItem('loginInfo'))
            navigate('/', { replace: true });
        else
            setIsLoading(false);
    }, [navigate])

    return (
        isLoading ? (
            <div className="loader">
                <Loader />
            </div>
        ) : (
            <div className={styles.container}>
                <button onClick={onTwitterLogin}>Login with Twitter</button>
            </div>
        )
    )
}

export default Login
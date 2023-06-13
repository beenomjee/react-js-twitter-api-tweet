import { useEffect, useRef, useState } from 'react';
import styles from './Home.module.scss'
import axios from 'axios';
import { Loader } from '../../components'
import { useNavigate } from 'react-router-dom';
import { logoutFromTwitter } from '../../firebase';
import { BiLogOut } from 'react-icons/bi'

const Home = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('')
    const [image, setImage] = useState('');
    const ref = useRef(null);
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.removeItem('loginInfo');
        logoutFromTwitter(() => navigate('/login'));
    }

    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { secret, token } = JSON.parse(localStorage.getItem('loginInfo'))
            if (!secret || !token) {
                alert('Something went wrong!')
                return onLogout();
            }

            const { data } = await axios.post('http://localhost:3001/api/v1/tweet', {
                message,
                image,
                secret,
                token
            })
            alert(data.message);
            setIsLoading(false);
            setImage('');
            setMessage('');
        } catch (error) {
            alert('Something went wrong!. Please try again!');
            console.log(error);
            setIsLoading(false);
        }
    }

    const onImageChange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => setImage(reader.result);
        reader.readAsDataURL(file);
    }

    const onLoad = () => {
        ref.current.style.display = 'inline';
    }
    const onError = () => {
        ref.current.style.display = 'none';
    }

    useEffect(() => {
        if (!localStorage.getItem('loginInfo'))
            navigate('/login', { replace: true });
        else
            setIsLoading(false);

    }, [navigate])

    return (
        isLoading ? (
            <div className="loader"><Loader /></div>
        ) : (
            <div className={styles.container}>
                <form onSubmit={onSubmit}>
                    <h1>Make a tweet</h1>
                    <label>
                        <span>Message</span>
                        <div>
                            <textarea placeholder="What's your message?" required value={message} onChange={e => setMessage(e.target.value)} />
                        </div>
                    </label>
                    <label>
                        <span>Image</span>
                        <div>
                            <img ref={ref} src={image} onError={onError} onLoad={onLoad} />
                            <input type="file" accept="image/*" required onChange={onImageChange} />
                        </div>
                    </label>
                    <button type="submit">Tweet</button>
                </form>
                <button onClick={onLogout}><BiLogOut /></button>
            </div>
        )
    )
}

export default Home
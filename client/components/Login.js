export default function Login({ signIn }) {
    
    return (
        <div className="login">
            <h1>Connectez-vous</h1>
            <button onClick={signIn}>Google</button>
        </div>
    )
}
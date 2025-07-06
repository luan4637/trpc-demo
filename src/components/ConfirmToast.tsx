export default function ConfirmToast({ message, closeToast, onConfirm }: any)
{
    return (
        <div>
            <p>{message}?</p>
            <button onClick={() => { onConfirm(); closeToast(); }}>Yes</button>
            <button onClick={() => { closeToast(); }}>No</button>
        </div>
    )
}
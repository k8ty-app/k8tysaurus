import React, { useEffect, useState } from 'react';

const DangerButton = (props) => {

    const {
        message,
        onConfirm,
        onError
    } = { ...props }

    const display = ["🚀🚀🚀", `!!! ${message} !!!`, "1", "2", "3", message];

    const [index, setIndex] = useState(5);
    const [ttl, setTtl] = useState(null);
    const [msg, setMsg] = useState(message);

    const countDown = () => {
        setIndex(index - 1);
    }

    useEffect(() => {
        clearTimeout(ttl);
        setMsg(display[index]);
        if (index == 0) {
            onConfirm().catch(err => {setMsg(onError)});
        }
        else {
            setTtl(setTimeout(() => setIndex(5), 3000));
        }
    }, [index]);

    return (
        <button onClick={countDown} disabled={index == 0} className="button button--danger button--block">{msg}</button>
    )
};

export default DangerButton;
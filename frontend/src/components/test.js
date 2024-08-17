import React, { useEffect, useState } from "react";

function TestComponent({ api }) {
    const [value, setValue] = useState("");

    function apiCall() {
        fetch("/api/" + api)
            .then(res => res.json())
            .then(data => {
                setValue(data.body);
            });
    }

    useEffect(() => {
        apiCall();
    })

    return (
        <div>
            {value ? value : "bad connection for " + api}
        </div>
    )
}

export default TestComponent;
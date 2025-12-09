import http  from  "k6/http"
import { check, sleep } from "k6"

export const options = {
    stages :[
        { duration: "30s", target: 200 },
        { duration: "1m", target: 200 },
        { duration: "30s", target: 0 }, 
    ]
}

export default () => {
    const res = http.get("http://localhost:5000/users")
    check(res, {
        "is status 200": (r) => r.status === 200,
    })
    sleep(1)
}
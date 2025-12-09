import http from 'k6/http';
import { check, sleep } from 'k6';

//spike test 
export const options = {
    stages: [
        { duration: '2m', target: 50 },
        { duration: '2m', target: 2000 }, 
        { duration: '1m', target: 0 },   
    ]
};

export default () => {
    const res = http.get('http://localhost:5000/designs');
    check(res, {
        'is status 200': (r) => r.status === 200,
    });
    sleep(1);
}
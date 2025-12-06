import http from 'k6/http';
import { check, sleep } from 'k6';


export const options = {
    stages: [
        { duration: '10m', target: 200 }, 
        { duration: '20m', target: 200 }, 
        { duration: '10m', target: 0 },   
    ]
};

export default () => {
    const res = http.get('http://localhost:5000/readycakes');
    check(res, {
        'is status 200': (r) => r.status === 200,
    });
}
sleep(1);
import { createFetch } from '@vueuse/core';

let baseUrl;

const request = createFetch({
    baseUrl,
    combination: 'chain',
    options: {
        timeout: 20000,
        immediate: false, 
        onFetchError(req) {
            const { error } = req;
            // console.log("Fetch Error: ", req, error.name, error.code, error.message);
            switch(error.code){
                case 400:
                    req.error = 'Bad request! please try again.'
                    break;
                case 401:
                    req.error = 'User is not authenticated! Kindly try login again.'
                    break;
                case 403:
                    req.error = 'Request failed! URL was forbidden, please try again.'
                    break;
                case 404:
                    req.error = 'Request not found, please try again.'
                    break;
                case 422:
                    req.error = 'Unprocess the request, please try again.'
                    break;
                case 500:
                    req.error = 'Server error, unable to get the response.'
                    break;
                default:
                    req.error = 'Unable to fetch information. Kindly try login again.' 
                    break;
            }
            return req;
            
        },
        // beforeFetch in pre-configured instance will only run when the newly spawned instance do not pass beforeFetch
        beforeFetch({ url, options }) {
            console.log("Pre Configured Before Fetch", options, options.body, url);
            console.log(options);
            return { url, options }
        },
        afterFetch(response) {
            // console.log("After Fetch");
            if (response) return response;
            return;
        }
    }
});

export default request;
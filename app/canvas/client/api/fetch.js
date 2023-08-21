/* private abstract requests */
import { ERequest } from '../types/apiData.js';
const request = async (url, requestType) => {
    return await fetch(url, { method: requestType })
        .then((response) => response.json())
        .then((data) => {
        if (data.status === 200) {
            return data;
        }
        return data;
    });
};
const postRequest = async (url, objString) => {
    return await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: objString, // Send JSON data in the request body
    });
};
/* public requests */
export const getCanvasById = async (id) => {
    return await request(`/canvas/${id}`, ERequest.GET);
};
export const removeCanvasById = async (id) => {
    const data = await request(`/canvas/${id}`, ERequest.DELETE);
    if (data.status !== 200) {
        console.log('ERROR: Cant delete canvas');
    }
    else {
        console.log('Successfully deleted.');
    }
};
export const getAllCanvases = async () => {
    return await request('api/all-canvas', ERequest.GET);
};
export const postCanvasSubmission = async () => {
    const canvasForm = document.getElementById('canvas-form');
    const formData = new FormData(canvasForm);
    formData.append('hostId', localStorage.getItem('hostId') || ''); // Append host_id to form data
    const obj = {
        name: formData.get('name'),
        hostId: formData.get('hostId'),
    };
    return await postRequest('api/create', JSON.stringify(obj));
};

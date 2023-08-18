const getRequest = async (url) => {
    return fetch(url)
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
export const getCanvasById = async (id) => {
    return await getRequest(`/canvas/${id}`);
};
export const removeCanvasById = async (id) => {
    const data = await getRequest(`/canvas/remove/${id}`);
    if (data.status === 200) {
        console.log('SUCCESS: Canvas deleted');
    }
    else {
        console.log('ERROR: Cant delete canvas');
    }
};
export const getAllCanvases = async () => {
    return await getRequest('api/all-canvas');
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

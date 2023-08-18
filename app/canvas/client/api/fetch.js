/* private abstract requests */
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
    return await request(`/canvas/${id}`, T_CRUD.GET);
};
export const removeCanvasById = async (id) => {
    const data = await request(`/canvas/remove/${id}`, T_CRUD.DELETE);
    if (data.status !== 200) {
        console.log('ERROR: Cant delete canvas');
    }
};
export const getAllCanvases = async () => {
    return await request('api/all-canvas', T_CRUD.GET);
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
var T_CRUD;
(function (T_CRUD) {
    T_CRUD["GET"] = "GET";
    T_CRUD["POST"] = "POST";
    T_CRUD["DELETE"] = "DELETE";
    T_CRUD["UPDATE"] = "UPDATE";
})(T_CRUD || (T_CRUD = {}));

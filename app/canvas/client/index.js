const canvasForm = document.getElementById('canvas-form');
const canvasListElement = document.getElementById('canvas-list');
const createCanvasButton = (id) => {
    const btn = document.createElement('button');
    btn.innerHTML = id;
    btn.addEventListener('click', () => {
        // Redirect to the canvas page using the canvas ID
        window.location.href = `/canvas/${id}`;
    });
    return btn;
};
// Fetch the canvas list from the server
const fetchCanvases = async () => {
    fetch('api/all-canvas')
        .then((response) => response.json())
        .then((data) => {
        if (data.status === 200) {
            const canvasList = data.list;
            // Loop through the canvasList and create list items
            const listItems = canvasList.map((canvas) => {
                const liContainer = document.createElement('li');
                const listItem = createCanvasButton(canvas.canvas_id);
                listItem.innerHTML = `${canvas.name}`;
                liContainer.appendChild(listItem);
                return liContainer;
            });
            // Append the list items to the canvasListElement
            listItems.forEach((listItem) => {
                canvasListElement.appendChild(listItem);
            });
        }
        else {
            // Handle the error case
            console.error(data.message);
        }
    })
        .catch((error) => {
        console.error('An error occurred:', error);
    });
};
const createCanvasInstance = async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally
    const formData = new FormData(canvasForm);
    formData.append('hostId', localStorage.getItem('hostId') || ''); // Append host_id to form data
    const obj = {
        name: formData.get('name'),
        hostId: formData.get('hostId'),
    };
    const response = await fetch('api/create', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj), // Send JSON data in the request body
    });
    if (response.ok) {
        // Handle success
        const body = await response.json();
        console.log('Form submitted successfully');
        // Set the hostId in localStorage
        localStorage.setItem('hostId', body.msg.hostId);
        const btn = createCanvasButton(body.msg.canvasId);
        canvasListElement.appendChild(btn);
        // Refresh the page or perform other actions
    }
    else {
        // Handle error
        console.error('Form submission failed');
    }
};
/* init */
canvasForm.addEventListener('submit', createCanvasInstance);
fetchCanvases();

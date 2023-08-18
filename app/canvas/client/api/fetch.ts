const getRequest = async (url: string) => {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        return data;
      }
      return data;
    });
};

const postRequest = async (url: string, objString: string) => {
  return await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: objString, // Send JSON data in the request body
  });
};

export const getCanvasById = async (id: string): Promise<T_ApiData> => {
  return await getRequest(`/canvas/${id}`);
};

export const removeCanvasById = async (id: string) => {
  const data = await getRequest(`/canvas/remove/${id}`);
  if (data.status === 200) {
    console.log('SUCCESS: Canvas deleted');
  } else {
    console.log('ERROR: Cant delete canvas');
  }
};

export const getAllCanvases = async (): Promise<T_ApiData> => {
  return await getRequest('api/all-canvas');
};

export const postCanvasSubmission = async () => {
  const canvasForm = document.getElementById('canvas-form');
  const formData = new FormData(canvasForm as HTMLFormElement);
  formData.append('hostId', localStorage.getItem('hostId') || ''); // Append host_id to form data

  const obj = {
    name: formData.get('name'),
    hostId: formData.get('hostId'),
  };
  return await postRequest('api/create', JSON.stringify(obj));
};

export type T_ApiData = {
  status: number;
  content?: any;
};

export type T_CanvasData = {
  name: string;
  canvas_id: string;
  host_id: string;
};

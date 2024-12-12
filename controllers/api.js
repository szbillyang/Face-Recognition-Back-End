const returnClarifaiRequestOptions = (imageUrl) => {
    const PAT = process.env.PAT;
    const USER_ID = 'szbillyang';
    const APP_ID = 'face';
    
  
    const IMAGE_URL = imageUrl;
  
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
          }
        ]
    });
  
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
    return requestOptions;
}


const handleAPI = async (req, res) => {
    const { imageUrl } = req.body;
  
    // Generate the request options for Clarifai API call
    const requestOptions = returnClarifaiRequestOptions(imageUrl);
  
    try {
      // Send request to Clarifai API
      const response = await fetch('https://api.clarifai.com/v2/models/face-detection/outputs', requestOptions);
      const result = await response.json();
  
      if (response.ok) {
        // Extract and return bounding box data
        const regions = result.outputs[0].data.regions;
        const faceData = regions.map(region => {
          const boundingBox = region.region_info.bounding_box;
  
          return {
            boundingBox: {
              topRow: boundingBox.top_row.toFixed(3),
              leftCol: boundingBox.left_col.toFixed(3),
              bottomRow: boundingBox.bottom_row.toFixed(3),
              rightCol: boundingBox.right_col.toFixed(3)
            },
            concepts: region.data.concepts.map(concept => ({
              name: concept.name,
              value: concept.value.toFixed(4)
            }))
          };
        });
  
        // Send the response with the face data
        res.status(200).json(faceData);
      } else {
        // If the API response is not ok, send the status and result back to the client
        res.status(response.status).json(result);
      }
    } catch (error) {
      // If there is an error, log it and send a 500 response
      console.error('Error fetching Clarifai API:', error);
      res.status(500).json({ error: 'Failed to fetch Clarifai API' });
    }
}

module.exports = {
    handleAPI
}
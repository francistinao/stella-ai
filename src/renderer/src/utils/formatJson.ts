export const formatJson = (jsonString: string) => {
    // Remove slashes
    const cleanedJsonString = jsonString.replace(/\\/g, '');
    // Parse JSON string
    const jsonObject = JSON.parse(cleanedJsonString);
    // Convert string representation of array to array
    jsonObject.hemmoragic.Lesion_Boundary_Points = JSON.parse(jsonObject.hemmoragic.Lesion_Boundary_Points);
    jsonObject.ischemic.Lesion_Boundary_Points = JSON.parse(jsonObject.ischemic.Lesion_Boundary_Points);
    // Convert JSON object back to string without slashes
    const formattedJsonString = JSON.stringify(jsonObject);
    return formattedJsonString;
}